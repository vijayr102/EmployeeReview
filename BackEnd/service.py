from fastapi import APIRouter
from repository import get_employees

router = APIRouter()

@router.get("/employees")
def get_employees_endpoint():
    return get_employees()