from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional
from app.utils.enums import StatusAppointment

class SAppointmentModel(BaseModel):
    id: Optional[int] = None
    student_id: int
    coach_id: int
    availability_id: int
    start_time: datetime = Field(..., description="Start time of the appointment")
    end_time: datetime = Field(..., description="End time of the appointment")
    status: StatusAppointment
    created_at: datetime

    model_config = ConfigDict(arbitrary_types_allowed=True)

    @field_validator('start_time', 'end_time', 'created_at')
    def remove_timezone(cls, value: datetime) -> datetime:
        """Remove timezone information from a datetime object."""
        if value.tzinfo is not None:
            return value.replace(tzinfo=None)
        return value

