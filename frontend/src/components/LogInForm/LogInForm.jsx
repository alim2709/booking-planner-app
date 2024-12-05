import React, { useState } from "react";
import BeCodeLogo from "../../assets/icons/BeCode_color.png";
import "./LogInForm.scss";

export const LogInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/fakeUsers.json");
            const users = await response.json();

            console.log("Loaded users:", users); 

            const user = users.find(
                (u) => u.username === login && u.password === password
            );

            if (user) {
                setMessage("You're logged in!");
            } else {
                setMessage("Invalid username or password.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setMessage("Something went wrong. Please try again later.");
        }
    }

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
                <label className="login-form__label" htmlFor="email"><strong>Username</strong></label>
                <input
                    className="login-form__input"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className="login-form__label" htmlFor="password"><strong>Password</strong></label>
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
            {message && <p className="login-form__message">{message}</p>}
        </form>
    );
};
