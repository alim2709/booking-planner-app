import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/apiClient";
import BeCodeLogo from "../../assets/icons/BeCode_color.png";
import "./LogInForm.scss";

const decodeJWT = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Декодируем payload
        console.log("Decoded JWT Payload:", payload); // Логируем весь payload
        return payload;
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
};

export const LogInForm = ({ onCloseModal, onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:7777/api/login",
                {
                    email: email.trim(),
                    password: password.trim(),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Login successful:", response.data);

            // Сохраняем токены в localStorage
            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // Декодируем токен и извлекаем user_id
            const decodedPayload = decodeJWT(accessToken);
            const userId = decodedPayload?.user.id || null;
            console.log("Decoded User ID:", userId);

            // Сохраняем user_id в localStorage, если он найден
            if (userId) {
                localStorage.setItem("userId", userId);
            } else {
                console.warn("User ID not found in token payload.");
            }

            setMessage(`Login successful! Welcome, ${email}!`);

            if (onSuccess) {
                onSuccess();
            }
            if (onCloseModal) {
                onCloseModal();
            }

            navigate("/home");
        } catch (error) {
            if (error.response) {
                console.error("Login failed:", error.response.data);
                setMessage(
                    `Login failed: ${
                        error.response.data.message || "Invalid credentials"
                    }`
                );
            } else {
                console.error("Request error:", error);
                setMessage("An error occurred during login. Please try again.");
            }
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form__header">
                <img
                    className="login-form__logo"
                    src={BeCodeLogo}
                    alt="BeCode logo"
                />
                <span className="login-form__title"> Planning</span>
            </div>
            <div className="login-form__main">
                <label className="login-form__label" htmlFor="email">
                    <strong>Email</strong>
                </label>
                <input
                    className="login-form__input"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className="login-form__label" htmlFor="password">
                    <strong>Password</strong>
                </label>
                <input
                    className="login-form__input"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-form__button">Submit</button>
            </div>
            {message && (
                <p
                    className="login-form__message"
                    style={{
                        color: message.includes("failed") ? "red" : "green",
                    }}
                >
                    {message}
                </p>
            )}
        </form>
    );
};
