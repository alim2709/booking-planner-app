from enum import Enum


class UserRole(Enum):
    COACH = "coach"
    STUDENT = "student"


class StatusAppointment(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
