#!/usr/bin/env python3
"""
Debug script to list all tables and schemas in the database
"""
import psycopg2

def debug_database_structure():
    """List all tables and their schemas"""
    
    conn = psycopg2.connect(
        host='localhost',
        port=5432,
        database='medixscandb',
        user='postgres',
        password='Tanzeem@12345'
    )
    
    cursor = conn.cursor()
    
    print("=== DATABASE STRUCTURE DEBUG ===")
    print()
    
    # List all schemas
    print("1. Available schemas:")
    cursor.execute("SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;")
    schemas = cursor.fetchall()
    for schema in schemas:
        print(f"   - {schema[0]}")
    print()
    
    # List tables in public schema
    print("2. Tables in 'public' schema:")
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
        LIMIT 10
    """)
    tables = cursor.fetchall()
    print(f"   Found {len(tables)} tables (showing first 10):")
    for table in tables:
        print(f"   - {table[0]}")
    print()
    
    # Check if auth_user exists in any schema
    print("3. Looking for 'auth_user' table in all schemas:")
    cursor.execute("""
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_name LIKE '%auth_user%'
        AND table_type = 'BASE TABLE'
    """)
    auth_tables = cursor.fetchall()
    if auth_tables:
        for schema, table in auth_tables:
            print(f"   - Found: {schema}.{table}")
    else:
        print("   - No 'auth_user' table found")
    print()
    
    # List first few tables with their column count
    print("4. Sample table structures:")
    cursor.execute("""
        SELECT table_name, COUNT(column_name) as col_count
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        GROUP BY table_name
        ORDER BY table_name
        LIMIT 5
    """)
    table_info = cursor.fetchall()
    for table_name, col_count in table_info:
        print(f"   - {table_name}: {col_count} columns")
        
        # Show columns for first table
        if table_name == table_info[0][0]:
            cursor.execute("""
                SELECT column_name, data_type, is_nullable, column_default,
                       character_maximum_length, numeric_precision, numeric_scale, udt_name
                FROM information_schema.columns 
                WHERE table_name = %s AND table_schema = 'public'
                ORDER BY ordinal_position
                LIMIT 3
            """, (table_name,))
            columns = cursor.fetchall()
            print(f"     Sample columns ({len(columns)} shown):")
            for i, col in enumerate(columns):
                print(f"       {i+1}. {col[0]} ({col[1]}) - tuple length: {len(col)}")
    
    cursor.close()
    conn.close()

if __name__ == "__main__":
    debug_database_structure()