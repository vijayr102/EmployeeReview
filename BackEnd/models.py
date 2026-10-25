from pydantic import BaseModel
from datetime import date, datetime

class Employee(BaseModel):
    id: int
    employee_id: str
    name: str
    department: str | None = None
    email: str | None = None
    status: str | None = None

class ReviewPeriod(BaseModel):
    id: int
    name: str
    start_date: date
    end_date: date
    status: str | None = None


class Review(BaseModel):
    id: int
    employee_id: int
    period_id: int
    quality_rating: int
    delivery_rating: int
    teamwork_rating: int
    average_rating: float 
    comments: str | None = None
    created_at: datetime