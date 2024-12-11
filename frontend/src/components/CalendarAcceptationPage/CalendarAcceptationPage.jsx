import React from "react";
import './CalendarAcceptationPage.scss';

export const CalendarAcceptationPage = () => {
    return (
        <main className="meeting">
            <h1 className="meeting__title">Plan a meeting</h1>
            <p className="meeting__text--big">
                You've planned a meeting with coach <span className="meeting__highlight">Basile </span>
                on <span className="meeting__highlight">16</span> December at <span className="meeting__highlight">10:00</span>.
            </p>
            <p className="meeting__text">If you have something to add...</p>
            <textarea className="meeting__textarea" name="" id="">Basile, I want to talk with you about our project.</textarea>
            <p className="meeting__text--blue">Is everything correct? Click "Finish".</p>
            <div className="meeting__button">
                <button className="meeting__button--submit" type="submit">Finish</button>
            </div>        
        </main>

    )
}