import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styleb from "../styles/Box.module.css";
import seatImage from "../assets/seat-button.svg";
import trainConvenience from "../assets/train-convenience.svg";
import trainaisle from "../assets/train-track-single.svg";
import "../styles/SelectSeat.css";
import styles from "../styles/Button.module.css";
import { updateCurrentSession } from "../utils/session";

interface Seat {
    seatNumber: string;
    isAvailable: boolean;
}

const dummySeats: Seat[] = [
    { seatNumber: "1A", isAvailable: true },
    { seatNumber: "1B", isAvailable: true },
    { seatNumber: "1C", isAvailable: true },
    { seatNumber: "1D", isAvailable: true },
    { seatNumber: "2A", isAvailable: true },
    { seatNumber: "2B", isAvailable: true },
    { seatNumber: "2C", isAvailable: true },
    { seatNumber: "2D", isAvailable: true },
    { seatNumber: "3A", isAvailable: true },
    { seatNumber: "3B", isAvailable: true },
    { seatNumber: "3C", isAvailable: true },
    { seatNumber: "3D", isAvailable: true },
    { seatNumber: "4A", isAvailable: true },
    { seatNumber: "4B", isAvailable: true },
    { seatNumber: "4C", isAvailable: true },
    { seatNumber: "4D", isAvailable: true },
];

const SelectSeat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { reservationData, trainInfo } = location.state;
    const totalPassengers = reservationData.adultCount + reservationData.seniorCount + reservationData.teenCount;

    const [carriageNumber, setCarriageNumber] = useState<number>(1);
    const [seatMap, setSeatMap] = useState<Record<number, Seat[]>>({});
    const [allSelectedSeats, setAllSelectedSeats] = useState<Record<number, string[]>>({});

    const selectedSeats = allSelectedSeats[carriageNumber] || [];

    // 현재 호차용 좌석 불러오기
    const availableSeats = seatMap[carriageNumber] || [];

    // 한 번만 실행되는 초기화 - 모든 호차 좌석을 준비
    useEffect(() => {
        const newMap: Record<number, Seat[]> = {};
        for (let i = 1; i <= 3; i++) {
            const randomized = dummySeats.map((seat) => ({
                ...seat,
                isAvailable: Math.random() > 0.25,
            }));
            newMap[i] = randomized;
        }
        setSeatMap(newMap);
    }, []);


    useEffect(() => {
        updateCurrentSession({
            selectedSeats: allSelectedSeats,
        });
    }, [allSelectedSeats]);

    const toggleSeat = (seatNumber: string) => {
        setAllSelectedSeats((prev) => {
            // 전체 선택한 좌석 개수 계산
            const totalSelected = Object.values(prev).flat().length;
    
            const current = prev[carriageNumber] || [];
    
            if (current.includes(seatNumber)) {
                return {
                    ...prev,
                    [carriageNumber]: current.filter((s) => s !== seatNumber),
                };
            } else if (totalSelected < totalPassengers) {
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
    

    const handleNext = () => {
        const totalSelected = Object.values(allSelectedSeats).flat().length;
    
        if (totalSelected < totalPassengers) {
            alert(`총 ${totalPassengers}개의 좌석을 선택해야 합니다.`);
            return;
        }
    
        navigate("/reservation/payment", {
            state: {
                reservationData,
                trainInfo,
                selectedSeats: allSelectedSeats, // 모든 호차의 선택 좌석 전달
            },
        });
    };
    

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <title>Seats</title>
            <div className={styleb.box}>
                <div className="seat-container">
                    <h2 className="page-title">좌석 선택</h2>
                    <hr className="page-title-bar" />

                    <div className="content-container">
                        <div className="carriage-selection">
                            <select
                                id="carriage"
                                value={carriageNumber}
                                onChange={(e) => setCarriageNumber(Number(e.target.value))}
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
                                            onClick={() => {
                                            // 특정 호차의 특정 좌석만 삭제
                                            setAllSelectedSeats(prev => ({
                                                ...prev,
                                                [Number(carNum)]: prev[Number(carNum)].filter(s => s !== seat)
                                            }));
                                        }}>X</button>
                                    </span>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <div className="display-button">
                <button className={`${styles.button} select-seat-back`} onClick={handleBack}>
                    이전
                </button>
                <button
                    className={`${styles.button} select-seat-next`}
                    onClick={handleNext}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default SelectSeat;
