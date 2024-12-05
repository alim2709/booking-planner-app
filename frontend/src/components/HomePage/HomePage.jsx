import React from "react";
import { Link } from "react-router-dom";

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
                <Link to="/studentPage" className="dashboard__button dashboard__button--primary" href="/">
                    Go to meetings
                </Link>
                <Link to="/selectPage" className="dashboard__button dashboard__button--secondary" href="/">
                    Plan a meeting
                </Link>
            </div>
        </section>
    );
};
