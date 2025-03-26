import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RefundModalDetail from "../components/RefundModalDetail";
import { Reservation } from "../types/reservation";
// import "../styles/BookingDetail.css";

interface LocationState {
    reservations: Reservation[];
}

const BookingDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { reservations } = location.state as LocationState;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRefund = () => {
        setIsModalOpen(true);
    };

    const confirmRefund = () => {
        setIsModalOpen(false);
        navigate("/history/refund-success");
    };

    const cancelRefund = () => {
        setIsModalOpen(false);
    };

    const totalPassengers = reservations.reduce(
        (acc, cur) =>
            acc +
            cur.passengerCount.adult +
            cur.passengerCount.senior +
            cur.passengerCount.youth,
        0
    );

    const totalPrice = totalPassengers * 10000;

    return (
        <>
            <div className={`detail-box ${isModalOpen ? "blurred" : ""}`}>
                <h3>티켓 상세 내역</h3>

                {reservations.map((res) => (
                    <div key={res.reservationId} className="route-box">
                        <div className="route-detail">
                            <p>출발</p>
                            <h2>{res.departure}</h2>
                            <span>{res.departureTime}</span>
                        </div>
                        <div className="route-detail">
                            <p>도착</p>
                            <h2>{res.arrival}</h2>
                            <span>{res.arrivalTime}</span>
                        </div>
                    </div>
                ))}

                <div className="passenger-info">
                    <p>총 인원 수: {totalPassengers}명</p>
                    <p>
                        성인:{" "}
                        {reservations.reduce(
                            (acc, cur) => acc + cur.passengerCount.adult,
                            0
                        )}
                    </p>
                    <p>
                        노약자:{" "}
                        {reservations.reduce(
                            (acc, cur) => acc + cur.passengerCount.senior,
                            0
                        )}
                    </p>
                    <p>
                        어린이:{" "}
                        {reservations.reduce(
                            (acc, cur) => acc + cur.passengerCount.youth,
                            0
                        )}
                    </p>
                </div>

                <hr />

                <div className="price-info">
                    <strong>총액: {totalPrice.toLocaleString()}원</strong>
                </div>

                <div className="card-info">
                    <p>카드 정보</p>
                    <p className="card-number">1111 2222 3333 ****</p>
                </div>

                <button className="refund-button" onClick={handleRefund}>
                    환불하기
                </button>
            </div>

            {isModalOpen && (
                <RefundModalDetail
                    onConfirm={confirmRefund}
                    onCancel={cancelRefund}
                />
            )}
        </>
    );
};

export default BookingDetail;
