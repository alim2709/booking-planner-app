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
    availability_id: Mapped[int] = mapped_column(
        ForeignKey("availabilities.id"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        Enum(StatusAppointment), default=StatusAppointment.PENDING, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)

    student = relationship(
        "User", foreign_keys=[student_id], back_populates="appointments"
    )
    coach = relationship("User", foreign_keys=[coach_id])
    availability = relationship("Availability", back_populates="appointments")
