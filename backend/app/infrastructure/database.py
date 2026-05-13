import os
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

class Database:
    def __init__(self, connection_url: str):
        self.connection_url = connection_url

    @contextmanager
    def get_cursor(self):
        conn = psycopg2.connect(self.connection_url)
        try:
            yield conn.cursor(cursor_factory=RealDictCursor)
        finally:
            conn.close()

def get_db():
    url = os.getenv("DATABASE_URL")
    if not url:
        # Default for local dev/testing if not in env
        url = "postgresql://postgres.zwrfxfbtdwzaerxdcgnr:26599489Abc@aws-1-us-east-2.pooler.supabase.com:6543/postgres"
    return Database(url)
