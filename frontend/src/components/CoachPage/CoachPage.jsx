import React from "react";

import "./CoachPage.scss";

export const CoachPage = () => {
    return (
        <section className="students-page">
            <h3 className="students-page__title">My meetings</h3>
            <div className="students-page__meetings">
                <div className="meeting">
                    <div className="meeting__info">
                        <h3 className="meeting__name">Name S.</h3>
                        <p className="meeting__date">Monday, 9 December</p>
                        <p className="meeting__time">10:00</p>
                        <p className="note">
                            Basile, I want to talk with you about our project.
                        </p>
                    </div>
                    <div className="meeting__actions">
                        <a
                            href="#"
                            className="meeting__action meeting__action--change"
                        >
                            change the meeting
                        </a>
                        <a
                            href="#"
                            className="meeting__action meeting__action--cancel"
                        >
                            cancel the meeting
                        </a>
                    </div>
                </div>
                <div className="meeting">
                    <div className="meeting__info">
                        <h3 className="meeting__name">Ervin</h3>
                        <p className="meeting__date">Monday, 10 December</p>
                        <p className="meeting__time">11:00</p>
                        <p className="note">
                            Basile, I want to talk with you about our project.
                        </p>
                    </div>
                    <div className="meeting__actions">
                        <a
                            href="#"
                            className="meeting__action meeting__action--change"
                        >
                            change the meeting
                        </a>
                        <a
                            href="#"
                            className="meeting__action meeting__action--cancel"
                        >
                            cancel the meeting
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
