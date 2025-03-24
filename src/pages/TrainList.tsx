// TrainList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface Train {
    id: number;
    departure: string;
    arrival: string;
    price: string;
    seatsLeft: number;
    disabled?: boolean;
}

const dummyTrains: Train[] = [
    {
        id: 1,
        departure: "05:13",
        arrival: "07:14",
        price: "69,000원",
        seatsLeft: 36,
    },
    {
        id: 2,
        departure: "06:21",
        arrival: "08:20",
        price: "69,000원",
        seatsLeft: 10,
    },
    {
        id: 3,
        departure: "08:36",
        arrival: "10:02",
        price: "71,600원",
        seatsLeft: 0,
        disabled: true,
    },
    {
        id: 4,
        departure: "11:03",
        arrival: "13:14",
        price: "69,000원",
        seatsLeft: 29,
    },
    {
        id: 5,
        departure: "12:27",
        arrival: "15:20",
        price: "69,000원",
        seatsLeft: 12,
    },
];

const TrainList = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const handleNext = () => {
        navigate("/reservation/select-seat");
    };

    return (
        <div>
            <h2>시간대 선택</h2>

            <table>
                <thead>
                    <tr>
                        <th>출발</th>
                        <th>도착</th>
                        <th>가격</th>
                        <th>남은 좌석 수</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyTrains.map((train) => (
                        <tr
                            key={train.id}
                            style={{ opacity: train.disabled ? 0.4 : 1 }}
                        >
                            <td>{train.departure}</td>
                            <td>{train.arrival}</td>
                            <td>{train.price}</td>
                            <td
                                style={{
                                    color:
                                        train.seatsLeft < 20 ? "red" : "black",
                                }}
                            >
                                {train.seatsLeft}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "20px" }}>
                <button onClick={handleBack}>이전</button>
                <button onClick={handleNext}>다음</button>
            </div>
        </div>
    );
};

export default TrainList;
