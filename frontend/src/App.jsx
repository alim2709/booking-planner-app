import "./App.scss";
import { Footer } from "./components/Footer/Footer";
import { LandingPage } from "./components/LandingPage/LandingPage"
import { Header } from "./components/Header/Header";

function App() {
    return (
        <>
            <div className="wrapper">
                <Header />
                <LandingPage />
                <Footer />
            </div>
        </>
    );
}

export default App;
