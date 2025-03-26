import React, { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate, useLocation } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../styles/History.css";
import styleb from "../styles/Box.module.css";
import HistoryTicket from "./HistoryTicket";
import { Reservation } from "../types/reservation"; // 위에서 만든 타입 import

const sampleReservations: Reservation[] = [
    {
        reservationId: "RES12345",
        departure: "서울",
        arrival: "부산",
        departureDate: "2025-03-20",
        departureTime: "08:30",
        arrivalTime: "12:00",
        passengerCount: { adult: 1, senior: 0, youth: 0 },
        seat: "3호차 2A",
    },
    {
        reservationId: "RES67890",
        departure: "부산",
        arrival: "서울",
        departureDate: "2025-04-05",
        departureTime: "15:00",
        arrivalTime: "18:30",
        passengerCount: { adult: 2, senior: 0, youth: 1 },
        seat: "3호차 2B",
    },
];

const History = () => {
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || "고객";
    const maskedNumber = phoneNumber.slice(-4); // 뒷자리 4자리만 표시

    const [startDate, setStartDate] = useState<Date | null>(
        new Date("2024-12-13")
    );
    const [endDate, setEndDate] = useState<Date | null>(new Date("2025-03-13"));
    const [selectingDate, setSelectingDate] = useState<"start" | "end" | null>(
        null
    );
    const [selected, setSelected] = useState<string[]>([]);
    const navigate = useNavigate();

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "날짜 없음";
        return date.toISOString().split("T")[0];
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
            <h3 className="title">
                <span className="user-id">{maskedNumber}</span> 님의 예매 내역
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

            <div className="selection-header">
                <span>예매 내역</span>
                <label>
                    <input
                        type="checkbox"
                        checked={selected.length === sampleReservations.length}
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
                    전체 선택
                </label>
            </div>

            <div className="ticket-list">
                {sampleReservations.map((res) => (
                    <HistoryTicket
                        key={res.reservationId}
                        reservation={res}
                        isSelected={selected.includes(res.reservationId)}
                        onToggle={toggleSelect}
                    />
                ))}
            </div>

            <button className="refund-button" onClick={handleRefundClick}>
                선택항목 환불
            </button>
        </div>
    );
};

export default History;
