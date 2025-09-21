#!/usr/bin/env python3
"""
Simple debug script to check database schema query results
"""
import psycopg2
import os
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.migration')

def debug_schema_query():
    """Debug the schema query to see what we're actually getting"""
    
    # Connect to source database
    conn = psycopg2.connect(
        host='localhost',
        port=5432,
        database='medixscandb',
        user='postgres',
        password='Tanzeem@12345'
    )
    
    cursor = conn.cursor()
    
    print("Testing schema query for 'auth_user' table...")
    print("=" * 50)
    
    try:
        # Test the exact query from migration tool
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
        """, ('auth_user',))
        
        columns = cursor.fetchall()
        
        print(f"Found {len(columns)} columns:")
        print()
        
        for i, col in enumerate(columns):
            print(f"Column {i+1}: {col}")
            print(f"  Length: {len(col)}")
            print(f"  Types: {[type(x).__name__ for x in col]}")
            print()
            
            # Try unpacking
            try:
                if len(col) >= 8:
                    col_name, data_type, is_nullable, default, max_length, precision, scale, udt_name = col
                    print(f"  Unpacked successfully: {col_name} ({data_type})")
                else:
                    print(f"  ❌ Cannot unpack - only {len(col)} elements")
            except Exception as e:
                print(f"  ❌ Unpack error: {e}")
            print("-" * 30)
            
    except Exception as e:
        print(f"Query failed: {e}")
        
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    debug_schema_query()