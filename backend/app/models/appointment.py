from datetime import datetime

from app.database import Base

from sqlalchemy import ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.utils.enums import StatusAppointment


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    coach_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    availability_id: Mapped[int] = mapped_column(ForeignKey("availabilities.id"), nullable=False)
    start_time: Mapped[datetime] = mapped_column(nullable=False)
    end_time: Mapped[datetime] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(
        Enum(StatusAppointment), default=StatusAppointment.PENDING, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)

    student: Mapped["User"] = relationship(
        "User", back_populates="student_appointments", foreign_keys=[student_id]
    )
    coach: Mapped["User"] = relationship(
        "User", back_populates="coach_appointments", foreign_keys=[coach_id]
    )
    availability: Mapped["Availability"] = relationship(
        "Availability", back_populates="appointments"
    )