import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "./App.scss";

import { Footer } from "./components/Footer/Footer";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { Header } from "./components/Header/Header";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { LogInForm } from "./components/LogInForm/LogInForm";
import { SignUpForm } from "./components/SignUpForm/SignUpForm";
import { HomePage } from "./components/HomePage/HomePage";
import { StudentsPage } from "./components/StudentPage/StudentPage";
import { CoachPage } from "./components/CoachPage/CoachPage";
import { CoachSelectionPage } from "./components/CoachSelectionPage/CoachSelectionPage";
import { CalendarApp } from "./components/CalendarApp/CalendarApp";
import { CalendarAcceptationPage } from "./components/CalendarAcceptation/CalendarAcceptationPage";

export const App = () => {
    const [showLogInModal, setShowLogInModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    const handleOpenLogInModal = () => {
        setShowLogInModal(true);
    };

    const handleOpenSignUpModal = () => {
        setShowSignUpModal(true);
    };

    const handleCloseModal = () => {
        setShowLogInModal(false);
        setShowSignUpModal(false);
    };

    return (
        <Router>
            <div className="wrapper">
                <Header
                    onOpenLogInModal={handleOpenLogInModal}
                    onOpenSignUpModal={handleOpenSignUpModal}
                />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/studPage" element={<StudentsPage />} />
                    <Route path="/coachPage" element={<CoachPage />} />
                    <Route
                        path="/selectPage"
                        element={<CoachSelectionPage />}
                    />
                    <Route path="/calendar" element={<CalendarApp />} />
                    <Route path="/acceptationPage" element={<CalendarAcceptationPage />} />
                    <Route path="*" element={<NotFoundPage />} />
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
                            <LogInForm />
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
                            <SignUpForm />
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </Router>
    );
};
