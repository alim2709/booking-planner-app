from datetime import date, time, datetime
from pydantic import BaseModel, ConfigDict, field_validator
from typing import ClassVar, Optional

class SAvailabilityModel(BaseModel):
    id: Optional[int] = None
    coach_id: int
    date: date
    start_time: time
    end_time: time
    is_booked: bool
    created_at: datetime

    
    model_config: ClassVar[ConfigDict] = ConfigDict(arbitrary_types_allowed=True)

    @field_validator('start_time', 'end_time', 'created_at')
    def remove_timezone(cls, value: datetime) -> datetime:
        """Remove timezone information from a datetime object."""
        if value.tzinfo is not None:
            return value.replace(tzinfo=None)
        return value
