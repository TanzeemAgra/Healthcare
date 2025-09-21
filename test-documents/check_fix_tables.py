#!/usr/bin/env python3
"""
Check and fix database table structures for Django compatibility
"""
import psycopg2

def check_and_fix_tables():
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
        
        # Check if auth_group has primary key constraint
        cursor.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'auth_group'
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        print("auth_group table structure:")
        for col in columns:
            print(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")
        
        # Check constraints on auth_group
        cursor.execute("""
            SELECT constraint_name, constraint_type 
            FROM information_schema.table_constraints 
            WHERE table_name = 'auth_group';
        """)
        
        constraints = cursor.fetchall()
        print("\nauth_group constraints:")
        for constraint in constraints:
            print(f"  - {constraint[0]}: {constraint[1]}")
        
        # Fix primary key if it's missing
        has_pk = any('PRIMARY KEY' in str(constraint) for constraint in constraints)
        if not has_pk:
            print("\n❌ Missing primary key constraint on auth_group")
            cursor.execute("ALTER TABLE auth_group ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);")
            print("✅ Added primary key constraint to auth_group")
        
        # Fix auth_user table if needed
        cursor.execute("""
            SELECT constraint_name, constraint_type 
            FROM information_schema.table_constraints 
            WHERE table_name = 'auth_user';
        """)
        
        user_constraints = cursor.fetchall()
        user_has_pk = any('PRIMARY KEY' in str(constraint) for constraint in user_constraints)
        if not user_has_pk:
            print("❌ Missing primary key constraint on auth_user")
            cursor.execute("ALTER TABLE auth_user ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);")
            print("✅ Added primary key constraint to auth_user")
        
        # Check for auth_permission table
        cursor.execute("""
            SELECT constraint_name, constraint_type 
            FROM information_schema.table_constraints 
            WHERE table_name = 'auth_permission';
        """)
        
        perm_constraints = cursor.fetchall()
        perm_has_pk = any('PRIMARY KEY' in str(constraint) for constraint in perm_constraints)
        if not perm_has_pk:
            print("❌ Missing primary key constraint on auth_permission")
            cursor.execute("ALTER TABLE auth_permission ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);")
            print("✅ Added primary key constraint to auth_permission")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("\n✅ Database table structure check completed")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_and_fix_tables()