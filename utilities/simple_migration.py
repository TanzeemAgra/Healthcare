#!/usr/bin/env python3
"""
Simplified Database Migration Tool
==================================

A direct approach to migrate data from PostgreSQL 15 to Railways 
without complex schema recreation - copy existing table structures.
"""

import psycopg2
import psycopg2.extras
import time
import sys
from datetime import datetime

def get_db_connection(host, port, database, user, password):
    """Create database connection"""
    return psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=user,
        password=password,
        cursor_factory=psycopg2.extras.RealDictCursor
    )

def get_table_list(conn):
    """Get list of tables to migrate"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    """)
    tables = [row['table_name'] for row in cursor.fetchall()]
    cursor.close()
    return tables

def get_table_structure(conn, table_name):
    """Get CREATE TABLE statement for a table"""
    cursor = conn.cursor()
    
    # Get the table creation SQL using pg_dump-like approach
    cursor.execute(f"""
        SELECT 
            'CREATE TABLE IF NOT EXISTS ' || quote_ident('{table_name}') || ' (' ||
            string_agg(
                quote_ident(column_name) || ' ' || 
                CASE 
                    WHEN data_type = 'character varying' THEN 
                        'VARCHAR' || CASE WHEN character_maximum_length IS NOT NULL 
                                         THEN '(' || character_maximum_length || ')' 
                                         ELSE '' END
                    WHEN data_type = 'character' THEN 
                        'CHAR(' || character_maximum_length || ')'
                    WHEN data_type = 'text' THEN 'TEXT'
                    WHEN data_type = 'integer' THEN 'INTEGER'
                    WHEN data_type = 'bigint' THEN 'BIGINT'
                    WHEN data_type = 'smallint' THEN 'SMALLINT'
                    WHEN data_type = 'boolean' THEN 'BOOLEAN'
                    WHEN data_type = 'date' THEN 'DATE'
                    WHEN data_type = 'timestamp without time zone' THEN 'TIMESTAMP'
                    WHEN data_type = 'timestamp with time zone' THEN 'TIMESTAMPTZ'
                    WHEN data_type = 'time without time zone' THEN 'TIME'
                    WHEN data_type = 'numeric' THEN 
                        'NUMERIC' || CASE WHEN numeric_precision IS NOT NULL 
                                         THEN '(' || numeric_precision || 
                                              CASE WHEN numeric_scale IS NOT NULL 
                                                   THEN ',' || numeric_scale 
                                                   ELSE '' END || ')'
                                         ELSE '' END
                    WHEN data_type = 'real' THEN 'REAL'
                    WHEN data_type = 'double precision' THEN 'DOUBLE PRECISION'
                    WHEN data_type = 'json' THEN 'JSON'
                    WHEN data_type = 'jsonb' THEN 'JSONB'
                    WHEN data_type = 'uuid' THEN 'UUID'
                    ELSE UPPER(data_type)
                END ||
                CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
                CASE WHEN column_default IS NOT NULL AND column_default NOT LIKE 'nextval%' 
                     THEN ' DEFAULT ' || column_default 
                     ELSE '' END,
                ', '
                ORDER BY ordinal_position
            ) || ');' as create_statement
        FROM information_schema.columns
        WHERE table_name = '{table_name}'
        AND table_schema = 'public'
    """)
    
    result = cursor.fetchone()
    cursor.close()
    return result['create_statement'] if result else None

