import React from "react";

import "./HomePage.scss";

export const HomePage = () => {
    return (
        <section class="dashboard">
            <div className="dashboard__overlay"></div>
            <div class="dashboard__info">
                <h2 class="dashboard__greeting">Hello, User!</h2>
                <h2 class="dashboard__meetings">
                    Today you have <span>2</span> meetings.
                </h2>
            </div>
            <div class="dashboard__actions">
                <a
                    href="#"
                    class="dashboard__button dashboard__button--primary"
                >
                    Go to meetings
                </a>
                <a
                    href="#"
                    class="dashboard__button dashboard__button--secondary"
                >
                    Plan a meeting
                </a>
            </div>
        </section>
    );
};
