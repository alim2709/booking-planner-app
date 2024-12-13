from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.appointment import SAppointmentModel, CreateAppointmentModel
from app.services.appointment import AppointmentService
from app.dependencies.user_auth import AccessTokenBearer

access_token_service = AccessTokenBearer()

appointment_service = AppointmentService()
appointment_router = APIRouter(prefix="/api")


@appointment_router.get("/appointments", response_model=List[SAppointmentModel])
async def get_appointments(user_details: dict = Depends(access_token_service)):
    response = await appointment_service.get_appointments()
    return response


@appointment_router.get(
    "/appointments/{appointment_id}", response_model=SAppointmentModel
)
async def get_appointment(
    appointment_id: int, user_details: dict = Depends(access_token_service)
):
    response = await appointment_service.get_appointment(appointment_id)
    return response


@appointment_router.post("/appointments", response_model=SAppointmentModel)
async def create_appointment(
    data: CreateAppointmentModel, user_details: dict = Depends(access_token_service)
):
    response = await appointment_service.create_appointment(data, user_details)
    return response


@appointment_router.patch(
    "/appointments/{appointment_id}", response_model=SAppointmentModel
)
async def update_appointment(
    appointment_id: int,
    data: CreateAppointmentModel,
    user_details: dict = Depends(access_token_service),
):
    try:
        appointment = await appointment_service.update_appointment(appointment_id, data)
        return appointment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@appointment_router.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: int, user_details: dict = Depends(access_token_service)
):
    try:
        response = await appointment_service.delete_appointment(appointment_id)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
