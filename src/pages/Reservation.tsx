//Reservation.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styleb from "../styles/Box.module.css";
import "../styles/Reservation.css";
import StationSelector from "./StationSelector";
import styles from "../styles/Button.module.css";
import { updateCurrentSession } from "../utils/session";

const stations = [
    "선택",
    "서울",
    "광명",
    "수원",
    "천안",
    "오송",
    "대전",
    "마산",
    "밀양",
    "구포",
    "평창",
    "강릉",
    "전주",
    "목포",
    "여수",
    "용산",
    "원주",
    "평택",
    "천안",
    "서산",
    "순천",
    "대구",
    "동해",
    "진부",
    "익산",
    "부산",
    "순천",
    "울산",
    "창원",
];

interface ReservationData {
    departureStation: string | null;
    destinationStation: string | null;
    departureDate: Date | null;
    adultCount: number;
    seniorCount: number;
    teenCount: number;
}

const STORAGE_KEY = "reservationData";

const Reservation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const shouldReset = location.state?.reset === true;
        if (shouldReset) {
            localStorage.removeItem(STORAGE_KEY);
            setReservationData({
                departureStation: null,
                destinationStation: null,
                departureDate: null,
                adultCount: 0,
                seniorCount: 0,
                teenCount: 0,
            });
        }
    }, []);

    const loadStoredData = () => {
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : null;
    };

    const [reservationData, setReservationData] = useState<ReservationData>(
        () => {
            const stored = loadStoredData();
            return {
                departureStation: stored?.departureStation || null,
                destinationStation: stored?.destinationStation || null,
                departureDate: stored?.departureDate
                    ? new Date(stored.departureDate)
                    : null,
                adultCount: stored?.adultCount ?? 0,
                seniorCount: stored?.seniorCount ?? 0,
                teenCount: stored?.teenCount ?? 0,
                //reservationData에서 인원 수 값(adultCount, seniorCount, teenCount)이 undefined 또는 null로 시작되어 + delta를 할 때 NaN 또는 오류가 발생
                //?? 0을 사용하면 undefined나 null일 경우에도 0으로 초기화되기 때문에 NaN이 발생하지 않음
            };
        }
    );

    const {
        departureStation,
        destinationStation,
        departureDate,
        adultCount,
        seniorCount,
        teenCount,
    } = reservationData;
    const [showStationSelector, setShowStationSelector] = useState<
        "departure" | "arrival" | null
    >(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reservationData));
    }, [reservationData]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowStationSelector(null);
            }
        };
        if (showStationSelector) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showStationSelector]);

    const handleStationChange = (
        type: "departure" | "arrival",
        value: string
    ) => {
        setReservationData((prev) => ({
            ...prev,
            [type === "departure" ? "departureStation" : "destinationStation"]:
                value,
        }));
    };

    const handleDateChange = (value: Date | Date[] | null) => {
        setReservationData((prev) => ({
            ...prev,
            departureDate: value instanceof Date ? value : value?.[0] || null,
        }));
    };

    const handleCountChange = (
        type: "adultCount" | "seniorCount" | "teenCount",
        delta: number
    ) => {
        setReservationData((prev) => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta),
        }));
    };

    const handleSearch = () => {
        if (!departureStation) return alert("출발역은 필수입니다.");
        if (!destinationStation) return alert("도착역은 필수입니다.");
        if (!departureDate) return alert("날짜는 필수입니다.");
        if (departureStation === destinationStation)
            return alert("출발역과 도착역은 서로 달라야 합니다.");
        if (adultCount + seniorCount + teenCount < 1)
            return alert("최소 1명 이상의 인원이 필요합니다.");

        // 세션 업데이트
        updateCurrentSession({ reservationData });

        // 다음 페이지로 예약 데이터 넘기기
        navigate("/reservation/train-list", {
            state: reservationData,
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <div className={styleb.box} style={{ position: "relative" }}>
                <title>Reservation</title>
                <h2 className="page-title">승차권 예매</h2>
                <hr className="page-title-bar" />

                <div className="content-container">
                    <div className="station-box">
                        <div className="station-selection">
                            <div className="depature-station">출발</div>
                            <button
                                onClick={() =>
                                    setShowStationSelector(
                                        showStationSelector === "departure"
                                            ? null
                                            : "departure"
                                    )
                                }
                                className="station-select-button"
                                id="select-departure-station"
                            >
                                {departureStation ?? "출발역"}
                                <img
                                    src="src/assets/down-arrow.svg"
                                    alt="화살표"
                                    className="dropdown-arrow-icon"
                                />
                            </button>
                        </div>
                        
                        <div className="station-selection-arrow">→</div>

                        <div className="station-selection">
                            <div className="arrival-station">도착</div>
                            <button
                                onClick={() =>
                                    setShowStationSelector(
                                        showStationSelector === "arrival"
                                            ? null
                                            : "arrival"
                                    )
                                }
                                className="station-select-button"
                                id="select-arrival-station"
                            >
                                {destinationStation ?? "도착역"}
                                <img
                                    src="src/assets/down-arrow.svg"
                                    alt="화살표"
                                    className="dropdown-arrow-icon"
                                />
                            </button>
                        </div>
                    </div>

                    {showStationSelector && (
                        <div
                            ref={dropdownRef}
                            style={{
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 1000,
                                backgroundColor: "white",
                                borderRadius: "16px",
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            <StationSelector
                                stations={stations.slice(1)}
                                onSelect={(station) => {
                                    handleStationChange(
                                        showStationSelector,
                                        station
                                    );
                                    setShowStationSelector(null);
                                }}
                            />
                        </div>
                    )}

                    <div>
                        <h4 className="reservation-detail-select">
                            <p className="reservation-detail-select-inform">출발일</p>
                            {departureDate
                                ? new Date(departureDate).toLocaleDateString()
                                : "날짜를 선택해주세요."}
                        </h4>
                        <div id="calendar-wrapper">
                            <Calendar
                                calendarType="gregory"
                                onChange={(value) =>
                                    handleDateChange(value as Date | Date[] | null)
                                }
                                value={
                                    departureDate ? new Date(departureDate) : null
                                }
                                selectRange={false}
                                minDate={new Date()} // 지나간 날 막기
                                tileClassName={({ date: tileDate }) =>
                                    departureDate &&
                                    tileDate.toDateString() ===
                                        new Date(departureDate).toDateString()
                                        ? "selected-date"
                                        : ""
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <h4 className="reservation-detail-select">
                            <p className="reservation-detail-select-inform">인원 선택</p>
                            <span>
                                성인 {adultCount}명, 노약자 {seniorCount}명,
                                청소년 {teenCount}명
                            </span>
                        </h4>
                        <div className="select-people-number">
                            <div>
                                <div className="select-people-number-button">
                                    성인<br></br>(만 19세 이상)
                                </div>
                                <div className="select-people-number-button">
                                    <button
                                        onClick={() =>
                                            handleCountChange("adultCount", -1)
                                        }
                                        id="decrease-adult"
                                    >
                                        -
                                    </button>
                                    <span>{adultCount}</span>
                                    <button
                                        onClick={() =>
                                            handleCountChange("adultCount", 1)
                                        }
                                        id="increase-adult"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div className="select-people-number-button">
                                    노약자<br></br>(만 65세 이상)
                                </div>
                                <div className="select-people-number-button">
                                    <button
                                        onClick={() =>
                                            handleCountChange("seniorCount", -1)
                                        }
                                        id="decrease-senior"
                                    >
                                        -
                                    </button>
                                    <span>{seniorCount}</span>
                                    <button
                                        onClick={() =>
                                            handleCountChange("seniorCount", 1)
                                        }
                                        id="increase-senior"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div className="select-people-number-button">
                                    청소년<br></br>(만 13~18세)
                                </div>
                                <div className="select-people-number-button">
                                    <button
                                        onClick={() =>
                                            handleCountChange("teenCount", -1)
                                        }
                                        id="decrease-teen"
                                    >
                                        -
                                    </button>
                                    <span>{teenCount}</span>
                                    <button
                                        onClick={() =>
                                            handleCountChange("teenCount", 1)
                                        }
                                        id="increase-teen"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="display-button">
                <button
                    className={`${styles.button} reservation-back`}
                    id="reservation-to-home"
                    onClick={handleBack}
                >
                    이전
                </button>
                <button
                    className={`${styles.button} reservation-search`}
                    id="reservation-to=trainlist"
                    onClick={handleSearch}
                >
                    조회
                </button>
            </div>
        </div>
    );
};

export default Reservation;
