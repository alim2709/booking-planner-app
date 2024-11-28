import React from "react";
import "./App.scss";

import { Footer } from "./components/Footer/Footer";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { Header } from "./components/Header/Header";
import { HomePage } from "./components/HomePage/HomePage";

function App() {
    return (
        <>
            <div className="wrapper">
                <Header />
                <HomePage />
                <LandingPage />
                <Footer />
            </div>
        </>
    );
}

export default App;
