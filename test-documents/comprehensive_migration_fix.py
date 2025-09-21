#!/usr/bin/env python3
"""
Comprehensive Django Migration Fix for Railway Database
"""
import psycopg2

def comprehensive_migration_fix():
    try:
        # Connect to Railway PostgreSQL
        conn = psycopg2.connect(
            host='tramway.proxy.rlwy.net',
            port=17931,
            database='railway',
            user='postgres',
            password='TCxaXngnBHmwihKBGYAlYxCPFeIqbGOi'
        )
        
        cursor = conn.cursor()
        
        # Clear and recreate django_migrations table properly
        cursor.execute("DROP TABLE IF EXISTS django_migrations CASCADE;")
        cursor.execute("""
            CREATE TABLE django_migrations (
                id SERIAL PRIMARY KEY,
                app VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                applied TIMESTAMP WITH TIME ZONE NOT NULL
            );
        """)
        
        print("✅ Recreated django_migrations table")
        
        # Only mark the core Django migrations as applied (not app-specific ones)
        core_migrations = [
            ('contenttypes', '0001_initial'),
            ('contenttypes', '0002_remove_content_type_name'),
            ('auth', '0001_initial'),
            ('auth', '0002_alter_permission_name_max_length'),
            ('auth', '0003_alter_user_email_max_length'),
            ('auth', '0004_alter_user_username_opts'),
            ('auth', '0005_alter_user_last_login_null'),
            ('auth', '0006_require_contenttypes_0002'),
            ('auth', '0007_alter_validators_add_error_messages'),
            ('auth', '0008_alter_user_username_max_length'),
            ('auth', '0009_alter_user_last_name_max_length'),
            ('auth', '0010_alter_group_name_max_length'),
            ('auth', '0011_update_proxy_permissions'),
            ('auth', '0012_alter_user_first_name_max_length'),
            ('sessions', '0001_initial'),
        ]
        
        for app, migration_name in core_migrations:
            cursor.execute("""
                INSERT INTO django_migrations (app, name, applied)
                VALUES (%s, %s, NOW())
            """, (app, migration_name))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✅ Successfully set up core Django migrations")
        print(f"✅ Marked {len(core_migrations)} core migrations as applied")
        print("Now Django can handle the app-specific migrations properly")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    comprehensive_migration_fix()