from datetime import datetime

from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Date, Time

from app.models.user import User


class Availability(Base):
    __tablename__ = "availabilities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    coach_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    start_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    end_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    is_booked: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now, nullable=False)

    coach: Mapped["User"] = relationship("User", back_populates="availabilities")
    appointments: Mapped[list["Appointment"]] = relationship(
        "Appointment", back_populates="availability"
    )