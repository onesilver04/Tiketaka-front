import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styleb from "../styles/Box.module.css";
import styles from "../styles/Button.module.css";
import "../styles/TrainList.css";
import { updateCurrentSession, addReservationLog, updateReservationLogSession } from "../utils/session";
import axios from "axios";

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
}

const TrainList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const reservationData = location.state as ReservationData;

    const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
    const [trains, setTrains] = useState<Train[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null); // 세션 아이디 가져옴

    const logClick = (target_id: string, text: string, tag = "button") => {
        if (!sessionId) return;
        addReservationLog({
            sessionId,
            page: "TrainList",
            event: "click",
            target_id,
            tag,
            text,
        });
    };

    useEffect(() => {
        const sessionRaw = localStorage.getItem("currentReservationLogSession");
        if (!sessionRaw) return;

        const session = JSON.parse(sessionRaw);
        const sid = session.sessionId;
        setSessionId(sid);

        updateReservationLogSession({
            sessionId: sid,
            current_page: "TrainList",
        });

        const alreadyLogged = session.logs?.some(
            (log: any) =>
                log.page === "TrainList" &&
                log.event === "navigate" &&
                log.target_id === "page-load"
        );

        if (!alreadyLogged) {
            addReservationLog({
                sessionId: sid,
                page: "TrainList",
                event: "navigate",
                target_id: "page-load",
                tag: "system",
                text: "TrainList 페이지 도착",
            });
        }
    }, []);
    
    useEffect(() => {
        const fetchTrains = async () => {
            try {
                if (!reservationData?.departureStation || !reservationData?.destinationStation || !reservationData?.departureDate) {
                    console.warn("필수 정보 누락");
                    return;
                }

                const departureDate = new Date(reservationData.departureDate);
                const kstOffset = 9 * 60 * 60 * 1000;
                const kstDate = new Date(departureDate.getTime() + kstOffset);
                const dateStr = kstDate.toISOString().split("T")[0];

                const response = await axios.get("http://localhost:3000/trains", {
                    params: {
                        departure: reservationData.departureStation,
                        destination: reservationData.destinationStation,
                        date: dateStr,
                    },
                });

                if (response.data?.trains) {
                    setTrains(response.data.trains);
                } else {
                    console.warn("trains 데이터가 없음");
                }
            } catch (err) {
                console.error("기차 정보 요청 실패:", err);
            }
        };
        fetchTrains();
    }, [reservationData]);

    const handleBack = () => {
        logClick("trainlist-to-reservation", "이전");
        navigate("/reservation");
    };

    const handleSelect = (train: Train) => {
        if (train.availableSeats === 0) return; // 좌석 없으면 선택 불가
        setSelectedTrain(train);
        logClick(`select-trainlist-${train.trainId}`, `${train.trainId} 선택`, "tr");
    };

    const handleNext = () => {
        logClick("trainlist-to-selectseat", "다음");

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
                                <th>남은 <br />좌석 수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trains.map((train) => (
                                <tr
                                    key={train.trainId}
                                    id={`select-trainlist-${train.trainId}`}
                                    onClick={() => handleSelect(train)}
                                    style={{
                                        opacity: train.availableSeats === 0 ? 0.3 : 1,
                                        backgroundColor:
                                            train.trainId === selectedTrain?.trainId
                                                ? "#E3F2FD"
                                                : "transparent",
                                        cursor: train.availableSeats === 0 ? "not-allowed" : "pointer",
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
                                    <td
                                        style={{
                                            color: train.availableSeats <= 15 ? "#FF1744" : "#111111",
                                        }}
                                    >
                                        {train.availableSeats}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="display-button">
                <button
                    className={`${styles.button} train-list-back`}
                    id="trainlist-to-reservation"
                    onClick={handleBack}
                >
                    이전
                </button>
                <button
                    className={`${styles.button} train-list-search`}
                    id="trainlist-to-selectseat"
                    onClick={handleNext}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default TrainList;
