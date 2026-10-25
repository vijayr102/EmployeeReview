from fastapi import APIRouter
from repository import get_employees, get_review_periods,get_reviews
from models import Employee,ReviewPeriod,Review

router = APIRouter()

@router.get("/employees",response_model=list[Employee])
def get_employees_endpoint():
    return get_employees()

@router.get("/review-periods",response_model=list[ReviewPeriod])
def get_review_periods_endpoint():
    # Placeholder for review periods logic
    return get_review_periods()

@router.get("/reviews", response_model=list[Review])
def get_reviews_endpoint():
    return get_reviews()

@router.get("/reviews/{review_id}", response_model=Review)
def get_review_by_id(review_id: int):
    reviews = get_reviews_id(review_id)
    for review in reviews:
        if review['id'] == review_id:
            return review
    return None