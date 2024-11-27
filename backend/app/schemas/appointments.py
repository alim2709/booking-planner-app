from pydantic import BaseModel
from datetime import datetime

class AppointmentCreate(BaseModel):
     user_id: int
     availability_id: int
     
class AppointmentRead(BaseModel):
     id: int
     student_id: int
     coach_id: int
     availability_id: int
     status: str
     created_at: datetime
     
     class Config:
         orm_mode = True