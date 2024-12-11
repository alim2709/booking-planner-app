import React, { useState } from "react";
import Modal from "react-modal";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
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

const events = [
    {
        title: "Meeting with Team",
        start: new Date(2024, 10, 26, 14, 0),
        end: new Date(2024, 10, 26, 15, 0),
        allDay: false,
        description: "Discuss project milestones and next steps.",
        location: "Room 101",
    },
    {
        title: "Presentation Preparation",
        start: new Date(2024, 10, 27, 11, 0),
        end: new Date(2024, 10, 27, 12, 0),
        allDay: false,
        description: "Prepare slides for the upcoming presentation.",
        location: "Online (Zoom)",
    },
]; // test data

export const CalendarApp = () => {
    const [calendarEvents, setCalendarEvents] = useState(events);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSelectSlot = (slotInfo) => {
        const title = window.prompt("Enter event title");
        if (title) {
            setCalendarEvents([
                ...calendarEvents,
                {
                    title,
                    start: slotInfo.start,
                    end: slotInfo.end,
                    allDay: slotInfo.action === "doubleClick",
                },
            ]);
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const closeModalWindow = () => {
        setSelectedEvent(null);
    };

    return (
        <section className="meeting-planner">
            <div className="meeting-planner__header">
                <h2 className="meeting-planner__title">Plan a meeting</h2>
                <p className="meeting-planner__info">
                    Coach, you've chosen: <span>Basile</span>
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
                <button className="meeting-planner__button">Next</button>
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
                        <strong>Description:</strong>{" "}
                        {selectedEvent.description || "No description provided"}
                    </p>
                    <p>
                        <strong>Location:</strong>{" "}
                        {selectedEvent.location || "No location specified"}
                    </p>
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
