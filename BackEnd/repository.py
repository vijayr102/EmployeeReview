from database import get_connection
from models import Employee,ReviewPeriod

def get_employees():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees")
    employees = cursor.fetchall()
    cursor.close()
    conn.close()
    return employees

def get_review_periods():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM review_periods")
    review_periods = cursor.fetchall()
    cursor.close()
    conn.close()
    return review_periods

def get_reviews():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM performance_reviews")
    reviews = cursor.fetchall()
    cursor.close()
    conn.close()
    return reviews

def get_reviews_id(review_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM performance_reviews WHERE id = %s", (review_id,))
    reviews = cursor.fetchall()
    cursor.close()
    conn.close()
    return reviews