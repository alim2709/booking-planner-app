from datetime import date, time, datetime
from pydantic import BaseModel, ConfigDict
from typing import ClassVar
from app.utils.enums import StatusAppointment


class SAppointmentModel(BaseModel):
    id: int
    student_id: int
    coach_id: int
    availability_id: int
    status: StatusAppointment
    created_at: datetime

    model_config: ClassVar[ConfigDict] = ConfigDict(arbitrary_types_allowed=True)

    @classmethod
    def __get_validators__(cls):
        yield cls.remove_timezone

    @staticmethod
    def remove_timezone(dt: datetime) -> datetime:
        if dt.tzinfo is not None:
            return dt.replace(tzinfo=None)
        return dt