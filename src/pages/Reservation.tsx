import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../styles/Button.module.css";
import styleb from "../styles/Box.module.css";
import "../styles/Reservation.css";

const stations = [
    "선택", "서울", "광명", "수원", "천안아산", "오송", "대전", "마산", "밀양", "구포",
    "평창", "강릉", "전주", "목포", "청량리", "용산", "원주", "평택", "천안", "조치원",
    "서대전", "대구", "동해", "진부", "익산", "부산", "순천", "울산", "정동진",
];

interface ReservationData {
    departure: string | null;
    arrival: string | null;
    date: Date | null;
    adultCount: number;
    seniorCount: number;
    teenCount: number;
}

const STORAGE_KEY = "reservationData";

const Reservation = () => {
    const navigate = useNavigate();

    const loadStoredData = () => {
        const storedData = sessionStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : null;
    };

    const [reservationData, setReservationData] = useState<ReservationData>(() => {
        return loadStoredData() || {
            departure: null,
            arrival: null,
            date: null,
            adultCount: 0,
            seniorCount: 0,
            teenCount: 0,
        };
    });

    const { departure, arrival, date, adultCount, seniorCount, teenCount } =
        reservationData;

    // 데이터 변경 시 세션 스토리지에 저장
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reservationData));
    }, [reservationData]);

    // 출발역, 도착역 변경
    const handleStationChange = (type: "departure" | "arrival", value: string) => {
        setReservationData((prev) => ({
            ...prev,
            [type]: value === "선택" ? null : value,
        }));
    };

    // 날짜 변경
    const handleDateChange = (value: Date | Date[] | null) => {
        setReservationData((prev) => ({
            ...prev,
            date: value instanceof Date ? value : value?.[0] || null,
        }));
    };

    // 인원 변경
    const handleCountChange = (type: "adultCount" | "seniorCount" | "teenCount", delta: number) => {
        setReservationData((prev) => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta),
        }));
    };

    // 조회 버튼 클릭 시
    const handleSearch = () => {
        if (!departure) return alert("출발역은 필수입니다.");
        if (!arrival) return alert("도착역은 필수입니다.");
        if (!date) return alert("날짜는 필수입니다.");
        if (adultCount + seniorCount + teenCount < 1) return alert("최소 1명 이상의 인원이 필요합니다.");

        console.log("조회 정보:", reservationData);

        navigate("/reservation/train-list", { state: reservationData });
    };

    return (
        <div className={styleb.box}>
            <title>Reservation</title>
            <h2 className="page-title">승차권 예매</h2>
            <hr className="page-title-bar"></hr>

            <div className="content-container">
                <div className="station-box">
                    <div className="station-selection">
                        <div className="depature-station">출발</div>
                        <select value={departure ?? "선택"} onChange={(e) => handleStationChange("departure", e.target.value)}>
                            {stations.map((station) => (
                                <option key={station} value={station}>
                                    {station}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="station-selection">
                        <div className="arrival-station">도착</div>
                        <select value={arrival ?? "선택"} onChange={(e) => handleStationChange("arrival", e.target.value)}>
                            {stations.map((station) => (
                                <option key={station} value={station}>
                                    {station}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div>
                    <h4>출발일 {date ? new Date(date).toLocaleDateString() : "날짜 선택 안됨"}</h4>
                    <Calendar
                        calendarType="gregory" 
                        onChange={(value) => handleDateChange(value as Date | Date[] | null)}
                        value={date ? new Date(date) : null}
                        selectRange={false}
                        tileClassName={({ date: tileDate }) =>
                            date && tileDate.toDateString() === new Date(date).toDateString() ? "selected-date" : ""
                        }
                    />
                </div>

                {/* 인원 선택 */}
                <div>
                    <h4>인원 선택</h4>
                    <div>
                        <div>성인 (만 19세 이상)</div>
                        <button onClick={() => handleCountChange("adultCount", -1)}>-</button>
                        <span>{adultCount}</span>
                        <button onClick={() => handleCountChange("adultCount", 1)}>+</button>
                    </div>
                    <div>
                        <div>노약자 (만 65세 이상)</div>
                        <button onClick={() => handleCountChange("seniorCount", -1)}>-</button>
                        <span>{seniorCount}</span>
                        <button onClick={() => handleCountChange("seniorCount", 1)}>+</button>
                    </div>
                    <div>
                        <div>청소년 (만 13~18세)</div>
                        <button onClick={() => handleCountChange("teenCount", -1)}>-</button>
                        <span>{teenCount}</span>
                        <button onClick={() => handleCountChange("teenCount", 1)}>+</button>
                    </div>
                </div>

                <div>
                    <button className={`${styles.button} look-up2`} onClick={handleSearch}>
                        조회
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Reservation;