def copy_table_data(source_conn, target_conn, table_name, batch_size=1000):
    """Copy data from source to target table"""
    
    source_cursor = source_conn.cursor()
    target_cursor = target_conn.cursor()
    
    try:
        # Get total row count
        source_cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        total_rows = source_cursor.fetchone()['count']
        
        if total_rows == 0:
            print(f"   📊 {table_name}: Empty table - skipped")
            return True
        
        print(f"   📊 {table_name}: {total_rows:,} rows")
        
        # Get column names
        source_cursor.execute(f"""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = '{table_name}' 
            AND table_schema = 'public'
            ORDER BY ordinal_position
        """)
        columns = [row['column_name'] for row in source_cursor.fetchall()]
        column_list = ', '.join([f'"{col}"' for col in columns])
        placeholders = ', '.join(['%s'] * len(columns))
        
        # Copy data in batches
        offset = 0
        copied_rows = 0
        
        while offset < total_rows:
            # Fetch batch from source
            source_cursor.execute(f"""
                SELECT {column_list} 
                FROM {table_name} 
                ORDER BY (SELECT NULL) 
                LIMIT {batch_size} OFFSET {offset}
            """)
            
            batch_data = source_cursor.fetchall()
            
            if not batch_data:
                break
            
            # Insert batch into target
            insert_sql = f"""
                INSERT INTO {table_name} ({column_list}) 
                VALUES ({placeholders})
                ON CONFLICT DO NOTHING
            """
            
            # Convert RealDictRow to tuple
            batch_tuples = [tuple(row[col] for col in columns) for row in batch_data]
            
            target_cursor.executemany(insert_sql, batch_tuples)
            target_conn.commit()
            
            copied_rows += len(batch_data)
            offset += batch_size
            
            # Progress indicator
            progress = (copied_rows / total_rows) * 100
            print(f"   ⏳ Progress: {copied_rows:,}/{total_rows:,} ({progress:.1f}%)")
        
        print(f"   ✅ {table_name}: {copied_rows:,} rows copied successfully")
        return True
        
    except Exception as e:
        print(f"   ❌ {table_name}: Failed - {str(e)}")
        target_conn.rollback()
        return False
        
    finally:
        source_cursor.close()
        target_cursor.close()

def main():
    print("🚀 SIMPLIFIED DATABASE MIGRATION")
    print("=" * 50)
    
    # Source database (medixscandb)
    print("📡 Connecting to source database...")
    source_conn = get_db_connection(
        host='localhost',
        port=5432,
        database='medixscandb',
        user='postgres',
        password='Tanzeem@12345'
    )
    print("✅ Source connection established")
    
    # Target database (Railway)
    print("📡 Connecting to target database...")
    target_conn = get_db_connection(
        host='tramway.proxy.rlwy.net',
        port=17931,
        database='railway',
        user='postgres',
        password='TCxaXngnBHmwihKBGYAlYxCPFeIqbGOi'
    )
    print("✅ Target connection established")
    
    try:
        # Get list of tables
        print("\\n📋 Discovering tables...")
        tables = get_table_list(source_conn)
        print(f"Found {len(tables)} tables to migrate")
        
        successful_tables = []
        failed_tables = []
        total_rows_migrated = 0
        start_time = time.time()
        
        # Process each table
        for i, table_name in enumerate(tables, 1):
            print(f"\\n📦 [{i}/{len(tables)}] Processing: {table_name}")
            
            try:
                # Create table structure in target
                print("   🏗️  Creating table structure...")
                create_sql = get_table_structure(source_conn, table_name)
                
                if create_sql:
                    target_cursor = target_conn.cursor()
                    target_cursor.execute(create_sql)
                    target_conn.commit()
                    target_cursor.close()
                    print("   ✅ Table structure created")
                    
                    # Copy data
                    if copy_table_data(source_conn, target_conn, table_name):
                        successful_tables.append(table_name)
                    else:
                        failed_tables.append(table_name)
                else:
                    print("   ❌ Could not generate table structure")
                    failed_tables.append(table_name)
                    
            except Exception as e:
                print(f"   ❌ Error: {str(e)}")
                failed_tables.append(table_name)
        
        # Summary
        duration = time.time() - start_time
        print("\\n" + "=" * 50)
        print("🎯 MIGRATION SUMMARY")
        print("=" * 50)
        print(f"✅ Successful tables: {len(successful_tables)}")
        print(f"❌ Failed tables: {len(failed_tables)}")
        print(f"⏱️  Total duration: {duration/60:.1f} minutes")
        
        if failed_tables:
            print("\\n❌ Failed tables:")
            for table in failed_tables[:10]:
                print(f"   - {table}")
            if len(failed_tables) > 10:
                print(f"   ... and {len(failed_tables) - 10} more")
        
        success_rate = (len(successful_tables) / len(tables)) * 100
        if success_rate >= 80:
            print(f"\\n🎉 Migration completed successfully! ({success_rate:.1f}% success rate)")
        else:
            print(f"\\n⚠️  Migration completed with issues ({success_rate:.1f}% success rate)")
            
    finally:
        source_conn.close()
        target_conn.close()
        print("\\n🔌 Database connections closed")

if __name__ == "__main__":
    main()