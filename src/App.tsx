import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './pages/Reservation'
import TrainList from './pages/TrainList'
import SelectSeat from './pages/SelectSeat'

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} /> 
                {/*나중에 path "/reservation"으로 변경할 것..*/}
                <Route path="/reservation/train-list" element={<TrainList/>}/>
                <Route path="/reservation/select-seat" element={<SelectSeat/>}/>
            </Routes>
        </Router>
    );
};

export default App;
