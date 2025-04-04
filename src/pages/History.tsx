import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate, useLocation } from "react-router-dom";
import { addHistoryLog } from "../utils/session";
import RefundModalDetail from "../components/RefundModalDetail";
import "react-calendar/dist/Calendar.css";
import "../styles/Reservation.css";
import "../styles/History.css";
import styleb from "../styles/Box.module.css";
import styles from "../styles/Button.module.css";
import HistoryTicket from "./HistoryTicket";
import HistoryNone from "./HistoryNone";
import { updateHistorySession } from "../utils/session";

export interface Reservation {
    reservationId: string;
    departure: string;
    arrival: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    passengerCount: {
        adult: number;
        senior: number;
        youth: number;
    };
    carriageNumber: string;
    seatNumbers: string[];
    trainInfo?: {
        price: number;
        departureTime: string;
        arrivalTime: string;
        trainId: string;
    };
}

const History = () => {
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || "고객";
    const maskedNumber = phoneNumber.slice(-4);

    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const [startDate, setStartDate] = useState<Date>(threeMonthsAgo);
    const [endDate, setEndDate] = useState<Date>(today);
    const [selectingDate, setSelectingDate] = useState<"start" | "end">(
        "start"
    );
    const [selected, setSelected] = useState<string[]>([]);
    const [filteredReservations, setFilteredReservations] = useState<
        Reservation[]
    >([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const sessionId = location.state?.sessionId;

    useEffect(() => {
        if (sessionId) {
            updateHistorySession({
                current_page: "history",
                previous_pages: ["phonenumber"],
            });
        }
    }, []);

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "날짜 없음";
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const handleSearch = () => {
        const matched: Reservation[] = [];

        // ✅ 로그 기록만 조건부
        if (sessionId) {
            addHistoryLog({
                sessionId,
                page: "history",
                event: "click",
                target_id: "history-search",
                tag: "button",
                text: "날짜 조회",
            });
        }

        // ✅ 이 아래는 로그와 관계없이 항상 실행되어야 함
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            try {
                const raw = localStorage.getItem(key);
                if (!raw) continue;

                const data = JSON.parse(raw);
                const items = Array.isArray(data) ? data : [data];

                items.forEach((item) => {
                    if (
                        item?.completed === true &&
                        item?.paymentInfo?.phoneNumber === phoneNumber
                    ) {
                        const depDate = new Date(
                            item.reservationData?.departureDate
                        );
                        if (depDate >= startDate && depDate <= endDate) {
                            const selectedSeatsObj = item.selectedSeats || {};
                            const seatNumbers: string[] = Object.values(
                                selectedSeatsObj
                            ).flat() as string[];
                            const carriageNumber =
                                Object.keys(selectedSeatsObj)[0] || "";

                            matched.push({
                                reservationId: item.id.toString(),
                                departure:
                                    item.reservationData.departureStation,
                                arrival:
                                    item.reservationData.destinationStation,
                                departureDate:
                                    item.reservationData.departureDate,
                                departureTime:
                                    item.trainInfo?.departureTime || "",
                                arrivalTime: item.trainInfo?.arrivalTime || "",
                                passengerCount: {
                                    adult: item.reservationData.adultCount || 0,
                                    senior:
                                        item.reservationData.seniorCount || 0,
                                    youth: 0,
                                },
                                carriageNumber,
                                seatNumbers,
                                trainInfo: item.trainInfo,
                            });
                        }
                    }
                });
            } catch {
                continue;
            }
        }

        // ✅ 로그 여부와 무관하게 결과 세팅
        setFilteredReservations(matched);
        setSelected([]);
        setHasSearched(true);
    };
    const handleRefundClick = () => {
        const selectedRes = filteredReservations.filter((res) =>
            selected.includes(res.reservationId)
        );

        if (selectedRes.length === 0) {
            alert("환불할 항목을 선택해주세요!");
            return;
        }

        setIsModalOpen(true);
    };

    const confirmRefund = () => {
        const keysToRemove: string[] = [];
        const keysToUpdate: { key: string; data: any[] }[] = [];
        const deleted: Reservation[] = [];

        selected.forEach((reservationId) => {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;

                try {
                    const raw = localStorage.getItem(key);
                    if (!raw) continue;

                    const data = JSON.parse(raw);
                    const items = Array.isArray(data) ? data : [data];

                    const updatedItems = items.filter(
                        (item: any) =>
                            item.id?.toString() !== reservationId.toString() &&
                            item.reservationId?.toString() !==
                                reservationId.toString()
                    );

                    if (Array.isArray(data)) {
                        if (updatedItems.length !== data.length) {
                            keysToUpdate.push({ key, data: updatedItems });
                        }
                    } else if (updatedItems.length === 0) {
                        keysToRemove.push(key);
                    }
                } catch {
                    continue;
                }
            }

            const res = filteredReservations.find(
                (r) => r.reservationId === reservationId
            );
            if (res) deleted.push(res);
        });

        keysToRemove.forEach((key) => localStorage.removeItem(key));
        keysToUpdate.forEach(({ key, data }) =>
            localStorage.setItem(key, JSON.stringify(data))
        );

        setIsModalOpen(false);
        setSelected([]);
        handleSearch();

        navigate("/history/refund-success", {
            state: { reservations: deleted },
        });
    };

    const cancelRefund = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <title>history</title>
            <div className={styleb.box}>
                <h3 className="page-title">
                    <span className="user-id">{maskedNumber}</span> 님의 예매
                    내역
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
                                    if (value > endDate) setEndDate(value);
                                } else {
                                    setEndDate(
                                        value < startDate ? startDate : value
                                    );
                                }
                            }
                        }}
                        value={selectingDate === "start" ? startDate : endDate}
                        selectRange={false}
                        minDate={
                            selectingDate === "start"
                                ? threeMonthsAgo
                                : undefined
                        }
                    />
                </div>

                <button
                    id="history-search"
                    className={`${styles.button} history-look-up`}
                    onClick={handleSearch}
                >
                    조회
                </button>

                <div className="history-ticket">
                    {hasSearched && filteredReservations.length === 0 ? (
                        <HistoryNone />
                    ) : (
                        <>
                            <div className="selection-header">
                                <p>예매 내역</p>
                                <label className="selection-header-right">
                                    <input
                                        className="checkbox"
                                        type="checkbox"
                                        checked={
                                            filteredReservations.length > 0 &&
                                            selected.length ===
                                                filteredReservations.length
                                        }
                                        onChange={(e) => {
                                            setSelected(
                                                e.target.checked
                                                    ? filteredReservations.map(
                                                          (r) => r.reservationId
                                                      )
                                                    : []
                                            );
                                        }}
                                    />
                                    전체 선택
                                </label>
                            </div>

                            <hr className="page-title-bar" />
                            <div className="ticket-list-containter">
                                <div className="ticket-list">
                                    {filteredReservations.map((res) => (
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

                                {filteredReservations.length > 0 && (
                                    <button
                                        id="history-refund"
                                        className={`${styles.button} history-refund`}
                                        onClick={handleRefundClick}
                                    >
                                        선택항목 환불
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {isModalOpen && (
                    <RefundModalDetail
                        onConfirm={confirmRefund}
                        onCancel={cancelRefund}
                    />
                )}
            </div>
        </div>
    );
};

export default History;
