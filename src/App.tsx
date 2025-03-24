import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import "./App.css";
import Start from "./pages/Start";
import Header from "./components/Header";
import Reservation from "./pages/Reservation";
import TrainList from "./pages/TrainList";
import SelectSeat from "./pages/SelectSeat";

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
                    {/*나중에 path "/reservation"으로 변경할 것..*/}
                    <Route
                        path="/reservation/train-list"
                        element={<TrainList />}
                    />
                    <Route
                        path="/reservation/select-seat"
                        element={<SelectSeat />}
                    />
                </Routes>
            </Layout>
        </Router>
    );
};
export default App;
