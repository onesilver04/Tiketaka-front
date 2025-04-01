import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import "./App.css";
import Start from "./pages/Start";
import Reservation from "./pages/Reservation";
import TrainList from "./pages/TrainList";
import SelectSeat from "./pages/SelectSeat";
import Payment from "./pages/Payment";
import AddCard from "./pages/AddCard";
import PhoneNumber from "./pages/PhoneNumber";
import Header from "./components/Header";
import History from "./pages/History";
import RefundModal from "./components/RefundModal";
import RefundModalDetail from "./components/RefundModalDetail";
import BookingDetail from "./pages/BookingDetail";
import RefundSuccess from "./pages/RefundSuccess";
import End from "./pages/End";
import HistoryNone from "./pages/HistoryNone";
import TakaButton from "./components/TakaButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    const hideHeaderRoutes = ["/", "/reservation/payment/end"]; // 헤더 숨길 경로들
    const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

    return (
        <>
            {!shouldHideHeader && <Header />}
            {!shouldHideHeader && <TakaButton />}
            <div
                className="App"
                style={{ position: "relative", minHeight: "100vh" }}
            >
                {children}
            </div>
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
                    <Route
                        path="/reservation/train-list"
                        element={<TrainList />}
                    />
                    <Route
                        path="/reservation/select-seat"
                        element={<SelectSeat />}
                    />
                    <Route path="/reservation/payment" element={<Payment />} />
                    <Route
                        path="/reservation/payment/addcard"
                        element={<AddCard />}
                    />
                    <Route path="/phonenumber" element={<PhoneNumber />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/history-none" element={<HistoryNone />} />
                    <Route path="/history" element={<RefundModal />} />
                    <Route
                        path="/history/refund-modal-detail"
                        element={<RefundModalDetail />}
                    />
                    <Route
                        path="/history/booking-detail"
                        element={<BookingDetail />}
                    />
                    <Route
                        path="/history/refund-success"
                        element={<RefundSuccess />}
                    />
                    <Route path="/reservation/payment/end" element={<End />} />
                </Routes>
            </Layout>
        </Router>
    );
};
export default App;
