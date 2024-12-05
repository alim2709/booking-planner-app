from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.availability import availability_router
from app.routers.user import user_router
from app.routers.appointment import appointment_router

app = FastAPI(
    title="Booking Planner API",
    summary="API for managing users, availabilities, appointments",
)

origins = settings.FASTAPI_CORS_ALLOWED_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(availability_router)
app.include_router(appointment_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
