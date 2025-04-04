import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styleb from "../styles/Box.module.css";
import styles from "../styles/Button.module.css";
import "../styles/TrainList.css";
import { updateCurrentSession } from "../utils/session";

interface ReservationData {
    departureStation: string | null;
    destinationStation: string | null;
    departureDate: Date | null;
    adultCount: number;
    seniorCount: number;
    teenCount: number;
}

interface Train {
    trainId: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    availableSeats: number;
    disabled?: boolean;
}

const KTXTrains: Train[] = [
    { trainId: "KTX1", departureTime: "05:13", arrivalTime: "07:14", price: 69000, availableSeats: 36 },
    { trainId: "KTX2", departureTime: "06:21", arrivalTime: "08:20", price: 69000, availableSeats: 10 },
    { trainId: "KTX3", departureTime: "08:36", arrivalTime: "10:02", price: 71600, availableSeats: 0, disabled: true },
    { trainId: "KTX4", departureTime: "11:03", arrivalTime: "13:14", price: 69000, availableSeats: 29 },
    { trainId: "KTX5", departureTime: "12:27", arrivalTime: "15:20", price: 69000, availableSeats: 12 },
    { trainId: "KTX6", departureTime: "15:13", arrivalTime: "17:14", price: 54000, availableSeats: 97 },
    { trainId: "KTX7", departureTime: "16:21", arrivalTime: "18:20", price: 69000, availableSeats: 23 },
    { trainId: "KTX8", departureTime: "18:36", arrivalTime: "20:02", price: 71600, availableSeats: 0, disabled: true },
    { trainId: "KTX9", departureTime: "21:03", arrivalTime: "23:14", price: 32000, availableSeats: 17 },
    { trainId: "KTX10", departureTime: "22:27", arrivalTime: "01:20", price: 69000, availableSeats: 8 },
];

const TrainList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const reservationData = location.state as ReservationData;

    const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSelect = (train: Train) => {
        if (!train.disabled) {
        setSelectedTrain(train);
        }
    };

    const handleNext = () => {
        if (!selectedTrain) {
            alert("기차를 선택해주세요.");
            return;
        }

        updateCurrentSession({ trainInfo: selectedTrain });

        navigate("/reservation/select-seat", {
            state: {
                reservationData,
                trainInfo: selectedTrain,
            },
        });
    };

    return (
        <div>
        <div className={styleb.box}>
            <h2 className="page-title">시간대 선택</h2>
            <hr className="page-title-bar" />

            <div className="content-container">
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <th>출발</th>
                    <th>도착</th>
                    <th>가격</th>
                    <th>남은 <br/>좌석 수</th>
                </tr>
                </thead>
                <tbody>
                {KTXTrains.map((train) => (
                    <tr
                    key={train.trainId}
                    id={`select-trainlist-${train.trainId}`}
                    onClick={() => handleSelect(train)}
                    style={{
                        opacity: train.disabled ? 0.3 : 1,
                        backgroundColor:
                        train.trainId === selectedTrain?.trainId
                            ? "#E3F2FD"
                            : "transparent",
                        cursor: train.disabled ? "not-allowed" : "pointer",
                        transition: "0.3s ease-in-out",
                        borderRadius: "8px",
                    }}
                    className={
                        train.trainId === selectedTrain?.trainId ? "selected-row" : ""
                    }
                    >
                    <td>{train.departureTime}</td>
                    <td>{train.arrivalTime}</td>
                    <td>{train.price.toLocaleString()}원</td>
                    <td style={{ color: train.availableSeats <= 15 ? "#FF1744" : "#111111" }}>
                        {train.availableSeats}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        <div className="display-button">
            <button className={`${styles.button} train-list-back`} id="trainlist-to-reservation" onClick={handleBack}>
            이전
            </button>
            <button className={`${styles.button} train-list-search`} id="trainlist-to-selectseat" onClick={handleNext}>
            다음
            </button>
        </div>
        </div>
    );
};

export default TrainList;
