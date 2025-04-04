import React from "react";
import { useNavigate } from "react-router-dom";
import { addHistoryLog } from "../utils/session";
import "../styles/History.css";
import "../styles/HistoryTicket.css";
import { Reservation } from "../pages/History";

interface HistoryTicketProps {
    reservation: Reservation;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

const HistoryTicket: React.FC<HistoryTicketProps> = ({
    reservation,
    isSelected,
    onToggle,
}) => {
    const {
        reservationId,
        departure,
        arrival,
        departureDate,
        departureTime,
        arrivalTime,
        passengerCount,
        carriageNumber,
        seatNumbers,
    } = reservation;

    const navigate = useNavigate();

    const handleTicketClick = () => {
        const session = JSON.parse(
            localStorage.getItem("currentHistorySession") || "{}"
        );
        const sessionId = session?.sessionId;

        if (sessionId) {
            addHistoryLog({
                sessionId,
                page: "History",
                event: "navigate", // click??? 예인언니한테 물어보기
                target_id: "ticket-info", //`ticket-${reservationId}`,
                tag: "div",
                text: `${departure} to ${arrival} booking-detail 페이지로 이동`,
                url: window.location.href,
            });
        }

        navigate("/history/booking-detail", {
            state: {
                reservations: [
                    {
                        ...reservation,
                        trainInfo: reservation.trainInfo,
                    },
                ],
            },
        });
    };

    return (
        <div className={`ticket-container ${isSelected ? "selected" : ""}`}>
            <input
                className="history-ticket-checkbox"
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(reservationId)}
            />

            <div className="ticket-content">
                <div className="ticket-left-bar"></div>

                <div
                    id="ticket-info"
                    className="ticket-info"
                    onClick={handleTicketClick}
                    style={{ cursor: "pointer" }}
                >
                    <div className="route-row">
                        <span className="start-label">출발</span>
                        <div className="station-block">
                            <span className="station">{departure}역</span>
                            <span>{departureTime.split("T")[0]}</span>
                        </div>
                        <span className="arrow">→</span>
                        <span className="arrive-label">도착</span>
                        <div className="station-block">
                            <span className="station">{arrival}역</span>
                            <span>{arrivalTime}</span>
                        </div>
                    </div>

                    <div className="details">
                        <div className="detail-item">
                            <span className="label">출발일</span>
                            <span className="value">{departureDate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">예약자</span>
                            <span className="value">
                                {passengerCount.adult
                                    ? `성인 ${passengerCount.adult}명`
                                    : ""}
                                {passengerCount.senior
                                    ? ` 노약자 ${passengerCount.senior}명`
                                    : ""}
                                {passengerCount.youth
                                    ? ` 청소년 ${passengerCount.youth}명`
                                    : ""}
                            </span>
                        </div>
                        {seatNumbers.length > 0 && (
                            <div className="detail-item">
                                <span className="label">예약좌석</span>
                                <span className="value">
                                    {carriageNumber}호차{" "}
                                    {seatNumbers.join(", ")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryTicket;
