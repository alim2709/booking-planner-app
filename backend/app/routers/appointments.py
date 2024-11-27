from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.database import get_db
from app.database import async_session_maker
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.availabilities import Availability
from app.models.appointments import Appointment
from app.schemas.appointments import AppointmentCreate, AppointmentRead, SuccessMessage

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("/", response_model=AppointmentRead)
async def create_appointment(appointment: AppointmentCreate, db: AsyncSession = Depends(get_db)):
    availability = (
        db.query(Availability)
        .filter(
            Availability.id == appointment.availability_id,
            Availability.is_booked == False,
        )
        .first()
    )
    if not availability:
        raise HTTPException(
            status_code=404, detail="Availability not found or already booked"
        )

    new_appointment = Appointment(**appointment.dict(), create_at=datetime.now())
    db.add(new_appointment)
    
    availability.is_booked = True
    
    db.commit()
    db.refresh(new_appointment)
    return new_appointment

@router.get("/{appointment_id}", response_model=AppointmentRead)
async def get_appointment(appointment_id: int, db: AsyncSession = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.patch("/{appointment_id}", response_model=AppointmentRead)
async def update_appointment(appointment_id: int, appointment_update: AppointmentCreate, db: AsyncSession = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if appointment_update.availability_id != appointment.availability_id:
        new_availability = db.query(Availability).filter(
            Availability.id == appointment_update.availability_id,
            Availability.is_booked == False
        ).first()
        if not new_availability:
            raise HTTPException(status_code=400, detail="New availability is not available")

        old_availability = db.query(Availability).filter(Availability.id == appointment.availability_id).first()
        if old_availability:
            old_availability.is_booked = False

        new_availability.is_booked = True

    for field, value in appointment_update.dict(exclude_unset=True).items():
        setattr(appointment, field, value)

    db.commit()
    db.refresh(appointment)
    return appointment


@router.delete("/{appointment_id}", response_model=SuccessMessage)
async def delete_appointment(appointment_id: int, db: AsyncSession = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    availability = db.query(Availability).filter(Availability.id == appointment.availability_id).first()
    if availability:
        availability.is_booked = False

    db.delete(appointment)
    db.commit()
    return {"message": "Appointment deleted successfully"}