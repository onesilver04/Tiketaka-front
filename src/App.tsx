import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Reservation from "./pages/Reservation";
import TrainList from "./pages/TrainList";
import SelectSeat from "./pages/SelectSeat";
import Payment from "./pages/Payment";
import AddCard from "./pages/AddCard";
import PhoneNumber from "./pages/PhoneNumber";
import Header from "./components/Header";
import "./App.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
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
                    {/* <Route path="/reservation" element={<Reservation />} /> */}
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
                    <Route path="/history" element={<PhoneNumber />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
