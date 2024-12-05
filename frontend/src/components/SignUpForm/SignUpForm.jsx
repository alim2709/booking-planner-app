import React, { useState } from "react";
import BeCodeLogo from "../../assets/icons/BeCode_color.png";
import "./SignUpForm.scss";

export const SignUpForm = () => {
    const [email, setEmail] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("/fakeUsers.json");
            const users = await response.json();

            const userExists = users.some((u) => u.username === login);

            if (userExists) {
                setMessage("This username is already taken.");
            } else {
                setMessage("New account created succesfully.");
            }

        } catch (error) {
            console.error("Error processing registration:", error);
            setMessage("Something went wrong. Please try again later.");
        }
    }

    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-form__header">
                <img
                    className="signup-form__logo"
                    src={BeCodeLogo}
                    alt="BeCode logo"
                />
                <span className="signup-form__title"> Planning</span>
            </div>
            <div className="signup-form__main">
                <label className="signup-form__label" htmlFor="email"><strong>Email</strong></label>
                <input
                    className="signup-form__input"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    title="Please enter your email"
                />
                <label className="signup-form__label" htmlFor="login"><strong>Username</strong></label>
                <input
                    className="signup-form__input"
                    type="text"
                    name="login"
                    id="login"
                    placeholder="Your login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    title="Please enter your login"
                />
                <label className="signup-form__label" htmlFor="password"><strong>Password</strong></label>
                <input
                    className="signup-form__input"
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    title="Please enter your password"
                />
                <label className="signup-form__label" htmlFor="password"><strong>Confirm password</strong></label>
                <input
                    className="signup-form__input"
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="Your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    title="Please confirm your password"
                />
                <button className="signup-form__button">Create account</button>
            </div>
            {message && <p className="signup-form__message">{message}</p>}
        </form>
    );
};