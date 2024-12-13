import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSearchParams } from "react-router-dom";
import coachesData from "../../services/coaches.json";
import axiosInstance from "../../services/apiClient";
import "./CalendarApp.scss";

export const CalendarApp = () => {
    const [searchParams] = useSearchParams();
    const selectedCoach = searchParams.get("coach");
    const [availabilities, setAvailabilities] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

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
            console.log("Availabilities response:", response.data);
            setAvailabilities(response.data);
        } catch (error) {
            console.error("Error fetching availabilities:", error);
        }
    };

    useEffect(() => {
        if (coachId) {
            fetchAvailabilities();
        }
    }, [coachId]);

    // Генерация временных слотов, синхронизированных с availabilities
    const generateTimeSlots = (date) => {
        const selectedDateString = date.toISOString().split("T")[0];
        const availabilitiesForDate = availabilities.filter(
            (availability) => availability.date === selectedDateString
        );

        const slots = availabilitiesForDate.map((availability) => ({
            start: new Date(`${availability.date}T${availability.start_time}`),
            end: new Date(`${availability.date}T${availability.end_time}`),
            available: !availability.is_booked,
            id: availability.id,
        }));

        console.log("Time slots generated:", slots);
        setTimeSlots(slots);
    };

    // Выбор даты
    const handleDateChange = (date) => {
        console.log("Selected date:", date);
        setSelectedDate(date);
        generateTimeSlots(date);
    };

    // Открытие модального окна для подтверждения бронирования
    const openSlotModal = (slot) => {
        if (!slot.available) {
            alert("This slot is not available.");
            return;
        }
        console.log("Opening slot modal:", slot);
        setSelectedSlot(slot);
        setModalIsOpen(true);
    };

    // Подтверждение бронирования
    const confirmBooking = async () => {
        if (!selectedSlot || !selectedSlot.id) {
            console.warn("No slot selected for booking.");
            return;
        }

        try {
            console.log(
                "Sending booking request for availability ID:",
                selectedSlot.id
            );

            // Отправляем запрос на бронирование
            await axiosInstance.post("/appointments", {
                availability_id: selectedSlot.id,
                start_time: selectedSlot.start.toISOString(),
                end_time: selectedSlot.end.toISOString(),
            });

            alert("Your appointment has been booked successfully!");

            // 1. Локально обновляем availabilities и timeSlots
            const updatedAvailabilities = availabilities.map((availability) =>
                availability.id === selectedSlot.id
                    ? { ...availability, is_booked: true }
                    : availability
            );

            setAvailabilities(updatedAvailabilities);

            const updatedTimeSlots = timeSlots.map((slot) =>
                slot.id === selectedSlot.id
                    ? { ...slot, available: false }
                    : slot
            );

            setTimeSlots(updatedTimeSlots);

            // 2. Закрываем модальное окно
            setModalIsOpen(false);
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert(
                "An error occurred while booking the appointment. Please try again."
            );
        }
    };

    return (
        <section className="meeting-planner">
            <div className="meeting-planner__header">
                <h2 className="meeting-planner__title">Plan a meeting</h2>
                <p className="meeting-planner__info">
                    Coach, you've chosen: <span>{selectedCoach}</span>
                </p>
            </div>

            <div className="meeting-planner__calendar">
                <h3>Select a date</h3>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileDisabled={({ date }) =>
                        // Отключаем даты без доступных слотов
                        !availabilities.some(
                            (slot) =>
                                slot.date === date.toISOString().split("T")[0]
                        )
                    }
                />
            </div>

            {selectedDate && (
                <div className="meeting-planner__slots">
                    <h3>Available slots for {selectedDate.toDateString()}:</h3>
                    {timeSlots.length > 0 ? (
                        <ul>
                            {timeSlots.map((slot, index) => (
                                <li
                                    key={index}
                                    className={
                                        slot.available
                                            ? "slot-available"
                                            : "slot-unavailable"
                                    }
                                >
                                    {slot.start.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {slot.end.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    {slot.available ? (
                                        <button
                                            onClick={() => openSlotModal(slot)}
                                        >
                                            Book
                                        </button>
                                    ) : (
                                        <span> Already booked</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No slots available for this date.</p>
                    )}
                </div>
            )}

            {modalIsOpen && selectedSlot && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Confirm Booking"
                    className="modal-window"
                    overlayClassName="modal-overlay"
                >
                    <h2>Confirm Booking</h2>
                    <p>
                        You are booking the slot:{" "}
                        {selectedSlot.start.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {selectedSlot.end.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <button onClick={confirmBooking}>Confirm</button>
                    <button onClick={() => setModalIsOpen(false)}>
                        Cancel
                    </button>
                </Modal>
            )}
        </section>
    );
};
