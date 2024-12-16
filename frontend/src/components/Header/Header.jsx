import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import headerImage from "../../assets/icons/BeCode_color_header.png";
import user_logo from "../../assets/icons/company_logos_179664_1520259212.webp";
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
            // Выполняем запрос на logout
            await axiosInstance.get("/logout/");
            console.log("Logout successful");
        } catch (error) {
            console.error("Logout request failed:", error);

            // Если токен недействителен, очищаем localStorage
            if (
                error.response?.status === 403 ||
                error.response?.status === 401
            ) {
                console.warn(
                    "Token expired or invalid. Clearing local storage."
                );
            }
        } finally {
            // Очищаем localStorage и состояние
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");

            // Закрываем выпадающий список
            setIsDropdownOpen(false);

            // Устанавливаем неавторизованное состояние
            if (onLogout) {
                onLogout();
            }

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
                    {/* Если пользователь не авторизован */}
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
                                    <li
                                        className="header__dropdown-item"
                                        onClick={() => navigate("/home")}
                                    >
                                        Home
                                    </li>
                                    <li
                                        className="header__dropdown-item"
                                        onClick={() => navigate("/profile")}
                                    >
                                        Profile
                                    </li>
                                    <li
                                        className="header__dropdown-item"
                                        onClick={() => navigate("/calendar")}
                                    >
                                        Calendar
                                    </li>
                                    <li
                                        className="header__dropdown-item"
                                        onClick={() => navigate("/meetings")}
                                    >
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
