import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './pages/Reservation'
import TrainList from './pages/TrainList'
import SelectSeat from './pages/SelectSeat'
import Payment from './pages/Payment'
import AddCard from "./pages/AddCard";
import PhoneNumber from "./pages/PhoneNumber";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} /> 
                {/*나중에 path "/reservation"으로 변경할 것..*/}
                <Route path="/reservation/train-list" element={<TrainList/>}/>
                <Route path="/reservation/select-seat" element={<SelectSeat/>}/>
                <Route path="/reservation/payment" element={<Payment/>}/>
                <Route path="/reservation/payment/addcard" element={<AddCard/>}/>
                <Route path="/history" element={<PhoneNumber/>}/>
            </Routes>
        </Router>
    );
};

export default App;
