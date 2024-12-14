import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import coachesData from "../../services/coaches.json";
import "./CoachSelectionPage.scss";

export const CoachSelectionPage = () => {
    const [coaches, setCoaches] = useState({});
    const [selectedCoach, setSelectedCoach] = useState(null);

    useEffect(() => {
        setCoaches(coachesData);
    }, []);

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
                    {Object.entries(coaches).map(([name, id]) => (
                        <div
                            key={id}
                            className={`coach ${
                                selectedCoach === name ? "coach--selected" : ""
                            }`}
                            onClick={() => handleSelectCoach(name)}
                        >
                            <div className="coach__circle">
                                {name[0]}
                                {name.split(" ")[1]
                                    ? name.split(" ")[1][0]
                                    : ""}
                            </div>
                            <p className="coach__name">{name}</p>
                        </div>
                    ))}
                </div>
                <Link
                    to={`/calendar?coach=${selectedCoach}`}
                    className={`choose-coach__next-button ${
                        !selectedCoach ? "disabled" : ""
                    }`}
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
