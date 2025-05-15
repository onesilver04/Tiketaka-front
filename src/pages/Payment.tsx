// Payment.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Payment.css";
import styleb from "../styles/Box.module.css";
import styles from "../styles/Button.module.css";
import { updateCurrentSession, addReservationLog, updateReservationLogSession } from "../utils/session";
import AddCard from "../assets/add-card-img.svg";
import AddCardPlus from "../assets/add-card-plus-img.svg";
import axios from "axios";

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

    const sessionId = (() => {
        try {
            return JSON.parse(localStorage.getItem("currentReservationLogSession") || "null")?.sessionId;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        if (sessionId) {
            updateReservationLogSession({
                location: "Payment",
                previous_pages: ["SelectSeat"],
            });

            const sessionRaw = localStorage.getItem("currentReservationLogSession");
            if (sessionRaw) {
                const session = JSON.parse(sessionRaw);
                const alreadyLogged = session.logs?.some(
                    (log: any) =>
                        log.page === "Payment" &&
                        log.event === "navigate" &&
                        log.target_id === "page-load"
                );

                if (!alreadyLogged) {
                    addReservationLog({
                        sessionId,
                        page: "Payment",
                        event: "navigate",
                        target_id: "page-load",
                        tag: "system",
                        text: "Payment 페이지 도착",
                    });
                }
            }
        }
    }, [sessionId]);

    const logClick = (target_id: string, text: string, tag = "button") => {
        if (!sessionId) return;
        addReservationLog({
            sessionId,
            page: "Payment",
            event: "click",
            target_id,
            tag,
            text,
        });
    };

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
    const selectedSeats = (state as any)?.selectedSeats || {};

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 11);
        if (digits.length <= 3) return digits;
        if (digits.length <= 7)
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    };

    const isValidPhone = /^010-\d{4}-\d{4}$/.test(phoneNumber);

    // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setPhoneNumber(formatPhone(e.target.value));
    //     setPhoneConfirmed(false);
    // };

    const fetchCards = async () => {
        if (!isValidPhone) {
            alert("올바른 전화번호 형식을 입력해주세요.");
            return;
        }

        logClick("payment-phonenumber-check", "전화번호 확인");

        const formatted = phoneNumber.replace(/-/g, "");
        localStorage.setItem("verifiedPhoneNumber", phoneNumber);
        setPhoneConfirmed(true);

        try {
            const response = await axios.get(
                `http://localhost:3000/cards/${formatted}`
            );
            const cardData = response.data;

            if (Array.isArray(cardData) && cardData.length > 0) {
                const converted = cardData.map((card: any, idx: number) => ({
                    cardNumber: card.cardNumber,
                    cardCompany: card.cardCompany,
                    id: idx,
                    last4Digits: card.cardNumber.slice(-4),
                    expirationDate: card.expirationDate,
                    ownerPhone: formatted,
                }));
                setCards(converted);
            } else {
                setCards([]); // 카드 없을 경우 비움
            }
        } catch (error) {
            console.error("카드 조회 중 오류:", error);
            alert("카드 정보를 불러오는 데 실패했습니다.");
        }
    };

    // const fetchCards = () => {
    //     if (!isValidPhone) return alert("올바른 전화번호 형식을 입력해주세요.");
    //     logClick("payment-phonenumber-check", "전화번호 확인");

    //     const formatted = phoneNumber.replace(/-/g, "");
    //     localStorage.setItem("verifiedPhoneNumber", phoneNumber);
    //     setPhoneConfirmed(true);

    //     const savedCards = JSON.parse(localStorage.getItem("customCards") || "[]");
    //     const filtered = savedCards.filter((card: Card) => card.ownerPhone === formatted);
    //     setCards(filtered);
    // };

    useEffect(() => {
        const storedPhone = localStorage.getItem("verifiedPhoneNumber");
        if (!state?.fromAddCard && storedPhone) {
            localStorage.removeItem("verifiedPhoneNumber");
            setPhoneNumber("");
            setPhoneConfirmed(false);
        } else if (storedPhone) {
            setPhoneNumber(storedPhone);
            setPhoneConfirmed(true);
        }
    }, []);

    useEffect(() => {
        const storedPhone = localStorage.getItem("verifiedPhoneNumber");
        if (state?.fromAddCard && storedPhone) {
            setPhoneNumber(storedPhone);
            setPhoneConfirmed(true);
            fetchCards(); // ✅ 서버에서 카드 목록 다시 불러오기
        }
    }, [state]);

    // useEffect(() => {
    //     if (state?.fromAddCard && cards.length > 0) {
    //         setCurrentIndex(cards.length - 1);
    //         setSelectedCardIndex(cards.length - 1);
    //         setPaymentMethod("existing");
    //     }
    // }, [cards, state]);

    const handleNext = () => {
        logClick("payment-addedcard-next", "카드 다음");
        if (cards.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % (cards.length + 1));
        }
    };

    const handlePrev = () => {
        logClick("payment-addedcard-prev", "카드 이전");
        if (cards.length > 0) {
            setCurrentIndex(
                (prev) => (prev - 1 + (cards.length + 1)) % (cards.length + 1)
            );
        }
    };

    const handleBack = () => {
        logClick("payment-to-selectseat", "이전");
        localStorage.removeItem("verifiedPhoneNumber");
        navigate("/reservation/select-seat", {
            state: {
                reservationData,
                trainInfo,
            },
        });
    };

    const handleEnd = async () => {
        logClick("payment-to-end", "결제 완료");

        if (!agree) return alert("개인정보에 동의해주세요.");
        if (!isValidPhone) return alert("올바른 전화번호를 입력해주세요.");
        if (!phoneConfirmed) return alert("전화번호 확인을 해주세요.");
        if (!isCardSelected) return alert("결제 수단을 선택해주세요.");

        const selectedCard = cards[selectedCardIndex];

        const phone = phoneNumber.replace(/-/g, "");
        const seatNumbers = Object.values(selectedSeats).flat();
        const firstCarriage = Number(Object.keys(selectedSeats)[0]) || 1;

        const payload = {
            trainId: trainInfo?.trainId,
            carriageNumber: firstCarriage,
            seatNumbers,
            phoneNumber: phone,
            passengerCount: {
                adult: reservationData?.adultCount ?? 0,
                senior: reservationData?.seniorCount ?? 0,
                youth: reservationData?.teenCount ?? 0,
            },
            paymentMethod,
            cardNumber: selectedCard?.cardNumber || null,
        };

        try {
            await axios.post("http://localhost:3000/reservations", payload); // 예매 정보 저장 post 요청

            updateCurrentSession({
                paymentInfo: {
                    phoneNumber: phone,
                    paymentMethod,
                    cardNumber: selectedCard?.cardNumber || null,
                },
            });

            alert("결제가 완료되었습니다.");
            navigate("/reservation/payment/end");
        } catch (err) {
            console.error("예매 정보 저장 실패:", err);
            alert("예매 정보 저장 중 오류가 발생했습니다.");
        }
    };

    const navigateToAddCard = () => {
        logClick("payment-add-card", "카드 추가로 이동");
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

    const adultCount = reservationData?.adultCount ?? 0;
    const seniorCount = reservationData?.seniorCount ?? 0;
    const teenCount = reservationData?.teenCount ?? 0;

    const totalPrice = adultCount * 50000 + seniorCount * 40000 + teenCount * 35000;
    const totalPassengers = adultCount + seniorCount + teenCount;
    const [showKeypad, setShowKeypad] = useState(false);

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
                        <input
                            type="checkbox"
                            id="payment-privacy-agree"
                            checked={agree}
                            onChange={() => {
                                setAgree(!agree);
                                logClick("payment-privacy-agree", !agree ? "개인정보 동의 체크" : "개인정보 동의 해제", "checkbox");
                            }}
                        />
                    </div>

                    <div className="reservation-detail-select">
                        <div className="payment-phonenumber">전화번호 입력</div>
                        <input
                            className="payment-phonenumber-input"
                            id="payment-phonenumber-input"
                            type="text"
                            readOnly // 키보드 입력 막고 키패드로만 입력 받음
                            value={phoneNumber}
                            onClick={() => {
                                logClick("payment-phone-keypad-open", "전화번호 입력창 클릭 - 키패드 열림");
                                setShowKeypad(true);
                            }}
                            placeholder="전화번호를 입력해주세요."
                        />
                            {showKeypad && (
                                <div className="payment-keypad-modal">
                                    <div className="payment-keypad">
                                        {[1,2,3,4,5,6,7,8,9,"",0,"←"].map((key, i) => (
                                            <button
                                                key={i}
                                                className="payment-keypad-button"
                                                onClick={() => {
                                                    if (key === "←") {
                                                        setPhoneNumber((prev) => prev.slice(0, -1));
                                                        logClick("payment-phone-keypad-delete", "전화번호 한 자리 삭제", "keypad");
                                                    } else {
                                                        const newValue = phoneNumber + key.toString();
                                                        setPhoneNumber(formatPhone(newValue));
                                                        logClick(`payment-phone-keypad-${key}`, `키패드 입력: ${key}`, "keypad");
                                                    }
                                                }}
                                            >
                                                {key}
                                            </button>
                                        ))}
                                        <button
                                            className="payment-keypad-confirm"
                                            onClick={() => {
                                                logClick("payment-phone-keypad-close", "전화번호 키패드 닫기");
                                                setShowKeypad(false);
                                            }}
                                        >
                                            확인
                                        </button>
                                    </div>
                                </div>
                            )}
                        <button className="payment-phonenumber-check" onClick={fetchCards}>
                            확인
                        </button>
                    </div>

                    <hr></hr>
                    <div className="select-payment-method">결제 수단 선택</div>
                    <div className="payment-method">
                        <button
                            disabled={!phoneConfirmed || !agree}
                            className={paymentMethod === "credit" ? "active" : ""}
                            id="payment-method-credit"
                            onClick={() => {
                                setPaymentMethod("credit");
                                logClick("payment-method-credit", "신용카드 선택");
                            }}
                        >
                            신용카드
                        </button>
                        <button
                            disabled={!phoneConfirmed || !agree}
                            className={paymentMethod === "kakao" ? "active" : ""}
                            id="payment-method-kakao"
                            onClick={() => {
                                setPaymentMethod("kakao");
                                logClick("payment-method-kakao", "카카오페이 선택");
                            }}
                        >
                            카카오페이
                        </button>
                        <button
                            disabled={!phoneConfirmed || !agree}
                            className={paymentMethod === "mobile" ? "active" : ""}
                            id="payment-method-mobile"
                            onClick={() => {
                                setPaymentMethod("mobile");
                                logClick("payment-method-mobile", "휴대폰 결제 선택");
                            }}
                        >
                            휴대폰 결제
                        </button>
                    </div>

                    <div className="payment-card-slider">
                        <button className="payment-card-prev" id="payment-addedcard-prev" onClick={handlePrev}>&lt;</button>
                        {cards.length > 0 && currentIndex < cards.length ? (
                            <div
                                className={`card-box ${paymentMethod === "existing" && currentIndex === selectedCardIndex ? "selected" : ""}`}
                                onClick={() => {
                                    setPaymentMethod("existing");
                                    setSelectedCardIndex(currentIndex);
                                }}
                                id="payment-addedcard-select"
                            >
                                <img src={AddCard} alt="카드 이미지" className="payment-card-img" />
                                <div>등록된 카드 {cards[currentIndex].last4Digits}</div>
                            </div>
                        ) : (
                            <div
                                className="card-box add-card"
                                id="payment-add-card"
                                onClick={navigateToAddCard}
                            >
                                <img className="payment-add-card-plus" id="payment-add-card-plus" src={AddCardPlus} alt="카드 추가 이미지"></img>
                            </div>
                        )}
                        <button className="payment-card-next" id="payment-addedcard-next" onClick={handleNext}>&gt;</button>
                    </div>
                </div>
            </div>

            <div className="display-button">
                <button className={`${styles.button} payment-back`} id="payment-to-selectseat" onClick={handleBack}>이전</button>
                <button className={`${styles.button} payment-next`} id="payment-to-end" onClick={handleEnd}>다음</button>
            </div>
        </div>
    );
};

export default Payment;
