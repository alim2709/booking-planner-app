from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Define the schema for creating an availability
class AvailabilityCreate(BaseModel):
    coach_id: int  # Assuming that each availability is linked to a coach
    start_time: datetime  # The start time of the availability slot
    end_time: datetime  # The end time of the availability slot
    day_of_week: Optional[int] = None  # Optional field to specify the day of the week (e.g., 0=Monday, 6=Sunday)

    class Config:
        orm_mode = True  # This tells Pydantic to treat the SQLAlchemy model as a dictionary

# Define the schema for reading availability (for response)
class AvailabilityRead(AvailabilityCreate):
    id: int  # Include the ID of the availability in the response

    class Config:
        orm_mode = True  # Tells Pydantic to use the SQLAlchemy model as a dictionary

# Define the schema for updating an availability
class AvailabilityUpdate(BaseModel):
    start_time: Optional[datetime] = None  # The start time of the availability slot (optional for updates)s
    end_time: Optional[datetime] = None 
    day_of_week: Optional[int] = None  

    class Config:
        orm_mode = True  

