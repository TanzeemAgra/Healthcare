#!/usr/bin/env python3
"""
Fix Django migrations for Railway database
"""
import psycopg2

def fix_django_migrations():
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
        
        # Create django_migrations table with proper structure
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS django_migrations (
                id SERIAL PRIMARY KEY,
                app VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                applied TIMESTAMP WITH TIME ZONE NOT NULL
            );
        """)
        
        print("✅ Created django_migrations table")
        
        # Insert fake migration records for apps that have existing tables
        apps_to_fake = [
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
            ('contenttypes', '0001_initial'),
            ('contenttypes', '0002_remove_content_type_name'),
            ('sessions', '0001_initial'),
            ('admin', '0001_initial'),
            ('admin', '0002_logentry_remove_auto_add'),
            ('admin', '0003_logentry_add_action_flag_choices'),
        ]
        
        for app, migration_name in apps_to_fake:
            cursor.execute("""
                INSERT INTO django_migrations (app, name, applied)
                VALUES (%s, %s, NOW())
                ON CONFLICT DO NOTHING
            """, (app, migration_name))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✅ Successfully set up Django migrations table")
        print(f"✅ Marked {len(apps_to_fake)} core migrations as applied")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fix_django_migrations()