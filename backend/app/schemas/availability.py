from datetime import date, time, datetime

from pydantic import BaseModel, ConfigDict


class SAvailabilityModel(BaseModel):
    id: int
    coach_id: int
    date: date
    start_time: time
    end_time: time
    is_booked: bool
    created_at: datetime

    model_config = ConfigDict(arbitrary_types_allowed=True)

class CreateAvailabilityModel(BaseModel):
    id: int
    coach_id: int
    date: date
    start_time: time
    end_time: time
    is_booked: bool
    created_at: datetime

    model_config = ConfigDict(arbitrary_types_allowed=True)
