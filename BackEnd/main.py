from fastapi import FastAPI
from service import router as service_router

app = FastAPI()
app.include_router(service_router)