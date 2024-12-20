import React from "react";

import "./StudentPage.scss";

export const StudentsPage = () => {
    return (
        <section className="students-page">
            <h3 className="students-page__title">My meetings</h3>
            <div className="students-page__meetings">
                <div className="meeting">
                    <div className="meeting__info">
                        <h3 className="meeting__name">Basile</h3>
                        <p className="meeting__date">Monday, 16 December</p>
                        <p className="meeting__time">10:00</p>
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
                        <h3 className="meeting__name">Erwin</h3>
                        <p className="meeting__date">Monday, 16 December</p>
                        <p className="meeting__time">11:00</p>
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
