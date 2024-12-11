import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./CoachSelectionPage.scss";

export const CoachSelectionPage = () => {
    const [selectedCoach, setSelectedCoach] = useState(null);

    const handleSelectCoach = (coach) => {
        setSelectedCoach(coach);
    };
    return (
        <section className="choose-coach">
            <div className="choose-coach__header">
                <h1 className="choose-coach__title">Plan a meeting</h1>
            </div>
            <div className="choose-coach__content">
                <h2 className="choose-coach__step">
                    Step 1 - Choose the coach
                </h2>
                <div className="choose-coach__options">
                    {["Basile", "Erwin", "Vanessa"].map((coach, index) => (
                        <div
                            key={index}
                            className={`coach ${
                                selectedCoach === coach ? "coach--selected" : ""
                            }`}
                            onClick={() => handleSelectCoach(coach)}
                        >
                            <div className="coach__circle">
                                {coach.split(" ")[0][0]}
                                {coach.split(" ")[1]
                                    ? coach.split(" ")[1][0]
                                    : ""}
                            </div>
                            <p className="coach__name">{coach}</p>
                        </div>
                    ))}
                </div>
                <Link
                    to="/calendar"
                    className="choose-coach__next-button"
                    disabled={!selectedCoach}
                >
                    Next
                </Link>
                {selectedCoach && (
                    <p className="choose-coach__selected-message">
                        You selected: {selectedCoach}
                    </p>
                )}
            </div>
        </section>
    );
};
