from fastapi import APIRouter
from repository import get_employees
from models import Employee

router = APIRouter()

@router.get("/employees")
def get_employees_endpoint(response_model=list[Employee]):
    return get_employees()