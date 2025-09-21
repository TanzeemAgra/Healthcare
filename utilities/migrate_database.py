#!/usr/bin/env python3
"""
Healthcare Database Migration Tool
==================================

A comprehensive migration tool for transferring data from the old PostgreSQL 15 
server (medixscandb) to the new Railways database using soft-coding techniques.

Usage:
    python migrate_database.py [options]

Options:
    --dry-run       Run migration in simulation mode (no actual data transfer)
    --resume TABLE  Resume migration from specific table
    --verify-only   Only verify existing migration without transferring data
    --help          Show this help message

Requirements:
    - Python 3.7+
    - psycopg2-binary
    - python-dotenv

Author: Healthcare Development Team
Version: 1.0.0
"""

import os
import sys
import argparse
import time
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

try:
    from dotenv import load_dotenv
    from database_migration.migration_tool import DatabaseMigrationTool
    from database_migration.migration_config import MigrationConfig
except ImportError as e:
    print(f"❌ Import Error: {str(e)}")
    print("\n📦 Please install required packages:")
    print("pip install psycopg2-binary python-dotenv")
    sys.exit(1)

def print_banner():
    """Print application banner"""
    banner = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                    Healthcare Database Migration Tool                        ║
║                                                                              ║
║     Migrating from: PostgreSQL 15 (medixscandb)                            ║
║     Migrating to:   Railways PostgreSQL                                     ║
║                                                                              ║
║     Features: Soft-coded configuration, batch processing,                   ║
║              progress tracking, data verification, error recovery            ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """
    print(banner)

def load_environment():
    """Load and validate environment configuration"""
    env_file = Path(__file__).parent / '.env.migration'
    
    if not env_file.exists():
        print(f"❌ Environment file not found: {env_file}")
        print("\n📝 Please create .env.migration file with your database credentials.")
        print("   Use the template provided in the repository.")
        return False
    
    print(f"📄 Loading configuration from: {env_file}")
    load_dotenv(env_file)
    
    # Validate configuration
    config = MigrationConfig()
    errors = config.validate_configuration()
    
    if errors:
        print("❌ Configuration validation failed:")
        for error in errors:
            print(f"  - {error}")
        print("\n💡 Please update your .env.migration file with correct values.")
        return False
    
    return True

def display_configuration_summary():
    """Display migration configuration summary"""
    config = MigrationConfig()
    source_db = config.get_source_db()
    target_db = config.get_target_db()
    settings = config.MIGRATION_SETTINGS
    
    print("\n📋 Migration Configuration Summary:")
    print("=" * 50)
    
    print(f"📊 Source Database:")
    print(f"   Host: {source_db.host}:{source_db.port}")
    print(f"   Database: {source_db.database}")
    print(f"   User: {source_db.username}")
    print(f"   SSL: {source_db.ssl_mode}")
    
    print(f"\n🎯 Target Database:")
    print(f"   Host: {target_db.host}:{target_db.port}")
    print(f"   Database: {target_db.database}")
    print(f"   User: {target_db.username}")
    print(f"   SSL: {target_db.ssl_mode}")
    
    print(f"\n⚙️  Migration Settings:")
    print(f"   Batch Size: {settings['batch_size']:,} rows")
    print(f"   Timeout: {settings['timeout_seconds']/60:.0f} minutes")
    print(f"   Parallel Tables: {settings['parallel_tables']}")
    print(f"   Verify Data: {'✅' if settings['verify_data'] else '❌'}")
    print(f"   Create Backup Info: {'✅' if settings['create_backup'] else '❌'}")
    print(f"   Skip Empty Tables: {'✅' if settings['skip_empty_tables'] else '❌'}")
    print(f"   Preserve IDs: {'✅' if settings['preserve_ids'] else '❌'}")
    print(f"   Dry Run: {'✅' if settings['dry_run'] else '❌'}")
    
    if settings.get('resume_from_table'):
        print(f"   Resume From: {settings['resume_from_table']}")

def get_user_confirmation():
    """Get user confirmation before starting migration"""
    print("\n⚠️  WARNING: This will migrate data between databases!")
    print("   - Source data will be READ (not modified)")
    print("   - Target database will be MODIFIED (tables created/populated)")
    print("   - Existing data in target may be overwritten")
    
    while True:
        response = input("\n🤔 Do you want to proceed? (yes/no/show-plan): ").strip().lower()
        
        if response in ['yes', 'y']:
            return True
        elif response in ['no', 'n']:
            return False
        elif response in ['show-plan', 'plan', 'p']:
            show_migration_plan()
        else:
            print("Please enter 'yes', 'no', or 'show-plan'")

def show_migration_plan():
    """Display the migration plan"""
    config = MigrationConfig()
    
    print("\n📋 Migration Plan:")
    print("=" * 40)
    print("Table Migration Order (first 20):")
    
    for i, table in enumerate(config.TABLE_MIGRATION_ORDER[:20], 1):
        if table == '*':
            print(f"  {i:2}. [Remaining tables in alphabetical order]")
            break
        else:
            print(f"  {i:2}. {table}")
    
    if len(config.TABLE_MIGRATION_ORDER) > 20:
        remaining = len(config.TABLE_MIGRATION_ORDER) - 20
        print(f"      ... and {remaining} more prioritized tables")
    
    print(f"\nExcluded Tables:")
    for pattern in config.EXCLUDED_TABLES[:10]:
        print(f"  - {pattern}")
    if len(config.EXCLUDED_TABLES) > 10:
        print(f"  ... and {len(config.EXCLUDED_TABLES) - 10} more patterns")

def run_migration_with_monitoring(migration_tool):
    """Run migration with progress monitoring and error handling"""
    print("\n🚀 Starting Database Migration...")
    print("=" * 50)
    
    start_time = time.time()
    
    try:
        # Run the migration
        result = migration_tool.run_migration()
        
        # Display results
        print("\n" + "=" * 50)
        print("🎯 MIGRATION RESULTS")
        print("=" * 50)
        
        if result.get('status') == 'failed':
            print(f"❌ Migration Failed: {result.get('error', 'Unknown error')}")
            if 'errors' in result:
                for error in result['errors']:
                    print(f"   - {error}")
            return False
            
        elif result.get('status') == 'interrupted':
            print("⚠️  Migration was interrupted by user")
            print("💡 Use --resume option to continue from where it left off")
            return False
            
        else:
            # Success case
            summary = result.get('summary', {})
            
            print(f"✅ Total Tables Processed: {summary.get('total_tables_processed', 0)}")
            print(f"✅ Successful Migrations: {summary.get('successful_tables', 0)}")
            print(f"❌ Failed Migrations: {summary.get('failed_tables', 0)}")
            print(f"⏩ Skipped Tables: {summary.get('skipped_tables', 0)}")
            print(f"📊 Total Rows Migrated: {summary.get('total_rows_migrated', 0):,}")
            print(f"📈 Data Completeness: {summary.get('data_completeness_percentage', 0):.1f}%")
            print(f"⏱️  Total Duration: {summary.get('migration_duration_minutes', 0):.1f} minutes")
            print(f"🚀 Average Speed: {summary.get('avg_rows_per_second', 0):.0f} rows/second")
            
            # Show performance metrics
            if 'performance_metrics' in result:
                perf = result['performance_metrics']
                print(f"\n📊 Performance Metrics:")
                print(f"   Fastest Table: {perf.get('fastest_table', {}).get('table', 'N/A')} "
                     f"({perf.get('fastest_table', {}).get('time', 0):.2f}s)")
                print(f"   Slowest Table: {perf.get('slowest_table', {}).get('table', 'N/A')} "
                     f"({perf.get('slowest_table', {}).get('time', 0):.2f}s)")
                print(f"   Largest Table: {perf.get('largest_table', {}).get('table', 'N/A')} "
                     f"({perf.get('largest_table', {}).get('rows', 0):,} rows)")
            
            # Show failure analysis if any
            if 'failure_analysis' in result and result['failure_analysis']:
                print(f"\n❌ Failure Analysis:")
                for error_type, failures in result['failure_analysis'].items():
                    print(f"   {error_type}: {len(failures)} tables")
                    for failure in failures[:3]:  # Show first 3
                        print(f"     - {failure['table']}: {failure['error'][:60]}...")
            
            success_rate = summary.get('migration_success_rate', 0)
            if success_rate >= 95:
                print(f"\n🎉 Migration completed successfully! ({success_rate:.1f}% success rate)")
                return True
            elif success_rate >= 80:
                print(f"\n⚠️  Migration completed with warnings ({success_rate:.1f}% success rate)")
                print("   Check the detailed report for failed tables")
                return True
            else:
                print(f"\n❌ Migration completed with significant issues ({success_rate:.1f}% success rate)")
                print("   Review failed tables and consider re-running with fixes")
                return False
                
    except KeyboardInterrupt:
        print("\n⚠️  Migration interrupted by user (Ctrl+C)")
        print("💡 Use --resume option to continue later")
        return False
        
    except Exception as e:
        print(f"\n❌ Unexpected error during migration: {str(e)}")
        return False

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Healthcare Database Migration Tool',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python migrate_database.py                    # Run full migration
  python migrate_database.py --dry-run         # Simulate migration
  python migrate_database.py --resume auth_user # Resume from auth_user table
  python migrate_database.py --verify-only     # Only verify existing data
        """
    )
    
    parser.add_argument('--dry-run', 
                       action='store_true',
                       help='Run in simulation mode without actual data transfer')
    
    parser.add_argument('--resume',
                       metavar='TABLE',
                       help='Resume migration from specified table')
    
    parser.add_argument('--verify-only',
                       action='store_true',
                       help='Only verify existing migration without transferring data')
    
    parser.add_argument('--batch-size',
                       type=int,
                       help='Override default batch size for data transfer')
    
    parser.add_argument('--no-verify',
                       action='store_true',
                       help='Skip data verification after migration')
    
    return parser.parse_args()

