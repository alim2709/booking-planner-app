import React, { useState } from "react";
import axios from "axios";

// dsdsd

export const TestApi = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignUp = async () => {
        try {
            const response = await axios.post(
                "http://localhost:7777/api/signUp",
                {
                    username: username.trim(),
                    email: email.trim(),
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Если регистрация успешна
            setMessage(
                `Sign up successful! Welcome, ${
                    response.data.username || username
                }!`
            );
            console.log("Response:", response.data); // Выводим в консоль
        } catch (err) {
            if (err.response) {
                // Логируем ошибки от сервера
                console.error("Error:", err.response.data);
                setMessage(
                    `Sign up error: ${
                        err.response.data.message || "Unknown error"
                    }`
                );
            } else {
                console.error("Request failed:", err);
                setMessage("An error occurred during the sign-up process.");
            }
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h1>Sign Up Form</h1>
            <div style={{ marginBottom: "10px" }}>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                />
            </div>
            <button
                onClick={handleSignUp}
                style={{
                    padding: "10px 15px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Sign Up
            </button>
            {message && (
                <p
                    style={{
                        marginTop: "20px",
                        color: message.includes("error") ? "red" : "green",
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};
