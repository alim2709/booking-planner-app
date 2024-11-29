import React from "react";
import BeCodeLogo from "../../assets/icons/BeCode_logo_BeCode_color.jpg";
import "./LogInForm.scss";

export const LogInForm = () => {
    return (
        <form className="login-form" action="#">
            <div className="login-form__header">
                <img
                    className="login-form__logo"
                    src={BeCodeLogo}
                    alt="BeCode logo"
                />
                <span className="login-form__title">Planning</span>
            </div>
            <label className="login-form__label" htmlFor="login">Login</label>
            <input
                className="login-form__input"
                type="text"
                name="login"
                id="login"
                placeholder="Your login"
            />
            <label className="login-form__label" htmlFor="password">Password</label>
            <input
                className="login-form__input"
                type="password"
                name="password"
                id="password"
                placeholder="Your password"
            />
            <button className="login-form__button">Submit</button>
        </form>
    );
};
