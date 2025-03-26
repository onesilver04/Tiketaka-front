import React, { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate, useLocation } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styleb from "../styles/Box.module.css";
import "../styles/History.css";
import styles from "../styles/Button.module.css";

const HistoryNone = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || "고객";

    const [startDate, setStartDate] = useState<Date | null>(
        new Date("2024-12-13")
    );
    const [endDate, setEndDate] = useState<Date | null>(new Date("2025-03-13"));
    const [selectingDate, setSelectingDate] = useState<"start" | "end" | null>(
        null
    );

    const formatDate = (date: Date | null) => {
        if (!date) return "날짜 없음";
        return date.toISOString().split("T")[0];
    };

    return (
        <div className={styleb.box}>
            <h3 className="title">
                <span className="user-id">{phoneNumber.slice(-4)}</span> 님의
                예매 내역
            </h3>

            <div className="date-section">
                <span>조회 기간</span>
                <span className="period">
                    <span
                        className="clickable"
                        onClick={() => setSelectingDate("start")}
                    >
                        {formatDate(startDate)}
                    </span>{" "}
                    ~{" "}
                    <span
                        className="clickable"
                        onClick={() => setSelectingDate("end")}
                    >
                        {formatDate(endDate)}
                    </span>
                </span>
            </div>

            {selectingDate && (
                <div className="calendar-wrapper">
                    <Calendar
                        onChange={(value) => {
                            if (value instanceof Date) {
                                if (selectingDate === "start")
                                    setStartDate(value);
                                else setEndDate(value);
                                setSelectingDate(null);
                            }
                        }}
                        value={selectingDate === "start" ? startDate : endDate}
                    />
                    <button
                        className="calendar-close"
                        onClick={() => setSelectingDate(null)}
                    >
                        닫기
                    </button>
                </div>
            )}

            <div className="no-reservation-section">
                <img src="/src/assets/failed-button.svg" alt="no-reservation" />
                <p>
                    해당 조회기간에는
                    <br />
                    예매 내역이 없습니다.
                </p>
            </div>
            <button className={styles.button} onClick={() => navigate("/")}>
                메인 화면으로
            </button>
        </div>
    );
};

export default HistoryNone;
