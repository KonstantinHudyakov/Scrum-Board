from contextlib import contextmanager

from psycopg2.pool import SimpleConnectionPool

with open("/run/secrets/postgres-password") as file:
    password = file.readline()

pool = SimpleConnectionPool(1, 10, host="database", port=5432, database="scrum-board",
                            user="postgres", password=password)


@contextmanager
def get_cursor():
    conn = pool.getconn()
    try:
        yield conn.cursor()
        conn.commit()
    finally:
        pool.putconn(conn)
