import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styleb from "../styles/Box.module.css";

const cars = ["1호차", "2호차", "3호차"];

const seatMap: Record<string, { rows: string[]; cols: string[] }> = {
    "1호차": { rows: ["1", "2", "3", "4"], cols: ["A", "B", "C", "D"] },
    "2호차": { rows: ["1", "2", "3", "4"], cols: ["A", "B", "C", "D"] },
    "3호차": { rows: ["1", "2", "3", "4"], cols: ["A", "B", "C", "D"] },
};

const SelectSeat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const totalPassengers = location.state?.totalPassengers || 1;

    const [selectedCar, setSelectedCar] = useState<string>(() => {
        return sessionStorage.getItem("selectedCar") || "1호차";
    });

    const [selectedSeats, setSelectedSeats] = useState<string[]>(() => {
        const storedSeats = sessionStorage.getItem("selectedSeats");
        return storedSeats ? JSON.parse(storedSeats) : [];
    });

    useEffect(() => {
        sessionStorage.setItem("selectedCar", selectedCar);
        sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    }, [selectedCar, selectedSeats]);

    const toggleSeat = (seat: string) => {
        setSelectedSeats((prevSeats) => {
            if (prevSeats.includes(seat)) {
                return prevSeats.filter((s) => s !== seat);
            } else if (prevSeats.length < totalPassengers) {
                return [...prevSeats, seat];
            } else {
                alert(`최대 ${totalPassengers}개의 좌석만 선택할 수 있습니다.`);
                return prevSeats;
            }
        });
    };

    const handleNext = () => {
        if (selectedSeats.length === 0) {
            alert("좌석을 선택해주세요.");
            return;
        }
        navigate("/reservation/payment", {
            state: { selectedCar, selectedSeats },
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const { rows, cols } = seatMap[selectedCar];

    return (
        <div>
            <title>Seats</title>
            <div className={styleb.box}>
                <div className="seat-container">
                    <h2 className="page-title">좌석 선택</h2>
                    <hr className="page-title-bar" />

                    <div className="content-container">
                        <div>
                            <select
                                value={selectedCar}
                                onChange={(e) => {
                                    setSelectedCar(e.target.value);
                                    setSelectedSeats([]); // 호차 변경 시 선택 좌석 초기화
                                }}
                            >
                                {cars.map((car) => (
                                    <option key={car} value={car}>
                                        {car}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="seat-grid">
                            {rows.map((row) => (
                                <div key={row} className="seat-row">
                                    {cols.map((col) => {
                                        const seatId = `${selectedCar}-${row}${col}`;
                                        return (
                                            <button
                                                key={seatId}
                                                className={`seat ${
                                                    selectedSeats.includes(seatId)
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() => toggleSeat(seatId)}
                                            >
                                                {row}
                                                {col}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="selected-seats">
                            <h4>선택한 좌석 ({selectedSeats.length} / {totalPassengers}):</h4>
                            {selectedSeats.length > 0 ? (
                                selectedSeats.map((seat) => (
                                    <span key={seat} className="selected-seat">
                                        {seat}{" "}
                                        <button onClick={() => toggleSeat(seat)}>X</button>
                                    </span>
                                ))
                            ) : (
                                <p>선택한 좌석이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="display-button">
                <button className="goback-button" onClick={handleBack}>이전</button>
                <button className="search-button" onClick={handleNext} disabled={selectedSeats.length === 0}>다음</button>
            </div>
        </div>
        
    );
};

export default SelectSeat;
