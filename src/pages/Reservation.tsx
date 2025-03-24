// Reservation.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const stations = [
    "서울",
    "광명",
    "수원",
    "천안아산",
    "오송",
    "대전",
    "마산",
    "밀양",
    "구포",
    "평창",
    "강릉",
    "전주",
    "목포",
    "청량리",
    "용산",
    "원주",
    "평택",
    "천안",
    "조치원",
    "서대전",
    "대구",
    "동해",
    "진부",
    "익산",
    "부산",
    "순천",
    "울산",
    "정동진",
];

const Reservation = () => {
    const [departure, setDeparture] = useState("서울");
    const [arrival, setArrival] = useState("부산");
    const [date, setDate] = useState<Date>(new Date());
    const [adultCount, setAdultCount] = useState(1);
    const [seniorCount, setSeniorCount] = useState(0);
    const [teenCount, setTeenCount] = useState(0);

    const navigate = useNavigate();

    const handleSearch = () => {
        console.log("조회 정보:", {
            departure,
            arrival,
            date,
            adultCount,
            seniorCount,
            teenCount,
        });
        navigate("/reservation/train-list");
    };

    const handleCountChange = (type: string, delta: number) => {
        if (type === "adult")
            setAdultCount((prev) => Math.max(0, prev + delta));
        if (type === "senior")
            setSeniorCount((prev) => Math.max(0, prev + delta));
        if (type === "teen") setTeenCount((prev) => Math.max(0, prev + delta));
    };

    return (
        <div>
            <h2>승차권 예매</h2>

            <div>
                <label>출발</label>
                <select
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                >
                    {stations.map((station) => (
                        <option key={station} value={station}>
                            {station}
                        </option>
                    ))}
                </select>

                <label>도착</label>
                <select
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                >
                    {stations.map((station) => (
                        <option key={station} value={station}>
                            {station}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h4>출발일 선택: {date.toLocaleDateString()}</h4>
                <Calendar
                    onChange={(value) => {
                        if (value instanceof Date) {
                            setDate(value);
                        }
                    }}
                    value={date}
                />
            </div>

            <div>
                <h4>인원 선택</h4>
                <div>
                    <span>성인 (만 19세 이상): </span>
                    <button onClick={() => handleCountChange("adult", -1)}>
                        -
                    </button>
                    <span>{adultCount}</span>
                    <button onClick={() => handleCountChange("adult", 1)}>
                        +
                    </button>
                </div>
                <div>
                    <span>노약자 (만 65세 이상): </span>
                    <button onClick={() => handleCountChange("senior", -1)}>
                        -
                    </button>
                    <span>{seniorCount}</span>
                    <button onClick={() => handleCountChange("senior", 1)}>
                        +
                    </button>
                </div>
                <div>
                    <span>청소년 (만 13~18세): </span>
                    <button onClick={() => handleCountChange("teen", -1)}>
                        -
                    </button>
                    <span>{teenCount}</span>
                    <button onClick={() => handleCountChange("teen", 1)}>
                        +
                    </button>
                </div>
            </div>

            <div>
                <button onClick={handleSearch}>조회</button>
            </div>
        </div>
    );
};

export default Reservation;
