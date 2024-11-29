# from datetime import date, time, datetime

# from pydantic import BaseModel, ConfigDict


# class SAvailabilityModel(BaseModel):
#     id: int
#     coach_id: int
#     date: date
#     start_time: time
#     end_time: time
#     is_booked: bool
#     created_at: datetime

#     model_config = ConfigDict(arbitrary_types_allowed=True)

from datetime import date, time, datetime
from pydantic import BaseModel, ConfigDict
from typing import ClassVar

class SAvailabilityModel(BaseModel):
    id: int
    coach_id: int
    # date: date
    # start_time: time
    # end_time: time
    is_booked: bool
    # created_at: datetime
    
    model_config: ClassVar[ConfigDict] = ConfigDict(arbitrary_types_allowed=True)

    # @classmethod
    # def __get_validators__(cls):
    #     yield cls.remove_timezone

    # @staticmethod
    # def remove_timezone(dt: datetime) -> datetime:
    #     """Ensure that the datetime is naive (without timezone)."""
    #     if dt.tzinfo is not None:
    #         return dt.replace(tzinfo=None)
    #     return dt

