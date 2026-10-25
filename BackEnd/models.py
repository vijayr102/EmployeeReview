from pydantic import BaseModel
from datetime import date

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
