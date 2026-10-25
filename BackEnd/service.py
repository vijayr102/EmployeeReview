from fastapi import APIRouter
from repository import get_employees, get_review_periods
from models import Employee,ReviewPeriod

router = APIRouter()

@router.get("/employees",response_model=list[Employee])
def get_employees_endpoint():
    return get_employees()

@router.get("/review-periods",response_model=list[ReviewPeriod])
def get_review_periods_endpoint():
    # Placeholder for review periods logic
    return get_review_periods()