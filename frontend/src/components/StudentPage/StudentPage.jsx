import React, { useState, useEffect } from "react";
import axios from "../../services/apiClient";
import coachesData from "../../services/coaches.json";
import "./StudentPage.scss";

export const StudentsPage = () => {
    // const [userName, setUserName] = useState("User");
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.warn("No userId found in localStorage.");
            return;
        }

        const fetchUserName = async () => {
            try {
                const response = await axios.get("/users");
                const users = response.data;

                const user = users.find((u) => u.id === parseInt(userId));
                if (user && user.username) {
                    setUserName(user.username);
                } else {
                    console.warn("User not found in the user list.");
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        // Получаем встречи текущего пользователя
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("/appointments");
                const appointments = response.data;

                const userAppointments = appointments.filter(
                    (appointment) => appointment.student_id === parseInt(userId)
                );
                const enrichedAppointments = userAppointments.map(
                    (appointment) => {
                        const coachName = Object.keys(coachesData).find(
                            (name) => coachesData[name] === appointment.coach_id
                        );

                        // Соединяем `date` и `start_time` / `end_time`
                        const startDate = new Date(
                            `${appointment.date}T${appointment.start_time}`
                        );
                        const endDate = new Date(
                            `${appointment.date}T${appointment.end_time}`
                        );

                        return {
                            ...appointment,
                            coachName: coachName || "Unknown Coach",
                            formattedDate: startDate.toLocaleDateString(
                                "en-US",
                                {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                }
                            ),
                            formattedStartTime: startDate.toLocaleTimeString(
                                "en-US",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            ),
                            formattedEndTime: endDate.toLocaleTimeString(
                                "en-US",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            ),
                        };
                    }
                );

                setMeetings(enrichedAppointments);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            }
        };

        fetchUserName();
        fetchAppointments();
    }, []);

    return (
        <section className="students-page">
            <h3 className="students-page__title">My meetings</h3>
            <div className="students-page__meetings">
                {meetings.length > 0 ? (
                    meetings.map((meeting) => (
                        <div className="meeting" key={meeting.id}>
                            <div className="meeting__info">
                                <h3 className="meeting__name">
                                    {meeting.coachName}
                                </h3>
                                <p className="meeting__date">
                                    {meeting.formattedDate}
                                </p>
                                <p className="meeting__time">
                                    {meeting.formattedStartTime} -{" "}
                                    {meeting.formattedEndTime}
                                </p>
                            </div>
                            <div className="meeting__actions">
                                <a
                                    href="#"
                                    className="meeting__action meeting__action--change"
                                >
                                    change the meeting
                                </a>
                                <a
                                    href="#"
                                    className="meeting__action meeting__action--cancel"
                                >
                                    cancel the meeting
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no meetings scheduled.</p>
                )}
            </div>
        </section>
    );
};
