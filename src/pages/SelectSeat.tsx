import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styleb from "../styles/Box.module.css";
import seatImage from "../assets/seat-button.svg";
import trainConvenience from "../assets/train-convenience.svg";
import trainaisle from "../assets/train-track-single.svg";
import "../styles/SelectSeat.css";
import styles from "../styles/Button.module.css";
import { updateCurrentSession, addReservationLog, updateReservationLogSession } from "../utils/session";
import axios from "axios";

interface Seat {
    seatNumber: string;
    isAvailable: boolean;
}

const SelectSeat = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {};
    const reservationData = state.reservationData;
    const trainInfo = state.trainInfo;
    const totalPassengers = reservationData
        ? reservationData.adultCount + reservationData.seniorCount + reservationData.teenCount
        : 0;

    const [carriageNumber, setCarriageNumber] = useState<number>(1);
    const [seatMap, setSeatMap] = useState<Record<number, Seat[]>>({});
    const [allSelectedSeats, setAllSelectedSeats] = useState<Record<number, string[]>>({});

    const selectedSeats = allSelectedSeats[carriageNumber] || [];
    const availableSeats = seatMap[carriageNumber] || [];

    const sessionId = (() => {
        try {
            return JSON.parse(localStorage.getItem("currentReservationLogSession") || "null")?.sessionId;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        if (sessionId) {
            updateReservationLogSession({
                location: "SelectSeat",
                previous_pages: ["TrainList"],
            });

            const sessionRaw = localStorage.getItem("currentReservationLogSession");
            if (sessionRaw) {
                const session = JSON.parse(sessionRaw);
                const alreadyLogged = session.logs?.some(
                    (log: any) =>
                        log.page === "SelectSeat" &&
                        log.event === "navigate" &&
                        log.target_id === "page-load"
                );

                if (!alreadyLogged) {
                    addReservationLog({
                        sessionId,
                        page: "SelectSeat",
                        event: "navigate",
                        target_id: "page-load",
                        tag: "system",
                        text: "SelectSeat 페이지 도착",
                    });
                }
            }
        }
    }, [sessionId]);

    const logClick = (target_id: string, text: string, tag = "button") => {
        if (!sessionId) return;
        addReservationLog({
            sessionId,
            page: "SelectSeat",
            event: "click",
            target_id,
            tag,
            text,
        });
    };

    useEffect(() => {
        const fetchSeats = async () => {
            if (!trainInfo?.trainId) return;

            const newMap: Record<number, Seat[]> = {};
            for (let i = 1; i <= 3; i++) {
                try {
                    const res = await axios.get(`http://localhost:3000/seats/${trainInfo.trainId}/${i}`);
                    newMap[i] = res.data?.availableSeats || [];
                } catch (err) {
                    console.error(`호차 ${i} 좌석 정보를 불러오지 못했습니다:`, err);
                    newMap[i] = [];
                }
            }
            setSeatMap(newMap);
        };

        fetchSeats();
    }, [trainInfo]);

    useEffect(() => {
        updateCurrentSession({ selectedSeats: allSelectedSeats });
    }, [allSelectedSeats]);

    const toggleSeat = (seatNumber: string) => {
        setAllSelectedSeats((prev) => {
            const totalSelected = Object.values(prev).flat().length;
            const current = prev[carriageNumber] || [];

            if (current.includes(seatNumber)) {
                logClick(`seat-${carriageNumber}-${seatNumber}`, `좌석 해제: ${carriageNumber}호차 ${seatNumber}`);
                return {
                    ...prev,
                    [carriageNumber]: current.filter((s) => s !== seatNumber),
                };
            } else if (totalSelected < totalPassengers) {
                logClick(`seat-${carriageNumber}-${seatNumber}`, `좌석 선택: ${carriageNumber}호차 ${seatNumber}`);
                return {
                    ...prev,
                    [carriageNumber]: [...current, seatNumber],
                };
            } else {
                alert(`총 ${totalPassengers}개의 좌석만 선택할 수 있습니다.`);
                return prev;
            }
        });
    };

    const handleDelete = (carNum: number, seat: string) => {
        logClick(`delete-seat-${carNum}-${seat}`, `좌석 제거: ${carNum}호차 ${seat}`, "button");
        setAllSelectedSeats((prev) => ({
            ...prev,
            [carNum]: prev[carNum].filter((s) => s !== seat),
        }));
    };

    const handleNext = () => {
        logClick("selectseat-to-payment", "다음");
        const totalSelected = Object.values(allSelectedSeats).flat().length;
        if (totalSelected < totalPassengers) {
            alert(`총 ${totalPassengers}개의 좌석을 선택해야 합니다.`);
            return;
        }
        navigate("/reservation/payment", {
            state: {
                reservationData,
                trainInfo,
                selectedSeats: allSelectedSeats,
            },
        });
    };

    const handleBack = () => {
        logClick("selectseat-to-trainlist", "이전");
        navigate("/reservation/train-list", {
            state: {
                reservationData, // 이전 버튼 정보 유지
                selectedTrain: trainInfo,
            },
        });
    };

    return (
        <div>
            <div className={styleb.box}>
                <div className="seat-container">
                    <h2 className="page-title">좌석 선택</h2>
                    <hr className="page-title-bar" />

                    {reservationData && trainInfo ? (
                        <div className="content-container">
                            <div className="carriage-selection">
                                <select
                                    id="carriage"
                                    value={carriageNumber}
                                    onChange={(e) => {
                                        const selected = Number(e.target.value);
                                        logClick(`carriage-select-${selected}`, `${selected}호차 선택`);
                                        setCarriageNumber(selected);
                                    }}
                                >
                                    <option value={1}>1호차</option>
                                    <option value={2}>2호차</option>
                                    <option value={3}>3호차</option>
                                </select>
                            </div>

                            <div className="train-convenience-box">
                                <img className="train-convenience-img" src={trainConvenience} alt="기차 편의 시설" />
                            </div>

                            <div className="seat-grid">
                                <div className="seat-guide">
                                    <div>창측</div>
                                    <div>내측</div>
                                    <div></div>
                                    <div>내측</div>
                                    <div>창측</div>
                                </div>

                                {[1, 2, 3, 4].map((row) => (
                                    <React.Fragment key={row}>
                                        {["A", "B"].map((col) => {
                                            const seat = availableSeats.find(
                                                (s) => s.seatNumber === `${row}${col}`
                                            );
                                            return seat && (
                                                <button
                                                    key={seat.seatNumber}
                                                    className={`seat ${selectedSeats.includes(seat.seatNumber) ? "selected" : ""}`}
                                                    onClick={() => seat.isAvailable && toggleSeat(seat.seatNumber)}
                                                    disabled={!seat.isAvailable}
                                                >
                                                    <img
                                                        src={seatImage}
                                                        alt="Seat"
                                                        className={`seat-icon ${!seat.isAvailable ? "disabled" : ""}`}
                                                    />
                                                    <div className="seat-number">{seat.seatNumber}</div>
                                                </button>
                                            );
                                        })}
                                        <div className="train-aisle">
                                            <img src={trainaisle} alt="기차 통로 이미지" />
                                        </div>
                                        {["C", "D"].map((col) => {
                                            const seat = availableSeats.find(
                                                (s) => s.seatNumber === `${row}${col}`
                                            );
                                            return seat && (
                                                <button
                                                    key={seat.seatNumber}
                                                    className={`seat ${selectedSeats.includes(seat.seatNumber) ? "selected" : ""}`}
                                                    onClick={() => seat.isAvailable && toggleSeat(seat.seatNumber)}
                                                    disabled={!seat.isAvailable}
                                                >
                                                    <img
                                                        src={seatImage}
                                                        alt="Seat"
                                                        className={`seat-icon ${!seat.isAvailable ? "disabled" : ""}`}
                                                    />
                                                    <div className="seat-number">{seat.seatNumber}</div>
                                                </button>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="selected-seats">
                                <h4>선택한 좌석: </h4>
                                {Object.entries(allSelectedSeats).flatMap(([carNum, seats]) =>
                                    seats.map((seat) => (
                                        <span key={`${carNum}-${seat}`} className="selected-seat">
                                            {carNum}호차 - {seat}
                                            <button
                                                id="selected-seats-delete"
                                                onClick={() => handleDelete(Number(carNum), seat)}
                                            >
                                                X
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: "2rem", textAlign: "center" }}>
                            <p>기차 정보가 없어 좌석 정보를 표시할 수 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="display-button">
                <button className={`${styles.button} select-seat-back`} id="selectseat-to-trainlist" onClick={handleBack}>
                    이전
                </button>
                <button className={`${styles.button} select-seat-next`} id="selectseat-to-payment" onClick={handleNext}>
                    다음
                </button>
            </div>
        </div>
    );
};

export default SelectSeat;
