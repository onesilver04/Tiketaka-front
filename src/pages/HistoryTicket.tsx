import React from "react";
import "../styles/History.css";
import styleb from "../styles/Box.module.css";
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
        <div className={styleb.box}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(reservationId)}
            />
            <div className="ticket-info">
                <div className="route">
                    <strong>출발</strong> {departure} → <strong>도착</strong>{" "}
                    {arrival}
                </div>
                <div className="times">
                    {departureTime} → {arrivalTime}
                </div>
                <div className="details">
                    <p>출발일: {departureDate}</p>
                    <p>성인: {passengerCount.adult}</p>
                    <p>노약자: {passengerCount.senior}</p>
                    <p>어린이: {passengerCount.youth}</p>
                    {seat && <p>좌석: {seat}</p>}
                </div>
            </div>
        </div>
    );
};

export default HistoryTicket;
