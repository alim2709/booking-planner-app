import React from "react";
import headerImage from "../../assets/icons/BeCode_color_header.png";

import "./Header.scss";

export const Header = ({ onOpenLogInModal, onOpenSignUpModal }) => {
    return (
        <div className="container">
            <header className="header">
                <div className="header__logo">
                    <a className="header__logo-link" href="/">
                        <img
                            className="header__image"
                            src={headerImage}
                            alt="becodeLogo"
                        />
                    </a>

                    <span className="header__title">Planning</span>
                </div>
                <div className="header__actions">
                    <a
                        className="header__link header__link--login"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onOpenLogInModal();
                        }}
                    >
                        Log In
                    </a>
                    <a
                        className="header__link header__link--signup"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onOpenSignUpModal();
                        }}
                    >
                        Sign Up
                    </a>
                </div>
            </header>
        </div>
    );
};
