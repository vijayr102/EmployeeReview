from database import get_connection
from models import Employee, Review,ReviewPeriod

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
    review = cursor.fetchone()
    cursor.close()
    conn.close()
    return review

def create_review(review: Review):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO performance_reviews (employee_id, period_id, quality_rating, delivery_rating, teamwork_rating, comments, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *",
        (review.employee_id, review.period_id, review.quality_rating, review.delivery_rating,
         review.teamwork_rating, review.comments, review.created_at)
    )
    
    review =cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return review