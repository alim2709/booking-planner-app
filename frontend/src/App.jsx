import React, { useState } from "react";
import "./App.scss";

import { Footer } from "./components/Footer/Footer";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { Header } from "./components/Header/Header";
import { LogInForm } from "./components/LogInForm/LogInForm";
import { SignUpForm } from "./components/SignUpForm/SignUpForm";
import { HomePage } from "./components/HomePage/HomePage";

export const App = () => {
    const [showLogInModal, setShowLogInModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    const handleOpenLogInModal = () => {
        setShowLogInModal(true);
    }

    const handleOpenSignUpModal = () => {
        setShowSignUpModal(true);
    }

    const handleCloseModal = () => {
        setShowLogInModal(false);
        setShowSignUpModal(false);
    }

    return (
        <>
            <div className="wrapper">
                <Header onOpenLogInModal={handleOpenLogInModal} onOpenSignUpModal={handleOpenSignUpModal} />

                {showLogInModal && (
                    <div className="modal">
                        <div className="modal__overlay" onClick={handleCloseModal}></div>
                        <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                            <LogInForm />
                        </div>
                    </div>
                )}

                {showSignUpModal && (
                    <div className="modal">
                        <div className="modal__overlay" onClick={handleCloseModal}></div>
                        <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                            <SignUpForm />
                        </div>
                    </div>
                )}

                <HomePage />
                <LandingPage />
                <Footer />
            </div>
        </>
    );
}
