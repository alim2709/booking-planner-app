from datetime import datetime

from app.database import Base
from app.utils.enums import UserRole

from sqlalchemy import Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    bio: Mapped[str] = mapped_column(unique=False, nullable=True)
    hashed_password: Mapped[str] = mapped_column(unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(nullable=False, default=True)
    is_superuser: Mapped[bool] = mapped_column(nullable=False, default=False)
    role: Mapped[str] = mapped_column(Enum(UserRole), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    availabilities: Mapped[list["Availability"]] = relationship(
        "Availability", back_populates="coach"
    )
    student_appointments: Mapped[list["Appointment"]] = relationship(
        "Appointment", back_populates="student", foreign_keys="[Appointment.student_id]"
    )
    coach_appointments: Mapped[list["Appointment"]] = relationship(
        "Appointment", back_populates="coach", foreign_keys="[Appointment.coach_id]"
    )