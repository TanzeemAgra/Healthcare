import os
from dataclasses import dataclass
from typing import Dict, List, Optional
from urllib.parse import quote_plus

@dataclass
class DatabaseConfig:
    """Soft-coded database configuration"""
    host: str
    port: int
    database: str
    username: str
    password: str
    ssl_mode: str = 'require'
    
    @property
    def connection_string(self) -> str:
        """Generate PostgreSQL connection string with proper encoding"""
        encoded_password = quote_plus(self.password)
        return f"postgresql://{self.username}:{encoded_password}@{self.host}:{self.port}/{self.database}?sslmode={self.ssl_mode}"

class MigrationConfig:
    """Centralized migration configuration using soft-coding techniques"""
    
    # Source Database (Old PostgreSQL 15 - medixscandb)
    @classmethod
    def get_source_db(cls) -> DatabaseConfig:
        return DatabaseConfig(
            host=os.getenv('OLD_DB_HOST', 'localhost'),
            port=int(os.getenv('OLD_DB_PORT', '5432')),
            database=os.getenv('OLD_DB_NAME', 'medixscandb'),
            username=os.getenv('OLD_DB_USER', 'postgres'),
            password=os.getenv('OLD_DB_PASSWORD', ''),
            ssl_mode=os.getenv('OLD_DB_SSL', 'prefer')
        )
    
    # Target Database (New Railways)
    @classmethod
    def get_target_db(cls) -> DatabaseConfig:
        return DatabaseConfig(
            host=os.getenv('RAILWAY_DB_HOST', ''),
            port=int(os.getenv('RAILWAY_DB_PORT', '5432')),
            database=os.getenv('RAILWAY_DB_NAME', 'railway'),
            username=os.getenv('RAILWAY_DB_USER', 'postgres'),
            password=os.getenv('RAILWAY_DB_PASSWORD', ''),
            ssl_mode=os.getenv('RAILWAY_DB_SSL', 'require')
        )
    
    # Migration Settings (Soft-coded for flexibility)
    MIGRATION_SETTINGS = {
        'batch_size': int(os.getenv('MIGRATION_BATCH_SIZE', '1000')),
        'enable_logging': os.getenv('MIGRATION_LOGGING', 'true').lower() == 'true',
        'create_backup': os.getenv('CREATE_BACKUP', 'true').lower() == 'true',
        'skip_empty_tables': os.getenv('SKIP_EMPTY_TABLES', 'false').lower() == 'true',
        'preserve_ids': os.getenv('PRESERVE_IDS', 'true').lower() == 'true',
        'timeout_seconds': int(os.getenv('MIGRATION_TIMEOUT', '7200')),  # 2 hours default
        'parallel_tables': int(os.getenv('PARALLEL_TABLES', '2')),
        'verify_data': os.getenv('VERIFY_DATA', 'true').lower() == 'true',
        'dry_run': os.getenv('DRY_RUN', 'false').lower() == 'true',
        'resume_from_table': os.getenv('RESUME_FROM_TABLE', ''),
        'max_retries': int(os.getenv('MAX_RETRIES', '3'))
    }
    
    # Tables to migrate in dependency order (soft-coded priority)
    TABLE_MIGRATION_ORDER = [
        # Django core tables (must be first)
        'django_content_type',
        'auth_permission',
        'auth_group',
        'auth_user',
        'auth_group_permissions',
        'auth_user_groups',
        'auth_user_user_permissions',
        
        # Hospital core tables (dependencies handled)
        'hospital_userprofile',
        'hospital_hospitalmembership', 
        'hospital_department',
        'hospital_specialization',
        'hospital_insuranceprovider',
        
        # Patient and medical staff
        'hospital_patient',
        'hospital_doctor',
        'hospital_nurse',
        
        # Medical records and appointments
        'hospital_appointment',
        'hospital_medicalrecord',
        'hospital_prescription',
        'hospital_billing',
        'hospital_payment',
        
        # Laboratory and diagnostics
        'hospital_labtest',
        'hospital_labtestresult',
        'hospital_radiologytest',
        'hospital_pathologytest',
        
        # DNA Sequencing module tables
        'dna_sequencing_sample',
        'dna_sequencing_sequencingrun',
        'dna_sequencing_analysis',
        'dna_sequencing_variant',
        'dna_sequencing_report',
        'dna_sequencing_qualitymetrics',
        
        # Medicine and inventory
        'medicine_category',
        'medicine_medicine',
        'medicine_inventory',
        'medicine_supplier',
        'medicine_purchase',
        'medicine_prescription_medicine',
        
        # Dermatology module
        'dermatology_dermatologyappointment',
        'dermatology_skinlesion',
        'dermatology_treatment',
        'dermatology_followup',
        
        # Dentistry module
        'dentistry_dentalappointment',
        'dentistry_dentalrecord',
        'dentistry_treatment',
        'dentistry_procedure',
        
        # Homeopathy module
        'homeopathy_homeopathicappointment',
        'homeopathy_remedy',
        'homeopathy_treatment',
        'homeopathy_consultation',
        
        # Cosmetology module
        'cosmetology_cosmetologyappointment',
        'cosmetology_treatment',
        'cosmetology_procedure',
        'cosmetology_followup',
        
        # Subscriptions and billing
        'subscriptions_subscriptionplan',
        'subscriptions_usersubscription',
        'subscriptions_payment',
        'subscriptions_invoice',
        
        # Security and audit
        'secureneat_securitylog',
        'secureneat_audittrail',
        'secureneat_accesslog',
        
        # Netflix integration (if exists)
        'netflix_recommendation',
        'netflix_userpreference',
        'netflix_watchhistory',
        
        # Other tables (wildcard for auto-detection)
        '*'
    ]
    
    # Tables to exclude from migration (system tables and logs)
    EXCLUDED_TABLES = [
        # Django system tables that will be recreated
        'django_migrations',
        'django_admin_log',
        'django_session',
        
        # Temporary or cache tables
        'django_cache_*',
        'temp_*',
        'cache_*',
        
        # Log tables that can be skipped
        'auth_permission',  # Will be recreated by Django
        
        # Test tables
        'test_*',
        'tmp_*'
    ]
    
    # Data type mappings for cross-database compatibility
    TYPE_MAPPINGS = {
        'serial': 'SERIAL',
        'bigserial': 'BIGSERIAL',
        'text': 'TEXT',
        'varchar': 'VARCHAR',
        'char': 'CHAR',
        'integer': 'INTEGER',
        'bigint': 'BIGINT',
        'smallint': 'SMALLINT',
        'decimal': 'DECIMAL',
        'numeric': 'NUMERIC',
        'real': 'REAL',
        'double precision': 'DOUBLE PRECISION',
        'boolean': 'BOOLEAN',
        'date': 'DATE',
        'time': 'TIME',
        'timestamp': 'TIMESTAMP',
        'timestamptz': 'TIMESTAMP WITH TIME ZONE',
        'interval': 'INTERVAL',
        'json': 'JSON',
        'jsonb': 'JSONB',
        'uuid': 'UUID',
        'bytea': 'BYTEA'
    }
    
    @classmethod
    def validate_configuration(cls) -> List[str]:
        """Validate migration configuration and return any errors"""
        errors = []
        
        # Check required environment variables
        required_source = ['OLD_DB_HOST', 'OLD_DB_NAME', 'OLD_DB_USER', 'OLD_DB_PASSWORD']
        required_target = ['RAILWAY_DB_HOST', 'RAILWAY_DB_NAME', 'RAILWAY_DB_USER', 'RAILWAY_DB_PASSWORD']
        
        for var in required_source:
            if not os.getenv(var):
                errors.append(f"Missing source database configuration: {var}")
                
        for var in required_target:
            if not os.getenv(var):
                errors.append(f"Missing target database configuration: {var}")
        
        # Validate numeric settings
        try:
            batch_size = int(os.getenv('MIGRATION_BATCH_SIZE', '1000'))
            if batch_size <= 0:
                errors.append("MIGRATION_BATCH_SIZE must be positive")
        except ValueError:
            errors.append("MIGRATION_BATCH_SIZE must be a valid integer")
            
        try:
            timeout = int(os.getenv('MIGRATION_TIMEOUT', '7200'))
            if timeout <= 0:
                errors.append("MIGRATION_TIMEOUT must be positive")
        except ValueError:
            errors.append("MIGRATION_TIMEOUT must be a valid integer")
            
        return errors
    
    @classmethod
    def get_connection_test_query(cls) -> str:
        """Get a simple query to test database connectivity"""
        return "SELECT version(), current_database(), current_user"
    
    @classmethod
    def get_table_exclusion_patterns(cls) -> List[str]:
        """Get regex patterns for excluding tables"""
        patterns = []
        for pattern in cls.EXCLUDED_TABLES:
            if '*' in pattern:
                # Convert wildcard to regex
                regex_pattern = pattern.replace('*', '.*')
                patterns.append(f"^{regex_pattern}$")
            else:
                patterns.append(f"^{pattern}$")
        return patterns