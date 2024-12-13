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

Modal.setAppElement("#root");

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

// Нормализация SQL-даты в формат JavaScript Date
const normalizeFromSQL = (sqlDateTime) => {
    const [date, time] = sqlDateTime.split(" ");
    return new Date(`${date}T${time}Z`);
};

// Преобразование объекта даты в строку ISO без миллисекунд
const toISOWithoutMilliseconds = (date) => {
    const isoString = date.toISOString();
    return isoString.split(".")[0] + "Z";
};

export const CalendarApp = () => {
    const [searchParams] = useSearchParams();
    const selectedCoach = searchParams.get("coach");
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const coachId = coachesData[selectedCoach];
    console.log("Selected Coach:", selectedCoach);
    console.log("Coach ID from JSON:", coachId);

    // Получение доступностей коуча
    const fetchAvailabilities = async () => {
        console.log("Fetching availabilities for Coach ID:", coachId);
        try {
            const response = await axiosInstance.get(
                `/availabilities?coach_id=${coachId}`
            );
            console.log("Availabilities API Response:", response.data);

            const availableSlots = response.data
                .filter((availability) => !availability.is_booked)
                .map((availability) => ({
                    title: "Available",
                    start: normalizeFromSQL(
                        `${availability.date} ${availability.start_time}`
                    ),
                    end: normalizeFromSQL(
                        `${availability.date} ${availability.end_time}`
                    ),
                    allDay: false,
                    availabilityId: availability.id,
                }));

            setCalendarEvents(availableSlots);
            console.log("Mapped Events:", availableSlots);
        } catch (error) {
            console.error("Error fetching availabilities:", error);
        }
    };

    useEffect(() => {
        if (coachId) {
            fetchAvailabilities();
        }
    }, [coachId]);

    // Бронирование встречи
    const handleSelectSlot = async (slotInfo) => {
        console.log("Selected Slot Info:", slotInfo);

        // 1. Обновляем данные перед проверкой
        try {
            console.log("Fetching fresh availabilities...");
            await fetchAvailabilities(); // Получаем актуальные данные
            console.log("Fresh availabilities fetched.");
        } catch (error) {
            console.error("Error refetching availabilities:", error);
            alert(
                "Error fetching fresh availabilities. Please refresh the page."
            );
            return; // Прерываем выполнение, если обновление не удалось
        }

        // 2. Подтверждение бронирования
        const confirmBooking = window.confirm(
            `Would you like to book this slot: ${slotInfo.start.toLocaleString()} - ${slotInfo.end.toLocaleString()}?`
        );

        if (confirmBooking) {
            console.log("Booking confirmed for slot:", slotInfo);

            try {
                const normalizedStart = toISOWithoutMilliseconds(
                    slotInfo.start
                );
                const normalizedEnd = toISOWithoutMilliseconds(slotInfo.end);

                console.log(
                    "Normalized Slot Info for comparison:",
                    normalizedStart,
                    normalizedEnd
                );

                // Лог всех событий в calendarEvents
                console.log(
                    "Current Calendar Events (after fetch):",
                    calendarEvents.map((event) => ({
                        start: toISOWithoutMilliseconds(event.start),
                        end: toISOWithoutMilliseconds(event.end),
                        availabilityId: event.availabilityId,
                    }))
                );

                // Сравниваем слот с актуальными данными
                const availability = calendarEvents.find((event) => {
                    const eventStart = toISOWithoutMilliseconds(event.start);
                    const eventEnd = toISOWithoutMilliseconds(event.end);

                    console.log(
                        `Comparing slot: [${normalizedStart} - ${normalizedEnd}]`,
                        `with event: [${eventStart} - ${eventEnd}], availabilityId: ${event.availabilityId}`
                    );

                    return (
                        eventStart === normalizedStart &&
                        eventEnd === normalizedEnd
                    );
                });

                console.log(
                    "Found availability after comparison:",
                    availability
                );

                if (!availability) {
                    alert("This slot is no longer available.");
                    console.log("Slot no longer available after fresh fetch.");
                    return;
                }

                // Проверяем слот на сервере для большей уверенности
                console.log("Verifying availability on server...");
                const availabilityCheck = await axiosInstance.get(
                    `/availabilities/${availability.availabilityId}`
                );
                console.log(
                    "Server availability check result:",
                    availabilityCheck.data
                );

                if (availabilityCheck.data.is_booked) {
                    alert(
                        "Unfortunately, this slot was booked by someone else. Please choose another slot."
                    );
                    console.log("Slot was booked by someone else.");
                    await fetchAvailabilities(); // Обновляем данные
                    return;
                }

                // 3. Извлекаем ID студента из localStorage
                const studentId = localStorage.getItem("userId");
                if (!studentId) {
                    console.error("Student ID not found in localStorage.");
                    alert("You are not logged in. Please log in first.");
                    return;
                }

                // Формируем объект для бронирования
                const booking = {
                    student_id: parseInt(studentId, 10),
                    coach_id: coachId,
                    availability_id: availability.availabilityId,
                    start_time: normalizedStart,
                    end_time: normalizedEnd,
                };

                console.log("Sending booking request with data:", booking);

                // 4. Отправляем запрос на сервер для бронирования
                const response = await axiosInstance.post(
                    "/appointments",
                    booking
                );
                console.log("Appointment successfully created:", response.data);

                // 5. Обновляем календарь после успешного бронирования
                await fetchAvailabilities();
                alert("Your appointment has been booked successfully!");
            } catch (error) {
                if (error.response) {
                    console.error("Error from API:", error.response.data);
                    alert(
                        `Failed to book the appointment: ${
                            error.response.data.message || "Unknown error"
                        }`
                    );
                } else {
                    console.error("Error booking appointment:", error);
                    alert("An unexpected error occurred. Please try again.");
                }
            }
        } else {
            console.log("Booking cancelled by user.");
        }
    };

    const handleSelectEvent = (event) => {
        console.log("Selected Event:", event);
        setSelectedEvent(event);
    };

    const closeModalWindow = () => {
        console.log("Closing event details modal.");
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
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        min={new Date(2024, 10, 26, 9, 30)}
                        max={new Date(2024, 10, 26, 16, 30)}
                    />
                </div>
            </div>

            {selectedEvent && (
                <Modal
                    isOpen={true}
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
