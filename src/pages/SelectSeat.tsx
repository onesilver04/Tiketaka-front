import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cars = ['1호차', '2호차', '3호차'];

const seatMap: Record<string, { rows: string[]; cols: string[] }> = {
    '1호차': { rows: ['1', '2', '3', '4'], cols: ['A', 'B', 'C', 'D'] },
    '2호차': { rows: ['1', '2', '3', '4'], cols: ['A', 'B', 'C', 'D'] },
    '3호차': { rows: ['1', '2', '3', '4'], cols: ['A', 'B', 'C', 'D'] },
};

const SelectSeat = () => {
    const [selectedCar, setSelectedCar] = useState('1호차');
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const navigate = useNavigate();
    // const maxSeats = location.state?.totalPassengers || 1; // 앞에서 선택한 인원 수를 여기에 넘겨서 인원 수에 맞게 선택

    const toggleSeat = (seat: string) => {
        setSelectedSeats((prevSeats) =>
            prevSeats.includes(seat)
                ? prevSeats.filter((s) => s !== seat)
                : [...prevSeats, seat]
        );
    };

    const handleNext = () => {
        console.log('선택된 좌석:', selectedSeats);
        navigate('/reservation/payment', { state: { selectedCar, selectedSeats } });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const { rows, cols } = seatMap[selectedCar];

    return (
        <div className="seat-container">
            <h2>좌석 선택</h2>

            <div>
                <select value={selectedCar} onChange={(e) => {
                    setSelectedCar(e.target.value);
                    // setSelectedSeats([]); // 호차 바꿀 때 초기화 할말..?
                }}>
                    {cars.map((car) => (
                        <option key={car} value={car}>{car}</option>
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
                                    className={`seat ${selectedSeats.includes(seatId) ? 'selected' : ''}`}
                                    onClick={() => toggleSeat(seatId)}
                                >
                                    {row}{col}
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
                            {seat} <button onClick={() => toggleSeat(seat)}>X</button>
                        </span>
                    ))
                ) : (
                    <p>선택한 좌석이 없습니다.</p>
                )}
            </div>

            <button onClick={handleBack}>이전</button>
            <button onClick={handleNext} disabled={selectedSeats.length === 0}>다음</button>
        </div>
    );
};

export default SelectSeat;
