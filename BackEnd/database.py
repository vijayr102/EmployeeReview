import os
import psycopg
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    conn_str = os.getenv("CONN")
    return psycopg.connect(conn_str, row_factory=psycopg.rows.dict_row)