import React, { useState } from "react";
import axios from "axios";

export const TestLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
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

            // Успешный логин
            setMessage(`Login successful! Welcome back, ${email}!`);
            console.log("Response:", response.data); // Вывод ответа сервера
        } catch (err) {
            if (err.response) {
                // Логируем ошибки от сервера
                console.error("Error:", err.response.data);
                setMessage(
                    `Login failed: ${
                        err.response.data.message || "Invalid credentials"
                    }. Server details: ${JSON.stringify(err.response.data)}`
                );
            } else {
                console.error("Request failed:", err);
                setMessage("An error occurred during login.");
            }
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h1>Login</h1>
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
                onClick={handleLogin}
                style={{
                    padding: "10px 15px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Login
            </button>
            {message && (
                <p
                    style={{
                        marginTop: "20px",
                        color: message.includes("failed") ? "red" : "green",
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};
