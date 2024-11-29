from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SAvailabilityModel(BaseModel):
    id: int
    coach_id: int
    date: datetime.date
    start_time: datetime.time
    end_time: datetime.time
    is_booked: bool
    created_at: datetime

    model_config = ConfigDict(arbitrary_types_allowed=True)
