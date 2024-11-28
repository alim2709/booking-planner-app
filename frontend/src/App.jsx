import "./App.scss";
import { Footer } from "./components/Footer/Footer";
import { LandingPage } from "./components/LandingPage/LandingPage"

function App() {
    return (
        <>
            <div className="wrapper">
                <LandingPage />
                <Footer />
            </div>
        </>
    );
}

export default App;
