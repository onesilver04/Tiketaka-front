import React from "react";
import "../styles/History.css";
import "../styles/HistoryTicket.css";
import { Reservation } from "../types/reservation";

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
        departureTime,
        arrivalTime,
        departureDate,
        passengerCount,
        seat,
    } = reservation;

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

                <div className="ticket-info">
                    <div className="route-row">
                        <span className="label">출발</span>
                        <div className="station-block">
                            <span className="station">{departure}역</span>
                            <span>{departureTime}</span>
                        </div>
                        <span className="arrow">→</span>
                        <span className="label">도착</span>
                        <div className="station-block">
                            <span className="station">{arrival}역</span>
                            <span>{arrivalTime}</span>
                        </div>
                    </div>

                    <div className="details">
                        <p>출발일 {departureDate}</p>
                        <p>
                            예약자{" "}
                            {passengerCount.adult
                                ? `성인 ${passengerCount.adult}명`
                                : ""}
                            {passengerCount.senior
                                ? ` 노약자 ${passengerCount.senior}명`
                                : ""}
                            {passengerCount.youth
                                ? ` 청소년 ${passengerCount.youth}명`
                                : ""}
                        </p>
                        {seat && <p>예약좌석 {seat}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryTicket;
