// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// import "./HomePage.scss";

// export const HomePage = () => {
//     const [numberOfMeet, setNumberOfMeet] = useState(0);
//     return (
//         <section className="dashboard">
//             <div className="dashboard__overlay"></div>
//             <div className="dashboard__info">
//                 <h2 className="dashboard__greeting">Hello, User!</h2>
//                 <h2 className="dashboard__meetings">
//                     Today you have <span>{numberOfMeet}</span> meetings.
//                 </h2>
//             </div>
//             <div className="dashboard__actions">
//                 <Link
//                     to="/studentPage"
//                     className="dashboard__button dashboard__button--primary"
//                     href="/"
//                 >
//                     Go to meetings
//                 </Link>
//                 <Link
//                     to="/selectPage"
//                     className="dashboard__button dashboard__button--secondary"
//                     href="/"
//                 >
//                     Plan a meeting
//                 </Link>
//             </div>
//         </section>
//     );
// };

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/apiClient";
import "./HomePage.scss";

export const HomePage = () => {
    const [userName, setUserName] = useState("User"); // Никнейм пользователя
    const [numberOfMeet, setNumberOfMeet] = useState(0); // Количество встреч

    useEffect(() => {
        const userId = localStorage.getItem("userId"); // Получаем ID пользователя из localStorage

        if (!userId) {
            console.warn("No userId found in localStorage.");
            return;
        }

        // 1. Запрашиваем список пользователей
        const fetchUserName = async () => {
            try {
                const response = await axios.get("/users"); // Получаем всех пользователей
                const users = response.data; // Ответ от сервера

                // Ищем пользователя по userId
                const user = users.find((u) => u.id === parseInt(userId));
                if (user && user.username) {
                    setUserName(user.username); // Устанавливаем никнейм
                } else {
                    console.warn("User not found in the user list.");
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        // 2. Запрашиваем встречи для текущего пользователя
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("/appointments"); // Получаем все встречи
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
    }, []); // Выполняется один раз при монтировании

    return (
        <section className="dashboard">
            <div className="dashboard__overlay"></div>
            <div className="dashboard__info">
                <h2 className="dashboard__greeting">Hello, {userName}!</h2>
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
