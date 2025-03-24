// SelectSeat.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const seatRows = ["1", "2", "3", "4"];
const seatCols = ["A", "B", "C", "D"];
const cars = ["1호차", "2호차", "3호차"];

const SelectSeat = () => {
    const [selectedCar, setSelectedCar] = useState("1호차");
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const navigate = useNavigate();

    const toggleSeat = (seat: string) => {
        setSelectedSeats((prevSeats) =>
            prevSeats.includes(seat)
                ? prevSeats.filter((s) => s !== seat)
                : [...prevSeats, seat]
        );
    };

    const handleNext = () => {
        console.log("선택된 좌석:", selectedSeats);
        navigate("/reservation/confirm", {
            state: { selectedCar, selectedSeats },
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="seat-container">
            <h2>좌석 선택</h2>

            <div>
                <select
                    value={selectedCar}
                    onChange={(e) => setSelectedCar(e.target.value)}
                >
                    {cars.map((car) => (
                        <option key={car} value={car}>
                            {car}
                        </option>
                    ))}
                </select>
            </div>

            <div className="seat-grid">
                {seatRows.map((row) => (
                    <div key={row} className="seat-row">
                        {seatCols.map((col) => {
                            const seatId = `${row}${col}`;
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
                                    {seatId}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="selected-seats">
                <h4>선택한 좌석:</h4>
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

            <button onClick={handleBack}>이전전</button>
            <button onClick={handleNext} disabled={selectedSeats.length === 0}>
                다음
            </button>
        </div>
    );
};

export default SelectSeat;
