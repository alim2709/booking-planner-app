from datetime import date, time, datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.utils.enums import StatusAppointment


class SAppointmentModel(BaseModel):
    id: int
    student_id: int
    coach_id: int
    availability_id: int
    date: date
    start_time: time
    end_time: time

    status: StatusAppointment
    created_at: datetime

    model_config = ConfigDict(arbitrary_types_allowed=True)

    @field_validator("start_time", "end_time", "created_at")
    def remove_timezone(cls, value: datetime) -> datetime:
        """Remove timezone information from a datetime object."""
        if value.tzinfo is not None:
            return value.replace(tzinfo=None)
        return value


class CreateAppointmentModel(BaseModel):

    availability_id: int

    model_config = ConfigDict(arbitrary_types_allowed=True)
