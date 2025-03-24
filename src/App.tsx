import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import "./App.css";
import Start from "./pages/Start";
import Reservation from "./pages/Reservation";
import Header from "./components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    // Start 페이지에서는 Header 생략
    const isStartPage = location.pathname === "/";

    return (
        <>
            {!isStartPage && <Header />}
            <div className="App">{children}</div>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/reservation" element={<Reservation />} />
                </Routes>
            </Layout>
        </Router>
    );
};
export default App;
