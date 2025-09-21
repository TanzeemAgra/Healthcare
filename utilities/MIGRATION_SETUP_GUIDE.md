# Healthcare Database Migration Setup Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Access to both source (medixscandb) and target (Railways) databases
- Network connectivity to both database servers

### 1. Environment Setup ✅ COMPLETED
```bash
# Virtual environment has been created and dependencies installed
cd d:\alfiya\backend
# migration_env\ directory contains the isolated Python environment
```

### 2. Database Configuration (REQUIRED - USER ACTION NEEDED)

#### Update `.env.migration` with your actual database credentials:

```bash
# Copy the template and edit with your credentials
notepad .env.migration
```

**Required Settings:**
```env
# Source Database (PostgreSQL 15 - medixscandb)
SOURCE_DB_HOST=your_old_postgresql_host
SOURCE_DB_PORT=5432
SOURCE_DB_NAME=medixscandb
SOURCE_DB_USER=your_username
SOURCE_DB_PASSWORD=your_password
SOURCE_DB_SSL_MODE=require

# Target Database (Railways PostgreSQL)
TARGET_DB_HOST=your_railways_host
TARGET_DB_PORT=5432
TARGET_DB_NAME=your_railways_database
TARGET_DB_USER=your_railways_username
TARGET_DB_PASSWORD=your_railways_password
TARGET_DB_SSL_MODE=require

# Migration Settings (these are already optimized)
MIGRATION_BATCH_SIZE=1000
MIGRATION_TIMEOUT_SECONDS=1800
VERIFY_DATA=true
DRY_RUN=false
```

### 3. Running the Migration

#### Option A: PowerShell (Recommended)
```powershell
# Test migration (no data transfer)
.\run_migration.ps1 -DryRun

# Full migration
.\run_migration.ps1

# Resume from specific table
.\run_migration.ps1 -Resume "auth_user"

# Interactive session for manual commands
.\run_migration.ps1 -Shell
```

#### Option B: Batch File
```cmd
# Test migration
run_migration.bat dry-run

# Full migration  
run_migration.bat migrate

# Interactive shell
run_migration.bat shell
```

#### Option C: Direct Python (Advanced)
```bash
# Activate virtual environment first
.\migration_env\Scripts\Activate.ps1

# Then run migration
python migrate_database.py --help
python migrate_database.py --dry-run
python migrate_database.py
```

## 📊 Migration Features

### ✅ Completed Components
- **Soft-coded Configuration**: Environment-based settings for maximum flexibility
- **Batch Processing**: Efficient data transfer in configurable batches (default: 1000 rows)
- **Progress Tracking**: Real-time progress monitoring with performance metrics
- **Data Verification**: Automatic verification of migrated data integrity
- **Error Recovery**: Graceful error handling with resume capability
- **Dependency Management**: Proper table migration order handling foreign keys
- **Virtual Environment**: Isolated Python environment with all dependencies

### 🎯 Migration Process
1. **Schema Recreation**: Automatically recreates table structures in target database
2. **Dependency Ordering**: Migrates tables in correct order to handle foreign keys
3. **Batch Transfer**: Transfers data in efficient batches to prevent memory issues
4. **Progress Monitoring**: Shows real-time progress, speed, and estimated completion
5. **Verification**: Verifies row counts and data integrity after migration
6. **Reporting**: Generates comprehensive migration reports

### 📋 Supported Table Types
- **Healthcare Tables**: 50+ healthcare-specific tables pre-configured
- **Django System Tables**: auth_user, django_migrations, django_content_type, etc.
- **Application Tables**: All custom application tables
- **Automatic Discovery**: Discovers and migrates any additional tables

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify credentials in `.env.migration`
   - Check network connectivity to both databases
   - Ensure databases are accepting connections

2. **Migration Fails on Specific Table**
   - Use `--resume TABLE_NAME` to skip problematic tables
   - Check foreign key constraints
   - Review table-specific errors in the logs

3. **Performance Issues**
   - Reduce batch size: `--batch-size 500`
   - Check network bandwidth
   - Ensure target database has adequate resources

4. **Data Verification Fails**
   - Check for data type incompatibilities
   - Review excluded tables configuration
   - Use `--no-verify` to skip verification if needed

### Getting Help
```bash
# Show detailed help
python migrate_database.py --help

# Test connection without migration
python -c "from database_migration.migration_tool import DatabaseMigrationTool; tool = DatabaseMigrationTool(); print('Connection test passed!')"
```

## 📈 Migration Statistics
The migration tool will provide detailed statistics including:
- Total tables processed
- Successful/failed migrations
- Total rows migrated
- Migration duration and speed
- Performance metrics per table
- Data completeness percentage

## 🔒 Safety Features
- **Dry Run Mode**: Test migration without actual data transfer
- **Source Read-Only**: Never modifies source database
- **Batch Processing**: Prevents memory overflow
- **Error Recovery**: Resume from any point
- **Verification**: Ensures data integrity
- **Detailed Logging**: Complete audit trail

## 📁 Generated Files
After migration, you'll find:
- **Migration logs**: Detailed execution logs
- **Performance reports**: Speed and efficiency metrics  
- **Error reports**: Any issues encountered
- **Verification reports**: Data integrity checks

---

**Next Step**: Update `.env.migration` with your database credentials and run the migration!