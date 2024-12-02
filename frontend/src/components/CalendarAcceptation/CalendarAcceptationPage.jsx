import React from "react";
import './CalendarAcceptationPage.scss';

export const CalendarAcceptationPage = () => {
    return (
        <main class="meeting">
            <h1 class="meeting__title">Plan a meeting</h1>
            <p class="meeting__text--big">
                You've planned a meeting with coach <span class="meeting__highlight">Basile </span>
                on <span class="meeting__highlight">16</span> December at <span class="meeting__highlight">10:00</span>.
            </p>
            <p class="meeting__text">If you have something to add...</p>
            <textarea class="meeting__textarea" name="" id="">Basile, I want to talk with you about our project.</textarea>
            <p class="meeting__text--blue">Is everything correct? Click "Finish".</p>
            <div class="meeting__button">
                <button class="meeting__button--submit" type="submit">Finish</button>
            </div>        
        </main>

    )
}