from fastapi import APIRouter,HTTPException
from repository import get_employees, get_review_periods,get_reviews,get_reviews_id,create_review
from models import Employee,ReviewPeriod,Review,ReviewCreate

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
    review = get_reviews_id(review_id)
    return review

@router.post("/reviews", response_model=Review)
def create_review_endpoint(review: ReviewCreate):
    review_periods = get_review_periods()
    if any(rp["id"] == review.period_id and rp["status"] == 'Closed' for rp in review_periods):
        raise HTTPException(status_code=400, detail="Cannot create review for a closed review period.")
    
    reviews =get_reviews()
    if(any(r["employee_id"] == review.employee_id and r["period_id"] == review.period_id for r in reviews)):
        raise HTTPException(status_code=409, detail="Duplicate entry: Review for this employee and period already exists.")
    else:
        try:
                created_review = create_review(review)
                return created_review
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e)+" Please ensure that the employee_id and period_id exist in the respective tables.")