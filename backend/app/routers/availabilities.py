from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.availabilities import Availability
from app.schemas.availabilities import AvailabilityCreate, AvailabilityRead

router = APIRouter(prefix="/availabilities", tags=["Availabilities"])


@router.post("/", response_model=AvailabilityRead)
def create_availability(
    availability: AvailabilityCreate, db: AsyncSession = Depends(get_db)
):
    new_availability = Availability(**availability.dict())
    db.add(new_availability)
    db.commit()
    db.refresh(new_availability)
    return new_availability


@router.get("/{availability_id}", response_model=AvailabilityRead)
def get_availability(availability_id: int, db: AsyncSession = Depends(get_db)):
    availability = (
        db.query(Availability).filter(Availability.id == availability_id).first()
    )
    if not availability:
        raise HTTPException(status_code=404, detail="Availability not found")
    return availability


@router.patch("/{availability_id}", response_model=AvailabilityRead)
def update_availability(
    availability_id: int,
    availability_update: AvailabilityCreate,
    db: AsyncSession = Depends(get_db),
):
    pass