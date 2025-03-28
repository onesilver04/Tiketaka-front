import React, { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate, useLocation } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../styles/Reservation.css";
import "../styles/History.css";
import styleb from "../styles/Box.module.css";
import styles from "../styles/Button.module.css";
import HistoryTicket from "./HistoryTicket";
import { Reservation } from "../types/reservation";

const sampleReservations: Reservation[] = [
    {
        reservationId: "RES12345",
        departure: "서울",
        arrival: "부산",
        departureDate: "2025-03-11",
        departureTime: "06:10",
        arrivalTime: "08:20",
        passengerCount: { adult: 1, senior: 0, youth: 0 },
        seat: "3호차 2A",
    },
    {
        reservationId: "RES67890",
        departure: "서울",
        arrival: "부산",
        departureDate: "2025-03-11",
        departureTime: "06:10",
        arrivalTime: "08:20",
        passengerCount: { adult: 0, senior: 1, youth: 0 },
        seat: "3호차 2B",
    },
];

const History = () => {
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || "고객";
    const maskedNumber = phoneNumber.slice(-4);

    const [startDate, setStartDate] = useState<Date>(new Date("2024-12-13"));
    const [endDate, setEndDate] = useState<Date>(new Date("2025-03-13"));
    const [selectingDate, setSelectingDate] = useState<"start" | "end">(
        "start"
    );
    const [selected, setSelected] = useState<string[]>([]);
    const navigate = useNavigate();

    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "날짜 없음";
        // 날짜 변환 형식 YYYY-MM-DD
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const handleRefundClick = () => {
        const selectedReservations = sampleReservations.filter((res) =>
            selected.includes(res.reservationId)
        );

        if (selectedReservations.length === 0) {
            alert("환불할 항목을 선택해주세요!");
            return;
        }

        navigate("/history/booking-detail", {
            state: { reservations: selectedReservations },
        });
    };

    return (
        <div className={styleb.box}>
            <h3 className="page-title">
                <span className="user-id">{maskedNumber}</span> 님의 예매 내역
            </h3>
            <hr className="page-title-bar" />

            <div className="date-section">
                <span>조회 기간</span>
                <span className="period">
                    <span
                        className={`clickable ${
                            selectingDate === "start" ? "active" : ""
                        }`}
                        onClick={() => setSelectingDate("start")}
                    >
                        {formatDate(startDate)}
                    </span>{" "}
                    ~{" "}
                    <span
                        className={`clickable ${
                            selectingDate === "end" ? "active" : ""
                        }`}
                        onClick={() => setSelectingDate("end")}
                    >
                        {formatDate(endDate)}
                    </span>
                </span>
            </div>

            <div className="calendar-wrapper">
                <Calendar
                    onChange={(value) => {
                        if (value instanceof Date) {
                            if (selectingDate === "start") {
                                setStartDate(value);
                                // 시작일이 종료일보다 늦을 경우
                                if (value > endDate) {
                                    setEndDate(value);
                                }
                            } else {
                                const newEnd =
                                    value < startDate ? startDate : value;
                                setEndDate(newEnd);
                            }
                        }
                    }}
                    value={selectingDate === "start" ? startDate : endDate}
                    selectRange={false}
                    minDate={
                        selectingDate === "start" ? threeMonthsAgo : undefined
                    }
                />
            </div>

            <button className={`${styles.button} history-look-up`}>조회</button>
            <div className="history-ticket">
                <div className="selection-header">
                    <p>예매 내역</p>
                    <label className="selection-header-right">
                        <input
                            className="checkbox"
                            type="checkbox"
                            checked={
                                selected.length === sampleReservations.length
                            }
                            onChange={(e) => {
                                setSelected(
                                    e.target.checked
                                        ? sampleReservations.map(
                                              (r) => r.reservationId
                                          )
                                        : []
                                );
                            }}
                        />
                        <p>전체 선택</p>
                    </label>
                </div>

                <hr className="page-title-bar" />
                <div className="ticket-list-containter">
                    <div className="ticket-list">
                        {sampleReservations.map((res) => (
                            <HistoryTicket
                                key={res.reservationId}
                                reservation={res}
                                isSelected={selected.includes(
                                    res.reservationId
                                )}
                                onToggle={toggleSelect}
                            />
                        ))}
                    </div>

                    <button
                        className={`${styles.button} history-refund`}
                        onClick={handleRefundClick}
                    >
                        선택항목 환불
                    </button>
                </div>
            </div>
        </div>
    );
};

export default History;
