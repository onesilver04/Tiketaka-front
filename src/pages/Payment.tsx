// Payment.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Payment.css";
import styleb from "../styles/Box.module.css";
import styles from "../styles/Button.module.css";
import { updateCurrentSession } from "../utils/session";
import AddCard from '../assets/add-card-img.svg';

interface Card {
    cardNumber: string;
    cardCompany: string;
    id: number;
    last4Digits: string;
    expirationDate: string;
}

interface ReservationData {
    departureStation: string | null;
    destinationStation: string | null;
    departureDate: Date | null;
    adultCount: number;
    seniorCount: number;
    teenCount: number;
}

interface TrainInfo {
    trainId: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
}

const Payment: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { reservationData, trainInfo } = location.state as {
        reservationData: ReservationData;
        trainInfo: TrainInfo;
    };

    const [phoneNumber, setPhoneNumber] = useState("");
    const [cards, setCards] = useState<Card[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [agree, setAgree] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [phoneConfirmed, setPhoneConfirmed] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 11);
        if (digits.length <= 3) return digits;
        if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    };

    const isValidPhone = /^010-\d{4}-\d{4}$/.test(phoneNumber);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(formatPhone(e.target.value));
        setPhoneConfirmed(false);
    };

    const fetchCards = () => {
        if (!isValidPhone) return alert("올바른 전화번호 형식을 입력해주세요.");
    
        setPhoneConfirmed(true);
        if (phoneNumber.replace(/-/g, "") === "01012345678") {
            setCards([
                {
                    id: 1,
                    last4Digits: "4444",
                    cardCompany: "Shinhan",
                    cardNumber: "1111-2222-3333-4444",
                    expirationDate: "03/27",
                },
                {
                    id: 2,
                    last4Digits: "5678",
                    cardCompany: "KB국민",
                    cardNumber: "5555-6666-7777-5678",
                    expirationDate: "05/29",
                },
            ]);
        } else {
            setCards([]);
        }
    };
    

    const handleNext = () => {
        if (cards.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % (cards.length + 1));
        }
    };

    const handlePrev = () => {
        if (cards.length > 0) {
        setCurrentIndex((prev) => (prev - 1 + (cards.length + 1)) % (cards.length + 1));
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleEnd = () => {
        if (!agree) return alert("개인정보에 동의해주세요.");
        if (!isValidPhone) return alert("올바른 전화번호를 입력해주세요.");
        if (!phoneConfirmed) return alert("전화번호 확인을 해주세요.");
        if (!isCardSelected) return alert("결제 수단을 선택해주세요.");

        const selectedCard = cards[selectedCardIndex];

        updateCurrentSession({
        paymentInfo: {
            phoneNumber: phoneNumber.replace(/-/g, ""),
            paymentMethod,
            cardNumber: selectedCard
            ? selectedCard.cardNumber.replace(/(\d{4})-(\d{4})-(\d{4})-(\d{4})/, "$1-****-****-$4")
            : null,
        },
        });

        alert("결제가 완료되었습니다.");
        navigate("/reservation/payment/end");
    };

    const isCardSelected =
        paymentMethod !== "" || (cards.length > 0 && currentIndex < cards.length);

    const formattedDate = reservationData.departureDate
        ? new Date(reservationData.departureDate).toLocaleDateString()
        : "선택 안됨";

    const totalPassengers =
        reservationData.adultCount +
        reservationData.seniorCount +
        reservationData.teenCount;

    const totalPrice = trainInfo.price * totalPassengers;

    return (
        <div>
        <title>Payment</title>
        <div className={styleb.box}>
            <h2 className="page-title">결제창</h2>
            <hr className="page-title-bar" />

            <div className="content-container">
            <div className="trip-info">
                <div className="selected-station-inform">
                    <div>
                        <div>출발</div>
                        <div>{reservationData.departureStation}</div>
                        <div>{trainInfo.departureTime}</div>
                    </div>
                    <div>
                        →
                    </div>
                    <div>
                        <div>도착</div>
                        <div>{reservationData.destinationStation}</div>
                        <div>{trainInfo.arrivalTime}</div>
                    </div>
                </div>
                <div>
                    <div>날짜</div>
                    <div>{formattedDate}</div>
                </div>
                <div>
                    <div><span>총 인원 수: </span><span>{totalPassengers.toLocaleString()}명</span></div>
                    <div><span>성인: </span><span>{reservationData.adultCount}명</span></div>
                    <div><span>노약자: </span><span>{reservationData.seniorCount}명</span></div>
                    <div><span>청소년: </span><span>{reservationData.teenCount}명</span></div>
                </div>
                <hr></hr>
                <p>지불하실 금액: {totalPrice.toLocaleString()}원</p>
            </div>

            <div>
                <label>개인정보 동의</label>
                <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
            </div>

            <div>
                <div>전화번호 입력</div>
                <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="전화번호를 입력해주세요."
                />
                <button onClick={fetchCards} disabled={!isValidPhone}>
                확인
                </button>
            </div>

            <div className="payment-method">
                <button
                className={paymentMethod === "credit" ? "active" : ""}
                onClick={() => setPaymentMethod("credit")}
                >
                신용카드
                </button>
                <button
                className={paymentMethod === "kakao" ? "active" : ""}
                onClick={() => setPaymentMethod("kakao")}
                >
                카카오페이
                </button>
                <button
                className={paymentMethod === "mobile" ? "active" : ""}
                onClick={() => setPaymentMethod("mobile")}
                >
                휴대폰 결제
                </button>
            </div>

            <div className="card-slider">
                <button onClick={handlePrev}>&lt;</button>
                {cards.length > 0 && currentIndex < cards.length ? (
                <div
                    className={`card-box ${
                    paymentMethod === "existing" && currentIndex === selectedCardIndex
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                    setPaymentMethod("existing");
                    setSelectedCardIndex(currentIndex);
                    }}
                >
                    <img
                    src={AddCard}
                    alt="카드 이미지"
                    className="card-img"
                    />
                    <div>등록된 카드 {cards[currentIndex].last4Digits}</div>
                </div>
                ) : (
                <div
                    className="card-box add-card"
                    onClick={() => navigate("/reservation/payment/addcard")}
                >
                    +
                </div>
                )}
                <button onClick={handleNext}>&gt;</button>
            </div>
            </div>
        </div>

        <div className="display-button">
            <button className={`${styles.button} payment-back`} onClick={handleBack}>
            이전
            </button>
            <button
            className={`${styles.button} payment-next`}
            onClick={handleEnd}
            >
            다음
            </button>
        </div>
        </div>
    );
};

export default Payment;
