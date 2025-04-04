// ✅ Payment.tsx — 카드 필터링, 뒤로가기 경로 수정, 상태 유지 보완, 마스킹 문제 해결 + SelectSeat에서 예약 정보 유지되도록 보완
import React, { useEffect, useState } from "react";
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
    ownerPhone?: string;
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
    const state = location.state as {
        reservationData?: ReservationData;
        trainInfo?: TrainInfo;
        phoneNumber?: string;
        phoneConfirmed?: boolean;
        agree?: boolean;
        fromAddCard?: boolean;
    } | undefined;

    const reservationData = state?.reservationData;
    const trainInfo = state?.trainInfo;

    const [phoneNumber, setPhoneNumber] = useState(() => state?.phoneNumber || localStorage.getItem("verifiedPhoneNumber") || "");
    const [cards, setCards] = useState<Card[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [agree, setAgree] = useState(() => state?.agree || false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [phoneConfirmed, setPhoneConfirmed] = useState(() => state?.phoneConfirmed || false);
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

        const formatted = phoneNumber.replace(/-/g, "");
        localStorage.setItem("verifiedPhoneNumber", phoneNumber);
        setPhoneConfirmed(true);

        const savedCards = JSON.parse(localStorage.getItem("customCards") || "[]");
        const filtered = savedCards.filter((card: Card) => card.ownerPhone === formatted);
        setCards(filtered);
    };

    useEffect(() => {
        const storedPhone = localStorage.getItem("verifiedPhoneNumber");
        if (storedPhone) {
            setPhoneNumber(storedPhone);
            setPhoneConfirmed(true);
        }
    }, []);

    useEffect(() => {
        if (state?.fromAddCard) {
            const savedCards = JSON.parse(localStorage.getItem("customCards") || "[]");
            const storedPhone = localStorage.getItem("verifiedPhoneNumber")?.replace(/-/g, "");
            const filtered = savedCards.filter((card: Card) => card.ownerPhone === storedPhone);
            setCards(filtered);
        }
    }, [state]);

    useEffect(() => {
        if (state?.fromAddCard && cards.length > 0) {
            setCurrentIndex(cards.length - 1);
            setSelectedCardIndex(cards.length - 1);
            setPaymentMethod("existing");
        }
    }, [cards, state]);

    useEffect(() => {
        const currentSession = JSON.parse(localStorage.getItem("reservationSession") || "{}");
        const currentSessionId = currentSession?.id;
        const lastSessionId = localStorage.getItem("lastPaymentSessionId");
    
        // 새로운 세션이면 전화번호 초기화
        if (currentSessionId && currentSessionId !== lastSessionId) {
            localStorage.removeItem("verifiedPhoneNumber");
            localStorage.setItem("lastPaymentSessionId", currentSessionId);
            setPhoneNumber("");
            setPhoneConfirmed(false);
        }
    }, []);

    const handleNext = () => {
        if (cards.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % (cards.length + 1));
        }
    };

    const handlePrev = () => {
        localStorage.removeItem("verifiedPhoneNumber");
        if (cards.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + (cards.length + 1)) % (cards.length + 1));
        }
    };

    const handleBack = () => {
        localStorage.removeItem("verifiedPhoneNumber");
        navigate("/reservation/select-seat", {
            state: {
                reservationData,
                trainInfo
            }
        });
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
                    ? selectedCard.cardNumber
                    : null,
            },
        });

        alert("결제가 완료되었습니다.");
        navigate("/reservation/payment/end");
    };

    const navigateToAddCard = () => {
        if (!agree) return alert("개인정보에 동의해 주세요.");
        if (!phoneConfirmed) return alert("카드를 등록하려면 전화번호를 먼저 확인해주세요.");
        navigate("/reservation/payment/addcard", {
            state: {
                phoneNumber,
                phoneConfirmed: true,
                agree,
                reservationData,
                trainInfo,
                fromAddCard: true
            }
        });
    };

    const isCardSelected = paymentMethod !== "" || (cards.length > 0 && currentIndex < cards.length);

    const formattedDate = reservationData?.departureDate
        ? new Date(reservationData.departureDate).toLocaleDateString()
        : "선택 안됨";

    const totalPassengers = (reservationData?.adultCount ?? 0)
        + (reservationData?.seniorCount ?? 0)
        + (reservationData?.teenCount ?? 0);

    const totalPrice = (trainInfo?.price ?? 0) * totalPassengers;

    return (
        <div>
            <div className={styleb.box}>
                <h2 className="page-title">결제창</h2>
                <hr className="page-title-bar" />

                <div className="content-container">
                    <div className="trip-info">
                        <div className="selected-station-inform">
                            <div className="selected-departure-station">
                                <div className="selected-departure-inform">출발</div>
                                <div className="selected-departure-detail">{reservationData?.departureStation}</div>
                                <div className="selected-departure-inform">{trainInfo?.departureTime}</div>
                            </div>
                            <div className="selected-departure-station">→</div>
                            <div className="selected-departure-station">
                                <div className="selected-departure-inform">도착</div>
                                <div className="selected-departure-detail">{reservationData?.destinationStation}</div>
                                <div className="selected-departure-inform">{trainInfo?.arrivalTime}</div>
                            </div>
                        </div>
                        <div className="reservation-detail-select">
                            <div className="payment-selected-date">날짜</div>
                            <div>{formattedDate}</div>
                        </div>
                        <div className="reservation-detail-select">
                            <div className="total-number"><span>총 인원 수: </span><span>{totalPassengers.toLocaleString()}명</span></div>
                            <div><span>성인: </span><span>{reservationData?.adultCount}명</span></div>
                            <div><span>노약자: </span><span>{reservationData?.seniorCount}명</span></div>
                            <div><span>청소년: </span><span>{reservationData?.teenCount}명</span></div>
                        </div>
                        <hr />
                        <p className="total-price">지불하실 금액: {totalPrice.toLocaleString()}원</p>
                    </div>

                    <div className="reservation-detail-select">
                        <label className="payment-agree">개인정보 동의</label>
                        <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                    </div>

                    <div className="reservation-detail-select">
                        <div className="payment-phonenumber">전화번호 입력</div> 
                        <input
                            className="payment-phonenumber-input"
                            type="text"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="전화번호를 입력해주세요."
                        />
                        <button className="payment-phonenumber-check" onClick={fetchCards} disabled={!isValidPhone}>확인</button>
                    </div>

                    <hr></hr>
                    <div className="select-payment-method">결제 수단 선택</div>
                    <div className="payment-method">
                        <button  disabled={!phoneConfirmed || !agree} className={paymentMethod === "credit" ? "active" : ""} onClick={() => setPaymentMethod("credit")}>신용카드</button>
                        <button  disabled={!phoneConfirmed || !agree} className={paymentMethod === "kakao" ? "active" : ""} onClick={() => setPaymentMethod("kakao")}>카카오페이</button>
                        <button  disabled={!phoneConfirmed || !agree} className={paymentMethod === "mobile" ? "active" : ""} onClick={() => setPaymentMethod("mobile")}>휴대폰 결제</button>
                    </div>

                    <div className="payment-card-slider">
                        <button className="payment-card-prev" onClick={handlePrev}>&lt;</button>
                        {cards.length > 0 && currentIndex < cards.length ? (
                            <div
                                className={`card-box ${paymentMethod === "existing" && currentIndex === selectedCardIndex ? "selected" : ""}`}
                                onClick={() => {
                                    setPaymentMethod("existing");
                                    setSelectedCardIndex(currentIndex);
                                }}
                            >
                                <img src={AddCard} alt="카드 이미지" className="payment-card-img" />
                                <div>등록된 카드 {cards[currentIndex].last4Digits}</div>
                            </div>
                        ) : (
                            <div
                                className="card-box add-card"
                                onClick={navigateToAddCard}
                            >
                                +
                            </div>
                        )}
                        <button className="payment-card-next" onClick={handleNext}>&gt;</button>
                    </div>
                </div>
            </div>

            <div className="display-button">
                <button className={`${styles.button} payment-back`} onClick={handleBack}>이전</button>
                <button className={`${styles.button} payment-next`} onClick={handleEnd}>다음</button>
            </div>
        </div>
    );
};

export default Payment;
