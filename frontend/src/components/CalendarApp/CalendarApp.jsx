import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedCoach) {
            alert("Please select a coach before accessing the calendar.");
            navigate("/selectPage");
        }
    }, [selectedCoach, navigate]);

    const coachId = coachesData[selectedCoach];

    const fetchAvailabilities = async () => {
        try {
            const response = await axiosInstance.get(
                `/availabilities?coach_id=${coachId}`
            );
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

        setTimeSlots(slots);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        generateTimeSlots(date);
    };

    const openSlotModal = (slot) => {
        if (!slot.available) {
            return;
        }
        setSelectedSlot(slot);
        setModalIsOpen(true);
    };

    const confirmBooking = async () => {
        if (!selectedSlot || !selectedSlot.id) return;

        try {
            await axiosInstance.post("/appointments", {
                availability_id: selectedSlot.id,
                start_time: selectedSlot.start.toISOString(),
                end_time: selectedSlot.end.toISOString(),
            });

            alert("Your appointment has been booked successfully!");
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

            setModalIsOpen(false);
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("An error occurred while booking the appointment.");
        }
    };

    return (
        <main>
            <section className="meeting-planner">
                <div className="meeting-planner__header">
                    <h2 className="meeting-planner__title">Plan a meeting</h2>
                    <p className="meeting-planner__info">
                        Coach, you've chosen: <span>{selectedCoach}</span>
                    </p>
                </div>
                <div className="meeting-planner__container">
                    <div className="meeting-planner__calendar">
                        <h3>Step 2 - Choose the meeting date</h3>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            tileDisabled={({ date }) =>
                                !availabilities.some(
                                    (slot) =>
                                        slot.date === date.toISOString().split("T")[0]
                                )
                            }
                        />
                    </div>

                    {selectedDate && (
                        <div className="meeting-planner__slots">
                            <h3>Choose the meeting time</h3>
                            <div className="slots-container">
                                {timeSlots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className={`slot-card ${
                                            slot.available
                                                ? "slot-available"
                                                : "slot-unavailable"
                                        }`}
                                        onClick={() =>
                                            slot.available && openSlotModal(slot)
                                        }
                                    >
                                        <span className="slot-time">
                                            {slot.start.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            -{" "}
                                            {slot.end.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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
                        <button className="modal-confirm-button" onClick={confirmBooking}>Confirm</button>
                        <button className="modal-close-button" onClick={() => setModalIsOpen(false)}>
                            Cancel
                        </button>
                    </Modal>
                )}
            </section>
        </main>
    );
};

