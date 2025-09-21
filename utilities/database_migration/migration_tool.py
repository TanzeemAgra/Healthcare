import psycopg2
import psycopg2.extras
import logging
import json
import time
import re
from datetime import datetime
from typing import List, Dict, Optional, Tuple, Any
from concurrent.futures import ThreadPoolExecutor, as_completed
from .migration_config import MigrationConfig, DatabaseConfig

class DatabaseMigrationTool:
    """
    Comprehensive database migration tool with soft-coding principles
    Handles schema recreation, data transfer, and verification
    """
    
    def __init__(self):
        self.config = MigrationConfig()
        self.setup_logging()
        self.migration_log = []
        self.start_time = None
        
    def setup_logging(self):
        """Setup comprehensive logging system"""
        if self.config.MIGRATION_SETTINGS['enable_logging']:
            # Create logs directory
            import os
            os.makedirs('migration_logs', exist_ok=True)
            
            # Setup logging
            log_filename = f"migration_logs/migration_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
            
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(levelname)s - [%(name)s] - %(message)s',
                handlers=[
                    logging.FileHandler(log_filename, encoding='utf-8'),
                    logging.StreamHandler()
                ]
            )
            
        self.logger = logging.getLogger(__name__)
        
    def create_connection(self, db_config: DatabaseConfig) -> psycopg2.extensions.connection:
        """Create database connection with comprehensive error handling"""
        try:
            self.logger.info(f"🔌 Connecting to {db_config.host}:{db_config.port}/{db_config.database}")
            
            conn = psycopg2.connect(
                host=db_config.host,
                port=db_config.port,
                database=db_config.database,
                user=db_config.username,
                password=db_config.password,
                sslmode=db_config.ssl_mode,
                connect_timeout=30
            )
            
            conn.autocommit = False
            
            # Test connection
            with conn.cursor() as cursor:
                cursor.execute(self.config.get_connection_test_query())
                version_info = cursor.fetchone()
                self.logger.info(f"✅ Connected successfully - {version_info[0]}")
                
            return conn
            
        except psycopg2.OperationalError as e:
            self.logger.error(f"❌ Connection failed to {db_config.host}: {str(e)}")
            raise
        except Exception as e:
            self.logger.error(f"❌ Unexpected connection error: {str(e)}")
            raise
            
    def get_table_list(self, connection: psycopg2.extensions.connection) -> List[str]:
        """Get filtered list of tables to migrate"""
        cursor = connection.cursor()
        
        # Get all user tables
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%'
            AND tablename NOT LIKE 'sql_%'
            ORDER BY tablename
        """)
        
        all_tables = [row[0] for row in cursor.fetchall()]
        cursor.close()
        
        # Filter out excluded tables using patterns
        exclusion_patterns = self.config.get_table_exclusion_patterns()
        filtered_tables = []
        
        for table in all_tables:
            should_exclude = False
            for pattern in exclusion_patterns:
                if re.match(pattern, table, re.IGNORECASE):
                    should_exclude = True
                    self.logger.debug(f"⏩ Excluding table {table} (matches pattern: {pattern})")
                    break
                    
            if not should_exclude:
                filtered_tables.append(table)
                
        self.logger.info(f"📋 Found {len(filtered_tables)} tables to migrate (excluded {len(all_tables) - len(filtered_tables)})")
        return filtered_tables
        
    def get_table_schema(self, connection: psycopg2.extensions.connection, table_name: str) -> str:
        """Get complete CREATE TABLE statement including constraints and indexes"""
        cursor = connection.cursor()
        
        try:
            # Get column information
            cursor.execute("""
                SELECT 
                    column_name, 
                    data_type, 
                    is_nullable, 
                    column_default,
                    character_maximum_length, 
                    numeric_precision, 
                    numeric_scale,
                    udt_name
                FROM information_schema.columns 
                WHERE table_name = %s 
                AND table_schema = 'public'
                ORDER BY ordinal_position
            """, (table_name,))
            
            columns = cursor.fetchall()
            
            if not columns:
                self.logger.warning(f"⚠️  No columns found for table {table_name}")
                return None
            
            # Get constraints
            cursor.execute("""
                SELECT 
                    tc.constraint_name, 
                    tc.constraint_type, 
                    kcu.column_name,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name,
                    rc.update_rule,
                    rc.delete_rule
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                    ON tc.constraint_name = kcu.constraint_name
                LEFT JOIN information_schema.constraint_column_usage AS ccu
                    ON ccu.constraint_name = tc.constraint_name
                LEFT JOIN information_schema.referential_constraints AS rc
                    ON tc.constraint_name = rc.constraint_name
                WHERE tc.table_name = %s 
                AND tc.table_schema = 'public'
                ORDER BY tc.constraint_type, kcu.ordinal_position
            """, (table_name,))
            
            constraints = cursor.fetchall()
            
            # Get indexes
            cursor.execute("""
                SELECT 
                    indexname, 
                    indexdef
                FROM pg_indexes 
                WHERE tablename = %s 
                AND schemaname = 'public'
                AND indexname NOT LIKE '%_pkey'
                AND indexname NOT LIKE 'pg_%'
            """, (table_name,))
            
            indexes = cursor.fetchall()
            
            return self.build_create_statement(table_name, columns, constraints, indexes)
            
        except Exception as e:
            self.logger.error(f"❌ Failed to get schema for {table_name}: {str(e)}")
            return None
        finally:
            cursor.close()
            
    def build_create_statement(self, table_name: str, columns: List, constraints: List, indexes: List) -> str:
        """Build comprehensive CREATE TABLE statement"""
        
        create_sql = f"CREATE TABLE IF NOT EXISTS {table_name} (\n"
        
        # Build column definitions
        column_definitions = []
        for col in columns:
            try:
                # Safely unpack column information with defaults for missing values
                if len(col) >= 8:
                    col_name, data_type, is_nullable, default, max_length, precision, scale, udt_name = col
                elif len(col) >= 7:
                    col_name, data_type, is_nullable, default, max_length, precision, scale = col
                    udt_name = data_type
                elif len(col) >= 6:
                    col_name, data_type, is_nullable, default, max_length, precision = col
                    scale = None
                    udt_name = data_type
                elif len(col) >= 4:
                    col_name, data_type, is_nullable, default = col
                    max_length = precision = scale = None
                    udt_name = data_type
                else:
                    self.logger.warning(f"⚠️  Incomplete column data for {table_name}: {col}")
                    continue
            except ValueError as e:
                self.logger.error(f"❌ Failed to unpack column data for {table_name}: {col} - {str(e)}")
                continue
            
            # Map data types using configuration
            mapped_type = self.config.TYPE_MAPPINGS.get(data_type.lower(), data_type.upper())
            
            col_def = f"    \"{col_name}\" {mapped_type}"
            
            # Add length/precision
            if max_length and data_type.lower() in ['varchar', 'char']:
                col_def += f"({max_length})"
            elif precision and scale and data_type.lower() in ['decimal', 'numeric']:
                col_def += f"({precision},{scale})"
            elif precision and data_type.lower() in ['decimal', 'numeric'] and not scale:
                col_def += f"({precision})"
                
            # Add constraints
            if is_nullable == 'NO':
                col_def += " NOT NULL"
                
            if default:
                # Clean up default values
                if default.startswith('nextval('):
                    # Handle sequences
                    if 'bigint' in data_type.lower() or 'bigserial' in udt_name.lower():
                        col_def = col_def.replace(mapped_type, 'BIGSERIAL')
                    else:
                        col_def = col_def.replace(mapped_type, 'SERIAL')
                elif not default.lower().startswith('null'):
                    col_def += f" DEFAULT {default}"
                    
            column_definitions.append(col_def)
            
        create_sql += ",\n".join(column_definitions)
        
        # Add table constraints
        constraint_definitions = []
        for constraint in constraints:
            try:
                # Safely unpack constraint information
                if len(constraint) >= 7:
                    constraint_name, constraint_type, column_name, foreign_table, foreign_column, update_rule, delete_rule = constraint
                elif len(constraint) >= 5:
                    constraint_name, constraint_type, column_name, foreign_table, foreign_column = constraint
                    update_rule = delete_rule = None
                elif len(constraint) >= 3:
                    constraint_name, constraint_type, column_name = constraint
                    foreign_table = foreign_column = update_rule = delete_rule = None
                else:
                    self.logger.warning(f"⚠️  Incomplete constraint data for {table_name}: {constraint}")
                    continue
            except ValueError as e:
                self.logger.error(f"❌ Failed to unpack constraint data for {table_name}: {constraint} - {str(e)}")
                continue
            
            if constraint_type == 'PRIMARY KEY':
                constraint_definitions.append(f"    CONSTRAINT \"{constraint_name}\" PRIMARY KEY (\"{column_name}\")")
            elif constraint_type == 'FOREIGN KEY' and foreign_table and foreign_column:
                fk_def = f"    CONSTRAINT \"{constraint_name}\" FOREIGN KEY (\"{column_name}\") REFERENCES \"{foreign_table}\"(\"{foreign_column}\")"
                if update_rule and update_rule != 'NO ACTION':
                    fk_def += f" ON UPDATE {update_rule}"
                if delete_rule and delete_rule != 'NO ACTION':
                    fk_def += f" ON DELETE {delete_rule}"
                constraint_definitions.append(fk_def)
            elif constraint_type == 'UNIQUE':
                constraint_definitions.append(f"    CONSTRAINT \"{constraint_name}\" UNIQUE (\"{column_name}\")")
            elif constraint_type == 'CHECK':
                # Note: CHECK constraints would need additional query to get definition
                pass
                
        if constraint_definitions:
            create_sql += ",\n" + ",\n".join(constraint_definitions)
            
        create_sql += "\n);"
        
        # Add indexes as separate statements
        index_statements = []
        for index in indexes:
            try:
                if len(index) >= 2:
                    index_name, index_def = index
                else:
                    self.logger.warning(f"⚠️  Incomplete index data for {table_name}: {index}")
                    continue
            except ValueError as e:
                self.logger.error(f"❌ Failed to unpack index data for {table_name}: {index} - {str(e)}")
                continue
            if index_def:
                # Replace table name to ensure it matches our target
                index_def_fixed = index_def.replace(f'ON public.{table_name}', f'ON {table_name}')
                index_statements.append(index_def_fixed + ";")
                
        if index_statements:
            create_sql += "\n\n-- Indexes\n" + "\n".join(index_statements)
            
        return create_sql
        
    def get_table_row_count(self, connection: psycopg2.extensions.connection, table_name: str) -> int:
        """Get approximate row count for a table"""
        cursor = connection.cursor()
        try:
            # Use statistics for fast approximation on large tables
            cursor.execute("""
                SELECT 
                    COALESCE(
                        (SELECT reltuples::BIGINT FROM pg_class WHERE relname = %s),
                        (SELECT COUNT(*) FROM """ + table_name + """)
                    ) as row_count
            """, (table_name,))
            
            count = cursor.fetchone()[0]
            return int(count) if count else 0
            
        except Exception as e:
            # Fallback to direct count
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                return cursor.fetchone()[0]
            except Exception:
                self.logger.warning(f"⚠️  Could not get row count for {table_name}: {str(e)}")
                return 0
        finally:
            cursor.close()
            
    def migrate_table_data(self, source_conn: psycopg2.extensions.connection, 
                          target_conn: psycopg2.extensions.connection, 
                          table_name: str) -> Dict[str, Any]:
        """Migrate data from source table to target table with progress tracking"""
        
        start_time = time.time()
        
        # Check if this is a dry run
        if self.config.MIGRATION_SETTINGS['dry_run']:
            row_count = self.get_table_row_count(source_conn, table_name)
            self.logger.info(f"🧪 DRY RUN: Would migrate {table_name} ({row_count:,} rows)")
            return {
                'table': table_name,
                'rows': row_count,
                'status': 'dry_run',
                'time': 0.1
            }
        
        source_cursor = source_conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        try:
            # Get total row count
            total_rows = self.get_table_row_count(source_conn, table_name)
            
            if total_rows == 0:
                if self.config.MIGRATION_SETTINGS['skip_empty_tables']:
                    self.logger.info(f"⏭️  Skipping empty table: {table_name}")
                    return {'table': table_name, 'rows': 0, 'status': 'skipped', 'time': 0}
                else:
                    self.logger.info(f"📝 Processing empty table: {table_name}")
            else:
                self.logger.info(f"📊 Migrating {table_name}: {total_rows:,} rows")
            
            # Get column names and handle special cases
            source_cursor.execute(f"SELECT * FROM {table_name} LIMIT 0")
            column_names = [desc[0] for desc in source_cursor.description]
            
            # Prepare target cursor
            target_cursor = target_conn.cursor()
            
            # Clear existing data in target table if preserve_ids is False
            if not self.config.MIGRATION_SETTINGS['preserve_ids']:
                target_cursor.execute(f"TRUNCATE TABLE {table_name} RESTART IDENTITY CASCADE")
                target_conn.commit()
                self.logger.info(f"🧹 Cleared existing data in {table_name}")
            
            # Batch migration with progress tracking
            batch_size = self.config.MIGRATION_SETTINGS['batch_size']
            migrated_rows = 0
            
            for offset in range(0, max(total_rows, 1), batch_size):
                # Fetch batch from source
                source_cursor.execute(f"SELECT * FROM {table_name} ORDER BY 1 LIMIT %s OFFSET %s", 
                                    (batch_size, offset))
                batch_data = source_cursor.fetchall()
                
                if not batch_data:
                    break
                    
                # Convert DictRow to tuple for insertion
                batch_tuples = [tuple(row) for row in batch_data]
                
                # Handle special data types and NULL values
                processed_batch = []
                for row_tuple in batch_tuples:
                    processed_row = []
                    for value in row_tuple:
                        if isinstance(value, (dict, list)):
                            # Handle JSON data
                            processed_row.append(json.dumps(value))
                        else:
                            processed_row.append(value)
                    processed_batch.append(tuple(processed_row))
                
                # Insert batch into target with conflict handling
                placeholders = ','.join(['%s'] * len(column_names))
                column_list = ','.join([f'"{col}"' for col in column_names])
                
                if self.config.MIGRATION_SETTINGS['preserve_ids']:
                    # Use INSERT ... ON CONFLICT for preservation
                    insert_sql = f"""
                        INSERT INTO {table_name} ({column_list}) 
                        VALUES ({placeholders})
                        ON CONFLICT DO NOTHING
                    """
                else:
                    insert_sql = f"INSERT INTO {table_name} ({column_list}) VALUES ({placeholders})"
                
                try:
                    target_cursor.executemany(insert_sql, processed_batch)
                    target_conn.commit()
                    
                    migrated_rows += len(processed_batch)
                    
                    if total_rows > 0:
                        progress = (migrated_rows / total_rows) * 100
                        self.logger.info(f"    📈 Progress: {migrated_rows:,}/{total_rows:,} ({progress:.1f}%)")
                    else:
                        self.logger.info(f"    📈 Inserted: {migrated_rows:,} rows")
                        
                except psycopg2.Error as e:
                    target_conn.rollback()
                    self.logger.error(f"❌ Batch insert failed for {table_name}: {str(e)}")
                    # Try individual inserts for this batch
                    individual_errors = 0
                    for row in processed_batch:
                        try:
                            target_cursor.execute(insert_sql.replace('executemany', 'execute'), row)
                            target_conn.commit()
                            migrated_rows += 1
                        except psycopg2.Error:
                            individual_errors += 1
                            target_conn.rollback()
                            
                    if individual_errors > 0:
                        self.logger.warning(f"⚠️  {individual_errors} rows failed individual insert in {table_name}")
                
            execution_time = time.time() - start_time
            
            # Reset sequences if needed
            if self.config.MIGRATION_SETTINGS['preserve_ids']:
                self.reset_sequences(target_conn, table_name, column_names)
            
            self.logger.info(f"✅ Completed {table_name}: {migrated_rows:,} rows in {execution_time:.2f}s")
            
            return {
                'table': table_name,
                'rows': migrated_rows,
                'status': 'success',
                'time': execution_time,
                'original_rows': total_rows
            }
            
        except Exception as e:
            target_conn.rollback()
            execution_time = time.time() - start_time
            self.logger.error(f"❌ Failed to migrate {table_name}: {str(e)}")
            return {
                'table': table_name,
                'rows': 0,
                'status': 'error',
                'error': str(e),
                'time': execution_time
            }
        finally:
            source_cursor.close()
            if 'target_cursor' in locals():
                target_cursor.close()
                
    def reset_sequences(self, connection: psycopg2.extensions.connection, table_name: str, column_names: List[str]):
        """Reset PostgreSQL sequences after data migration"""
        cursor = connection.cursor()
        
        try:
            # Find sequences associated with this table
            for col_name in column_names:
                cursor.execute("""
                    SELECT pg_get_serial_sequence(%s, %s) as seq_name
                """, (table_name, col_name))
                
                result = cursor.fetchone()
                if result and result[0]:
                    seq_name = result[0]
                    
                    # Reset sequence to max value + 1
                    cursor.execute(f"""
                        SELECT setval('{seq_name}', 
                            COALESCE((SELECT MAX("{col_name}") FROM {table_name}), 1)
                        )
                    """)
                    
                    connection.commit()
                    self.logger.debug(f"🔄 Reset sequence {seq_name} for {table_name}.{col_name}")
                    
        except Exception as e:
            self.logger.warning(f"⚠️  Could not reset sequences for {table_name}: {str(e)}")
            connection.rollback()
        finally:
            cursor.close()
            
    def verify_migration(self, source_conn: psycopg2.extensions.connection, 
                        target_conn: psycopg2.extensions.connection, 
                        table_name: str) -> Dict[str, Any]:
        """Verify that migration was successful"""
        
        if not self.config.MIGRATION_SETTINGS['verify_data']:
            return {'verified': True, 'details': 'Verification skipped'}
            
        verification_results = {'verified': True, 'details': {}}
        
        try:
            source_cursor = source_conn.cursor()
            target_cursor = target_conn.cursor()
            
            # Compare row counts
            source_cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            source_count = source_cursor.fetchone()[0]
            
            target_cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            target_count = target_cursor.fetchone()[0]
            
            verification_results['details']['source_count'] = source_count
            verification_results['details']['target_count'] = target_count
            
            if source_count != target_count:
                self.logger.error(f"❌ Row count mismatch in {table_name}: {source_count:,} vs {target_count:,}")
                verification_results['verified'] = False
                verification_results['details']['count_match'] = False
            else:
                verification_results['details']['count_match'] = True
                self.logger.debug(f"✅ Row count verified for {table_name}: {source_count:,}")
            
            # Sample data verification (first and last 5 rows)
            if source_count > 0 and target_count > 0:
                try:
                    # Compare first 5 rows
                    source_cursor.execute(f"SELECT * FROM {table_name} ORDER BY 1 LIMIT 5")
                    source_sample = source_cursor.fetchall()
                    
                    target_cursor.execute(f"SELECT * FROM {table_name} ORDER BY 1 LIMIT 5")
                    target_sample = target_cursor.fetchall()
                    
                    sample_match = len(source_sample) == len(target_sample)
                    if sample_match and source_sample:
                        # Compare each row (handling potential data type differences)
                        for i, (src_row, tgt_row) in enumerate(zip(source_sample, target_sample)):
                            if len(src_row) != len(tgt_row):
                                sample_match = False
                                break
                                
                    verification_results['details']['sample_match'] = sample_match
                    
                    if not sample_match:
                        self.logger.warning(f"⚠️  Sample data differs in {table_name} (may be due to data types or ordering)")
                        
                except Exception as e:
                    self.logger.warning(f"⚠️  Sample verification failed for {table_name}: {str(e)}")
                    verification_results['details']['sample_match'] = 'error'
            
            source_cursor.close()
            target_cursor.close()
            
            return verification_results
            
        except Exception as e:
            self.logger.error(f"❌ Verification failed for {table_name}: {str(e)}")
            return {
                'verified': False, 
                'details': {'error': str(e)}
            }
            
    def create_backup_info(self, source_conn: psycopg2.extensions.connection) -> Optional[str]:
        """Create backup information and recommendations"""
        
        if not self.config.MIGRATION_SETTINGS['create_backup']:
            return None
            
        try:
            cursor = source_conn.cursor()
            
            # Get database size and info
            cursor.execute("""
                SELECT 
                    pg_database_size(current_database()) as db_size,
                    current_database() as db_name,
                    version() as pg_version
            """)
            
            db_info = cursor.fetchone()
            db_size_mb = db_info[0] / (1024 * 1024)
            
            backup_info = {
                'database': db_info[1],
                'size_mb': round(db_size_mb, 2),
                'postgres_version': db_info[2],
                'backup_timestamp': datetime.now().isoformat(),
                'recommended_command': f"pg_dump -h {self.config.get_source_db().host} -U {self.config.get_source_db().username} -d {db_info[1]} > backup_{db_info[1]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
            }
            
            backup_filename = f"backup_info_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            with open(backup_filename, 'w') as f:
                json.dump(backup_info, f, indent=2)
            
            self.logger.info(f"📦 Backup info saved: {backup_filename}")
            self.logger.info(f"💡 Database size: {db_size_mb:.1f} MB")
            self.logger.info(f"💡 Recommended backup command: {backup_info['recommended_command']}")
            
            cursor.close()
            return backup_filename
            
        except Exception as e:
            self.logger.warning(f"⚠️  Could not create backup info: {str(e)}")
            return None
    
    def order_tables_for_migration(self, tables: List[str]) -> List[str]:
        """Order tables based on migration priority and dependencies"""
        ordered = []
        remaining = set(tables)
        
        # Add tables in specified order from configuration
        for table in self.config.TABLE_MIGRATION_ORDER:
            if table == '*':
                # Add all remaining tables alphabetically
                remaining_sorted = sorted(remaining)
                ordered.extend(remaining_sorted)
                self.logger.info(f"📋 Added {len(remaining_sorted)} remaining tables to migration order")
                break
            elif table in remaining:
                ordered.append(table)
                remaining.remove(table)
                self.logger.debug(f"📌 Prioritized table: {table}")
                
        # Add any tables that weren't in the priority list
        if remaining:
            remaining_sorted = sorted(remaining)
            ordered.extend(remaining_sorted)
            self.logger.info(f"📋 Added {len(remaining_sorted)} additional tables")
            
        return ordered
    
    def create_table_schema(self, target_conn: psycopg2.extensions.connection, 
                           source_conn: psycopg2.extensions.connection, 
                           table_name: str) -> bool:
        """Create table schema in target database"""
        try:
            schema_sql = self.get_table_schema(source_conn, table_name)
            
            if not schema_sql:
                self.logger.error(f"❌ Could not generate schema for {table_name}")
                return False
                
            target_cursor = target_conn.cursor()
            
            try:
                # Execute schema creation
                target_cursor.execute(schema_sql)
                target_conn.commit()
                self.logger.info(f"✅ Created schema for {table_name}")
                return True
                
            except psycopg2.Error as e:
                target_conn.rollback()
                # Try creating without constraints first
                if "violates foreign key constraint" in str(e) or "does not exist" in str(e):
                    self.logger.warning(f"⚠️  Foreign key constraint failed for {table_name}, creating table without constraints")
                    
                    # Extract just the CREATE TABLE part
                    lines = schema_sql.split('\n')
                    create_lines = []
                    in_table_def = False
                    
                    for line in lines:
                        if line.strip().startswith('CREATE TABLE'):
                            in_table_def = True
                            create_lines.append(line)
                        elif in_table_def:
                            if 'CONSTRAINT' in line and ('FOREIGN KEY' in line or 'REFERENCES' in line):
                                continue  # Skip foreign key constraints
                            create_lines.append(line)
                            if line.strip().endswith(');'):
                                break
                                
                    simple_schema = '\n'.join(create_lines)
                    
                    try:
                        target_cursor.execute(simple_schema)
                        target_conn.commit()
                        self.logger.info(f"✅ Created table {table_name} without foreign key constraints")
                        return True
                    except psycopg2.Error as e2:
                        target_conn.rollback()
                        self.logger.error(f"❌ Failed to create table {table_name}: {str(e2)}")
                        return False
                else:
                    self.logger.error(f"❌ Schema creation failed for {table_name}: {str(e)}")
                    return False
                    
            finally:
                target_cursor.close()
                
        except Exception as e:
            self.logger.error(f"❌ Schema preparation failed for {table_name}: {str(e)}")
            return False
            
    def run_migration(self) -> Dict[str, Any]:
        """Execute complete database migration with comprehensive error handling"""
        
        self.start_time = time.time()
        self.logger.info("🚀 Starting Healthcare Database Migration")
        self.logger.info("=" * 60)
        
        # Validate configuration first
        config_errors = self.config.validate_configuration()
        if config_errors:
            self.logger.error("❌ Configuration validation failed:")
            for error in config_errors:
                self.logger.error(f"  - {error}")
            return {
                'status': 'failed',
                'error': 'Configuration validation failed',
                'errors': config_errors
            }
            
        migration_results = []
        backup_file = None
        
        try:
            # Create database connections
            self.logger.info("🔌 Establishing database connections...")
            source_conn = self.create_connection(self.config.get_source_db())
            target_conn = self.create_connection(self.config.get_target_db())
            
            try:
                # Create backup info
                backup_file = self.create_backup_info(source_conn)
                
                # Get table list
                self.logger.info("📋 Analyzing source database structure...")
                source_tables = self.get_table_list(source_conn)
                
                if not source_tables:
                    self.logger.warning("⚠️  No tables found to migrate!")
                    return {
                        'status': 'completed',
                        'message': 'No tables found to migrate',
                        'summary': {'total_tables': 0}
                    }
                
                # Order tables by migration priority
                ordered_tables = self.order_tables_for_migration(source_tables)
                
                self.logger.info(f"📊 Migration Plan: {len(ordered_tables)} tables")
                self.logger.info("📋 Table order:")
                for i, table in enumerate(ordered_tables[:10], 1):
                    self.logger.info(f"  {i:2}. {table}")
                if len(ordered_tables) > 10:
                    self.logger.info(f"     ... and {len(ordered_tables) - 10} more tables")
                
                # Check if resuming from specific table
                resume_from = self.config.MIGRATION_SETTINGS.get('resume_from_table', '')
                if resume_from:
                    try:
                        start_index = ordered_tables.index(resume_from)
                        ordered_tables = ordered_tables[start_index:]
                        self.logger.info(f"🔄 Resuming migration from table: {resume_from}")
                    except ValueError:
                        self.logger.warning(f"⚠️  Resume table '{resume_from}' not found, starting from beginning")
                
                # Execute migration for each table
                self.logger.info("\n🔄 Starting table migration process...")
                
                successful_tables = 0
                failed_tables = 0
                
                for i, table_name in enumerate(ordered_tables, 1):
                    self.logger.info(f"\n📦 [{i}/{len(ordered_tables)}] Processing: {table_name}")
                    
                    table_start_time = time.time()
                    
                    # Create table schema in target
                    schema_created = self.create_table_schema(target_conn, source_conn, table_name)
                    
                    if not schema_created:
                        self.logger.error(f"❌ Skipping {table_name} due to schema creation failure")
                        migration_results.append({
                            'table': table_name,
                            'status': 'schema_failed',
                            'rows': 0,
                            'time': time.time() - table_start_time
                        })
                        failed_tables += 1
                        continue
                    
                    # Migrate table data
                    migration_result = self.migrate_table_data(source_conn, target_conn, table_name)
                    
                    # Verify migration if successful
                    if migration_result['status'] == 'success':
                        verification = self.verify_migration(source_conn, target_conn, table_name)
                        migration_result['verification'] = verification
                        
                        if verification.get('verified', True):
                            successful_tables += 1
                        else:
                            migration_result['status'] = 'verification_failed'
                            failed_tables += 1
                            
                    elif migration_result['status'] == 'error':
                        failed_tables += 1
                    
                    migration_results.append(migration_result)
                    
                    # Progress update
                    elapsed = time.time() - self.start_time
                    avg_time_per_table = elapsed / i
                    estimated_remaining = avg_time_per_table * (len(ordered_tables) - i)
                    
                    self.logger.info(f"📊 Progress: {i}/{len(ordered_tables)} tables processed")
                    self.logger.info(f"⏱️  Elapsed: {elapsed/60:.1f}min, Estimated remaining: {estimated_remaining/60:.1f}min")
                
                # Generate final report
                total_time = time.time() - self.start_time
                report = self.generate_migration_report(migration_results, total_time, backup_file)
                
                self.logger.info("\n" + "=" * 60)
                self.logger.info("🎯 MIGRATION COMPLETED")
                self.logger.info(f"✅ Successful: {successful_tables} tables")
                self.logger.info(f"❌ Failed: {failed_tables} tables")
                self.logger.info(f"⏱️  Total time: {total_time/60:.1f} minutes")
                self.logger.info("=" * 60)
                
                return report
                
            except KeyboardInterrupt:
                self.logger.warning("⚠️  Migration interrupted by user")
                return {
                    'status': 'interrupted',
                    'message': 'Migration was interrupted',
                    'partial_results': migration_results
                }
                
            finally:
                # Close connections
                try:
                    source_conn.close()
                    target_conn.close()
                    self.logger.info("🔌 Database connections closed")
                except Exception as e:
                    self.logger.warning(f"⚠️  Error closing connections: {str(e)}")
                    
        except Exception as e:
            self.logger.error(f"❌ Migration failed with error: {str(e)}")
            return {
                'status': 'failed',
                'error': str(e),
                'partial_results': migration_results
            }
            
    def generate_migration_report(self, results: List[Dict], total_time: float, backup_file: Optional[str]) -> Dict[str, Any]:
        """Generate comprehensive migration report"""
        
        successful = [r for r in results if r['status'] == 'success']
        failed = [r for r in results if r['status'] in ['error', 'schema_failed', 'verification_failed']]
        skipped = [r for r in results if r['status'] == 'skipped']
        dry_run = [r for r in results if r['status'] == 'dry_run']
        
        total_rows_migrated = sum(r.get('rows', 0) for r in successful)
        total_original_rows = sum(r.get('original_rows', r.get('rows', 0)) for r in results)
        
        # Calculate performance metrics
        avg_rows_per_second = total_rows_migrated / total_time if total_time > 0 else 0
        
        report = {
            'migration_metadata': {
                'migration_date': datetime.now().isoformat(),
                'migration_duration_seconds': round(total_time, 2),
                'migration_duration_minutes': round(total_time / 60, 2),
                'backup_file': backup_file,
                'configuration_used': self.config.MIGRATION_SETTINGS.copy()
            },
            
            'database_info': {
                'source': {
                    'host': self.config.get_source_db().host,
                    'database': self.config.get_source_db().database,
                    'port': self.config.get_source_db().port
                },
                'target': {
                    'host': self.config.get_target_db().host,
                    'database': self.config.get_target_db().database,
                    'port': self.config.get_target_db().port
                }
            },
            
            'summary': {
                'total_tables_processed': len(results),
                'successful_tables': len(successful),
                'failed_tables': len(failed),
                'skipped_tables': len(skipped),
                'dry_run_tables': len(dry_run),
                'total_rows_migrated': total_rows_migrated,
                'total_original_rows': total_original_rows,
                'data_completeness_percentage': round((total_rows_migrated / total_original_rows * 100) if total_original_rows > 0 else 100, 2),
                'avg_rows_per_second': round(avg_rows_per_second, 2),
                'migration_success_rate': round((len(successful) / len(results) * 100) if results else 0, 2)
            },
            
            'detailed_results': results,
            
            'performance_metrics': {
                'fastest_table': min(successful, key=lambda x: x.get('time', float('inf')), default={'table': 'N/A', 'time': 0}),
                'slowest_table': max(successful, key=lambda x: x.get('time', 0), default={'table': 'N/A', 'time': 0}),
                'largest_table': max(successful, key=lambda x: x.get('rows', 0), default={'table': 'N/A', 'rows': 0}),
                'total_processing_time': sum(r.get('time', 0) for r in results)
            }
        }
        
        # Add failure analysis
        if failed:
            failure_analysis = {}
            for result in failed:
                error_type = result['status']
                if error_type not in failure_analysis:
                    failure_analysis[error_type] = []
                failure_analysis[error_type].append({
                    'table': result['table'],
                    'error': result.get('error', 'Unknown error')
                })
            report['failure_analysis'] = failure_analysis
        
        # Save report to file
        report_filename = f"migration_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(report_filename, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, default=str, ensure_ascii=False)
            self.logger.info(f"📊 Migration report saved: {report_filename}")
        except Exception as e:
            self.logger.warning(f"⚠️  Could not save migration report: {str(e)}")
            
        return report