def main():
    """Main migration execution function"""
    # Parse command line arguments
    args = parse_arguments()
    
    # Print banner
    print_banner()
    
    # Load environment configuration
    if not load_environment():
        return 1
    
    # Apply command line overrides
    if args.dry_run:
        os.environ['DRY_RUN'] = 'true'
        print("🧪 DRY RUN MODE: No actual data will be transferred")
    
    if args.resume:
        os.environ['RESUME_FROM_TABLE'] = args.resume
        print(f"🔄 RESUME MODE: Starting from table '{args.resume}'")
    
    if args.batch_size:
        os.environ['MIGRATION_BATCH_SIZE'] = str(args.batch_size)
        print(f"📦 BATCH SIZE: {args.batch_size} rows per batch")
    
    if args.no_verify:
        os.environ['VERIFY_DATA'] = 'false'
        print("⏩ VERIFICATION: Disabled")
    
    # Display configuration
    display_configuration_summary()
    
    # Get user confirmation (skip for verify-only and dry-run)
    if not args.verify_only and not args.dry_run:
        if not get_user_confirmation():
            print("Migration cancelled by user.")
            return 0
    
    # Create migration tool
    try:
        migration_tool = DatabaseMigrationTool()
    except Exception as e:
        print(f"❌ Failed to initialize migration tool: {str(e)}")
        return 1
    
    # Execute migration
    success = run_migration_with_monitoring(migration_tool)
    
    # Final message
    print("\n" + "=" * 50)
    if success:
        print("🎉 Migration process completed successfully!")
        print("📊 Check the generated report files for detailed information.")
        if not args.dry_run:
            print("💡 Consider running Django migrations on the target database:")
            print("   python manage.py migrate")
    else:
        print("❌ Migration process completed with issues.")
        print("📋 Review the logs and error messages above.")
        print("💡 You may need to:")
        print("   - Check database connectivity")
        print("   - Verify credentials in .env.migration")
        print("   - Resolve specific table issues")
        print("   - Use --resume option to continue")
    
    print("=" * 50)
    
    return 0 if success else 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        print("Please check your configuration and try again.")
        sys.exit(1)