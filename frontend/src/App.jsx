import React, { useState } from "react";
import "./App.scss";
import { Footer } from "./components/Footer/Footer";
import { LandingPage } from "./components/LandingPage/LandingPage"
import { Header } from "./components/Header/Header";
import { LogInForm } from "./components/LogInForm/LogInForm";

export const App = () => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <div className="wrapper">
                <Header onOpenModal={handleOpenModal} />

                {showModal && (
                    <div className="modal">
                        <div className="modal__overlay" onClick={handleCloseModal}></div>
                        <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                            <LogInForm />
                        </div>
                    </div>
                )}
                <LandingPage />
                <Footer />
            </div>
        </>
    );
}
