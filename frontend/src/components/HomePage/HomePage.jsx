import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/apiClient";
import "./HomePage.scss";

export const HomePage = () => {
    const [userName, setUserName] = useState("User");
    const [numberOfMeet, setNumberOfMeet] = useState(0);

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

        const fetchAppointments = async () => {
            try {
                const response = await axios.get("/appointments"); // получаем все встречи
                const appointments = response.data;

                const userAppointments = appointments.filter(
                    (appointment) => appointment.student_id === parseInt(userId)
                );

                setNumberOfMeet(userAppointments.length);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            }
        };

        fetchUserName();
        fetchAppointments();
    }, []);

    return (
        <section className="dashboard">
            <div className="dashboard__overlay"></div>
            <div className="dashboard__info">
                <h2 className="dashboard__greeting">
                    Hello,<span>{userName}</span> !
                </h2>
                <h2 className="dashboard__meetings">
                    Today you have <span>{numberOfMeet}</span> meetings.
                </h2>
            </div>
            <div className="dashboard__actions">
                <Link
                    to="/studentPage"
                    className="dashboard__button dashboard__button--primary"
                >
                    Go to meetings
                </Link>
                <Link
                    to="/selectPage"
                    className="dashboard__button dashboard__button--secondary"
                >
                    Plan a meeting
                </Link>
            </div>
        </section>
    );
};
