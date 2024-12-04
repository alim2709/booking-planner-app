from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas.appointment import SAppointmentModel
from app.services.appointment import AppointmentService

appointment_service = AppointmentService()
appointment_router = APIRouter(prefix="/api")

@appointment_router.get("/appointments", response_model=List[SAppointmentModel])
async def get_appointments():
    response = await appointment_service.get_appointments()
    return response

@appointment_router.get("/appointments/{appointment_id}", response_model=SAppointmentModel)
async def get_appointment(appointment_id: int):
    response = await appointment_service.get_appointment(appointment_id)
    return response

@appointment_router.post("/appointments", response_model=SAppointmentModel)
async def create_appointment(data: SAppointmentModel):
    try:
        appointment = await AppointmentService.create_appointment(data)
        return appointment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@appointment_router.patch("/appointments/{appointment_id}", response_model=SAppointmentModel)
async def update_appointment(data: SAppointmentModel):
    try:
        appointment = await AppointmentService.update_appointment(data)
        return appointment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@appointment_router.delete("/appointments/{appointment_id}", response_model=SAppointmentModel)
async def delete_appointment(data: SAppointmentModel):
    appointment = await AppointmentService.delete_appointment(data)
    return appointment