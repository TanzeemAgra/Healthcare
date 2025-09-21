#!/usr/bin/env python3
"""
Railway Database Connection Test
"""
import psycopg2

def test_railway_connection():
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
        
        # Get database info
        cursor.execute("SELECT current_database(), current_user, version();")
        result = cursor.fetchone()
        print(f"Database: {result[0]}")
        print(f"User: {result[1]}")
        print(f"Version: {result[2]}")
        
        # Count migrated tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        print(f"\nFound {len(tables)} migrated tables:")
        
        # Show first 10 tables
        for table in tables[:15]:
            cursor.execute(f"SELECT COUNT(*) FROM {table[0]};")
            count = cursor.fetchone()[0]
            print(f"  - {table[0]}: {count} rows")
        
        if len(tables) > 15:
            print(f"  ... and {len(tables) - 15} more tables")
        
        cursor.close()
        conn.close()
        
        print("\n✅ Railway PostgreSQL connection successful!")
        print(f"✅ Total migrated tables: {len(tables)}")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_railway_connection()