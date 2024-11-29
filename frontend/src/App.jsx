import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

import { Footer } from "./components/Footer/Footer";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { Header } from "./components/Header/Header";
import NotFoundPage from "./pages/NotFoundPage";
import { HomePage } from "./components/HomePage/HomePage";
import { StudentsPage } from "./components/StudentPage/StudentPage";

function App() {
    return (
        <Router>
            <div className="wrapper">
                <Header />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/studPage" element={<StudentsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
