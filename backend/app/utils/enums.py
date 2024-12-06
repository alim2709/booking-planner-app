from enum import Enum


class UserRole(Enum):
    COACH = "coach"
    STUDENT = "student"
    USER = "user"


class StatusAppointment(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
