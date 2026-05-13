#!/usr/bin/env python3
"""Run FSM Index migrations against the Supabase Postgres database."""
import psycopg2
import sys
from pathlib import Path

CONN_STR = "postgresql://postgres.zwrfxfbtdwzaerxdcgnr:26599489Abc@aws-1-us-east-2.pooler.supabase.com:6543/postgres"

MIGRATIONS_DIR = Path(__file__).parent.parent / "supabase" / "migrations"

def run_migrations():
    conn = psycopg2.connect(CONN_STR)
    conn.autocommit = False
    cur = conn.cursor()

    migration_files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    if not migration_files:
        print("No migration files found.")
        return

    for mf in migration_files:
        print(f"  Running: {mf.name} ...", end=" ", flush=True)
        sql = mf.read_text()
        try:
            cur.execute(sql)
            conn.commit()
            print("OK")
        except Exception as e:
            conn.rollback()
            print(f"FAILED\n  ERROR: {e}")
            cur.close()
            conn.close()
            sys.exit(1)

    cur.close()
    conn.close()
    print("All migrations completed successfully.")

if __name__ == "__main__":
    run_migrations()
