from database import get_connection
from models import Employee

def get_employees() -> list[Employee]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees")
    employees = cursor.fetchall()
    cursor.close()
    conn.close()
    return [Employee(**employee) for employee in employees]