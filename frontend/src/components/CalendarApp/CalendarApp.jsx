import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useSearchParams } from "react-router-dom";
import coachesData from "../../services/coaches.json";
import axiosInstance from "../../services/apiClient";
import "./CalendarApp.scss";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

export const CalendarApp = () => {
    const [searchParams] = useSearchParams();
    const selectedCoach = searchParams.get("coach");
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const coachId = coachesData[selectedCoach];
    console.log("Selected Coach:", selectedCoach);
    console.log("Coach ID from JSON:", coachId);

    // Получение доступностей коуча
    const fetchAvailabilities = async () => {
        try {
            const response = await axiosInstance.get(
                `/availabilities?coach_id=${coachId}`
            );

            const availableSlots = response.data.map((availability) => ({
                title: availability.is_booked ? "Booked" : "Available",
                start: new Date(
                    `${availability.date}T${availability.start_time}`
                ), // Используем данные напрямую
                end: new Date(`${availability.date}T${availability.end_time}`), // Используем данные напрямую
                allDay: false,
                isBooked: availability.is_booked,
                availabilityId: availability.id,
            }));

            setCalendarEvents(availableSlots);
        } catch (error) {
            console.error("Error fetching availabilities:", error);
        }
    };

    useEffect(() => {
        if (coachId) {
            fetchAvailabilities();
        }
    }, [coachId]);

    const handleSelectSlot = async (slotInfo) => {
        const availability = calendarEvents.find(
            (event) =>
                event.start.getTime() === slotInfo.start.getTime() &&
                event.end.getTime() === slotInfo.end.getTime() &&
                !event.isBooked
        );

        if (!availability) {
            alert("This slot is not available or has already been booked.");
            return;
        }

        const confirmBooking = window.confirm(
            `Would you like to book this slot: ${slotInfo.start.toLocaleString()} - ${slotInfo.end.toLocaleString()}?`
        );

        if (confirmBooking) {
            try {
                await axiosInstance.post("/appointments", {
                    availability_id: availability.availabilityId,
                });
                alert("Your appointment has been booked successfully!");
                await fetchAvailabilities(); // Обновляем данные после бронирования
            } catch (error) {
                console.error("Error booking appointment:", error);
                alert(
                    "An error occurred while booking the appointment. Please try again."
                );
            }
        }
    };

    const handleSelectEvent = (event) => {
        if (event.isBooked) {
            alert("This slot is already booked. Please select another slot.");
            return;
        }

        setSelectedEvent(event);
        setModalIsOpen(true);
    };

    const closeModalWindow = () => {
        setModalIsOpen(false);
        setSelectedEvent(null);
    };

    return (
        <section className="meeting-planner">
            <div className="meeting-planner__header">
                <h2 className="meeting-planner__title">Plan a meeting</h2>
                <p className="meeting-planner__info">
                    Coach, you've chosen: <span>{selectedCoach}</span>
                </p>
            </div>
            <div className="meeting-planner__step">
                <h2 className="meeting-planner__step-title">
                    Step 2 - Choose the free date & time
                </h2>
                <div className="meeting-planner__calendar">
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        selectable={true}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        min={new Date(2024, 0, 1, 9, 0)} // Рабочие часы: начало 9:00
                        max={new Date(2024, 0, 1, 18, 0)} // Рабочие часы: конец 18:00
                        views={["month", "week", "day"]}
                        dayPropGetter={(date) => {
                            const isWeekend =
                                date.getDay() === 0 || date.getDay() === 6; // 0 - Воскресенье, 6 - Суббота
                            if (isWeekend) {
                                return {
                                    style: {
                                        backgroundColor: "#f5f5f5",
                                        color: "#aaa",
                                    },
                                };
                            }
                            return {};
                        }}
                    />
                </div>
            </div>

            {modalIsOpen && selectedEvent && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModalWindow}
                    contentLabel="Event Details"
                    className="modal-window"
                    overlayClassName="modal-overlay"
                >
                    <h2>{selectedEvent.title}</h2>
                    <p>
                        <strong>Start:</strong>{" "}
                        {selectedEvent.start.toLocaleString()}
                    </p>
                    <p>
                        <strong>End:</strong>{" "}
                        {selectedEvent.end.toLocaleString()}
                    </p>
                    <button
                        onClick={closeModalWindow}
                        className="modal-close-button"
                    >
                        Close
                    </button>
                </Modal>
            )}
        </section>
    );
};
