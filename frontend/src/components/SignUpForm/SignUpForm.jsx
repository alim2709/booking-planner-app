import React from "react";
import BeCodeLogo from "../../assets/icons/BeCode_color.png";
import "./SignUpForm.scss";

export const SignUpForm = () => {
    return (
        <form className="signup-form" action="#">
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
                    required
                    title="Please confirm your password"
                />
                <button className="signup-form__button">Create account</button>
            </div>
        </form>
    );
};