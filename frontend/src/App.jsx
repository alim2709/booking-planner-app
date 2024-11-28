import React from "react";
import "./App.scss";

import { Header } from "./components/Header/Header";
import { HomePage } from "./components/HomePage/HomePage";

function App() {
    return (
        <>
            <div className="wrapper">
                <Header />
                <HomePage />
            </div>
        </>
    );
}

export default App;
