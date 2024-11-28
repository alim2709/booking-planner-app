import React from "react";
import './LandingPage.scss';

export const LandingPage = () => {
    return (
        <main className="main">
            <section className="main__image-section">
                <div className="main__overlay">
                    <p className="main__quote">
                        "Understanding the process of finding a solution is far more valuable than the solution itself."
                    </p>
                    <p className="main__author">- Lea Verou</p>
                </div>
            </section>
        </main>
    )
}