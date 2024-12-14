import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.scss";

import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { Header } from "./components/Header";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { LogInForm } from "./components/LogInForm";
import { SignUpForm } from "./components/SignUpForm";
import { HomePage } from "./components/HomePage";
import { StudentsPage } from "./components/StudentPage";
import { CoachPage } from "./components/CoachPage";
import { CoachSelectionPage } from "./components/CoachSelectionPage";
import { CalendarApp } from "./components/CalendarApp";
import { CalendarAcceptationPage } from "./components/CalendarAcceptationPage";
import { TestApi } from "./services/TestApi";

export const App = () => {
    const [showLogInModal, setShowLogInModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken && refreshToken) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSignUpSuccess = () => {
        setIsAuthenticated(true); // Устанавливаем авторизацию после успешной регистрации
        setShowSignUpModal(false); // Закрываем модалку регистрации
    };

    const handleOpenLogInModal = () => {
        console.log("Opening login modal");
        setShowLogInModal(true);
    };

    const handleOpenSignUpModal = () => {
        setShowSignUpModal(true);
    };

    const handleCloseModal = () => {
        console.log("Closing all modals");
        setShowLogInModal(false);
        setShowSignUpModal(false);
    };

    return (
        <Router>
            <div className="wrapper">
                <Header
                    isAuthenticated={isAuthenticated}
                    onLogout={() => setIsAuthenticated(false)}
                    onOpenLogInModal={handleOpenLogInModal}
                    onOpenSignUpModal={handleOpenSignUpModal}
                />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/studentPage" element={<StudentsPage />} />
                    <Route path="/coachPage" element={<CoachPage />} />
                    <Route
                        path="/selectPage"
                        element={<CoachSelectionPage />}
                    />
                    <Route path="/calendar" element={<CalendarApp />} />
                    <Route
                        path="/acceptationPage"
                        element={<CalendarAcceptationPage />}
                    />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/test-api" element={<TestApi />} />
                </Routes>

                {showLogInModal && (
                    <div className="modal">
                        <div
                            className="modal__overlay"
                            onClick={handleCloseModal}
                        ></div>
                        <div
                            className="modal__content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <LogInForm
                                onTest={handleOpenLogInModal}
                                onCloseModal={handleCloseModal}
                                onSuccess={() => setIsAuthenticated(true)}
                            />
                        </div>
                    </div>
                )}

                {showSignUpModal && (
                    <div className="modal">
                        <div
                            className="modal__overlay"
                            onClick={handleCloseModal}
                        ></div>
                        <div
                            className="modal__content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SignUpForm
                                onCloseModal={handleCloseModal}
                                onTest={handleOpenLogInModal}
                            />
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </Router>
    );
};
