import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Reservation } from "./History";
import "../styles/BookingDetail.css";
import styles from "../styles/Button.module.css";
import styleb from "../styles/Box.module.css";
import RefundModal from "../components/RefundModal";

interface LocationState {
    reservations: Reservation[];
}

const BookingDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { reservations } = location.state as LocationState;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState<string | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const handleRefund = () => {
        setIsModalOpen(true);
    };

    const confirmRefund = () => {
        reservations.forEach((res) => {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;

                try {
                    const raw = localStorage.getItem(key);
                    if (!raw) continue;

                    const data = JSON.parse(raw);

                    // 배열인 경우: 해당 예약만 제거해서 다시 저장
                    if (Array.isArray(data)) {
                        const updated = data.filter(
                            (item) =>
                                item.id !== res.reservationId &&
                                item.reservationId !== res.reservationId
                        );

                        if (updated.length !== data.length) {
                            localStorage.setItem(key, JSON.stringify(updated));
                        }
                    }

                    // 객체인 경우: 예약 ID가 일치하면 해당 key 통째로 제거
                    else if (
                        data.id === res.reservationId ||
                        data.reservationId === res.reservationId
                    ) {
                        localStorage.removeItem(key);
                    }
                } catch {
                    continue;
                }
            }
        });

        setIsModalOpen(false);
        navigate("/history/refund-success");
    };

    const cancelRefund = () => {
        setIsModalOpen(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const totalPassengers = reservations.reduce(
        (acc, cur) =>
            acc +
            cur.passengerCount.adult +
            cur.passengerCount.senior +
            cur.passengerCount.youth,
        0
    );

    // 카드 번호와 가격 계산
    useEffect(() => {
        let priceSum = 0;
        let foundCard: string | null = null;

        reservations.forEach((res) => {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;

                try {
                    const raw = localStorage.getItem(key);
                    if (!raw) continue;

                    const data = JSON.parse(raw);
                    const items = Array.isArray(data) ? data : [data];

                    items.forEach((item) => {
                        const isMatched =
                            item.id?.toString() === res.reservationId ||
                            item.reservationId?.toString() ===
                                res.reservationId;

                        if (isMatched) {
                            // ✅ 가격 계산
                            const count =
                                res.passengerCount.adult +
                                res.passengerCount.senior +
                                res.passengerCount.youth;

                            const pricePerPerson = item.trainInfo?.price ?? 0;
                            priceSum += pricePerPerson * count;

                            // ✅ 카드 정보 저장
                            if (!foundCard && item.paymentInfo?.cardNumber) {
                                foundCard = item.paymentInfo.cardNumber;
                            }
                        }
                    });
                } catch {}
            }
        });

        setTotalPrice(priceSum);
        setCardNumber(foundCard); // ✅ 여기서 세팅됨!
    }, [reservations]);

    return (
        <>
            <div
                className={`${styleb.box} detail-box ${
                    isModalOpen ? "blurred" : ""
                }`}
            >
                <h3 className="page-title">티켓 상세 내역</h3>
                <hr className="page-title-bar" />

                {reservations.map((res) => (
                    <div key={res.reservationId} className="route-box">
                        <div className="route-detail">
                            <p>출발</p>
                            <p className="booking-detail-station">
                                {res.departure}역
                            </p>
                            <span>{res.departureTime}</span>
                        </div>
                        <span className="arrow">→</span>
                        <div className="route-detail">
                            <p>도착</p>
                            <p className="booking-detail-station">
                                {res.arrival}역
                            </p>
                            <span>{res.arrivalTime}</span>
                        </div>
                    </div>
                ))}

                <div className="passenger-info">
                    <p>
                        <strong>총 인원 수: {totalPassengers}명</strong>
                    </p>
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

                <hr className="page-title-bar" />

                <div className="price-info">
                    <strong>총액: {totalPrice.toLocaleString()}원</strong>
                </div>

                <p className="title-card-info">카드 정보</p>
                <hr className="page-title-bar" />
                <div className="card-number">
                    <p>카드 번호</p>
                    <p className="card-number-info">
                        <strong>
                            {cardNumber
                                ? cardNumber.replace(/\d{4}$/, "****")
                                : "정보 없음"}
                        </strong>
                    </p>
                </div>
            </div>

            <button
                id="detail-to-history"
                className={`${styles.button} detail-to-history`}
                onClick={handleBack}
            >
                이전
            </button>
            <button
                id="detail-to-refund"
                className={`${styles.button} detail-to-refund`}
                onClick={handleRefund}
            >
                환불하기
            </button>

            {isModalOpen && (
                <RefundModal
                    onConfirm={confirmRefund}
                    onCancel={cancelRefund}
                />
            )}
        </>
    );
};

export default BookingDetail;
