import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import headerImage from "../../assets/icons/BeCode_color_header.png";
import user_logo from "../../assets/icons/circle.png";
import axiosInstance from "../../services/apiClient";
import "./Header.scss";

export const Header = ({
    onOpenLogInModal,
    onOpenSignUpModal,
    isAuthenticated,
    onLogout,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/logout/");
            console.log("Logout successful");
        } catch (error) {
            console.error("Logout request failed:", error);

            if (
                error.response?.status === 403 ||
                error.response?.status === 401
            ) {
                console.warn(
                    "Token expired or invalid. Clearing local storage."
                );
            }
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");

            navigate("/");
        }
    };

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
                    {!isAuthenticated ? (
                        <>
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
                        </>
                    ) : (
                        <div
                            className="header__profile"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="header__profile-icon">
                                <img
                                    src={user_logo}
                                    alt="profile"
                                    className="header__profile-image"
                                />
                            </div>
                            {isDropdownOpen && (
                                <ul className="header__dropdown">
                                    <li className="header__dropdown-item">
                                        Home
                                    </li>
                                    <li className="header__dropdown-item">
                                        Profile
                                    </li>
                                    <li className="header__dropdown-item">
                                        Calendar
                                    </li>
                                    <li className="header__dropdown-item">
                                        Meetings
                                    </li>
                                    <li
                                        className="header__dropdown-item"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};
