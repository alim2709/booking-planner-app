from fastapi import FastAPI

from app.routers.availability import availability_router
from app.routers.user import user_router

app = FastAPI(
    title="Booking Planner API",
    summary="API for managing users, availabilities, appointments",
)

app.include_router(user_router)
app.include_router(availability_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
