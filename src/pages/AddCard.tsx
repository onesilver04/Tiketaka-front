import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Button.module.css";
import styleb from "../styles/Box.module.css";
import "../styles/AddCard.css";
import { addReservationLog, updateReservationLogSession } from "../utils/session";

const cardCompanies = ["NH농협", "KB국민", "카카오", "신한", "우리", "하나", "토스", "기업", "새마을"];

const AddCard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { phoneNumber, phoneConfirmed, agree, reservationData, trainInfo, selectedSeats } = location.state || {};

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
                location: "Addcard",
                previous_pages: ["Payment"],
            });

            const sessionRaw = localStorage.getItem("currentReservationLogSession");
            if (sessionRaw) {
                const session = JSON.parse(sessionRaw);
                const alreadyLogged = session.logs?.some(
                    (log: any) =>
                        log.page === "Addcard" &&
                        log.event === "navigate" &&
                        log.target_id === "page-load"
                );

                if (!alreadyLogged) {
                    addReservationLog({
                        sessionId,
                        page: "Addcard",
                        event: "navigate",
                        target_id: "page-load",
                        tag: "system",
                        text: "Addcard 페이지 도착",
                    });
                }
            }
        }
    }, [sessionId]);

    const logClick = (target_id: string, text: string, tag = "button") => {
        if (!sessionId) return;
        addReservationLog({
            sessionId,
            page: "AddCard",
            event: "click",
            target_id,
            tag,
            text,
        });
    };

    const [selectedCompany, setSelectedCompany] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvc, setCvc] = useState("");
    const [expiry, setExpiry] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if (!selectedCompany) return alert("카드사를 선택해주세요.");
        if (cardNumber.replace(/\D/g, "").length !== 16) return alert("카드 번호 16자리를 정확히 입력해주세요.");
        if (cvc.length !== 3) return alert("CVC 번호 3자리를 정확히 입력해주세요.");
        if (!/^\d{4}$/.test(expiry)) return alert("유효기간 4자리(MMYY)를 입력해주세요.");
        if (password.length !== 2) return alert("카드 비밀번호 앞 2자리를 입력해주세요.");

        const rawCard = cardNumber.replace(/\D/g, "");
        const maskedCardNumber = `****-****-****-${rawCard.slice(-4)}`;

        const storedCards = JSON.parse(localStorage.getItem("customCards") || "[]");
        const newCard = {
            id: Date.now(),
            cardCompany: selectedCompany,
            cardNumber: maskedCardNumber,
            last4Digits: rawCard.slice(-4),
            expirationDate: expiry.replace(/(\d{2})(\d{2})/, "$1/$2"),
            ownerPhone: phoneNumber.replace(/-/g, "")
        };

        logClick("addcard-success", "카드 등록");

        localStorage.setItem("customCards", JSON.stringify([...storedCards, newCard]));

        navigate("/reservation/payment", {
            state: {
                fromAddCard: true,
                phoneNumber,
                phoneConfirmed,
                agree,
                reservationData,
                trainInfo,
                selectedSeats,
            }
        });
    };

    const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
        const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1-");
        setCardNumber(formatted);
        logClick("addcard-card-number", `카드번호 입력: ${formatted}`);
    };
    
    const handleCVC = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
        setCvc(digits);
        logClick("addcard-card-cvc", `CVC 입력: ${"*".repeat(digits.length)}`);
    };
    
    const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
        setExpiry(digits);
        logClick("addcard-card-period", `유효기간 입력: ${digits}`);
    };
    
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
        setPassword(digits);
        logClick("addcard-card-password", `비밀번호 앞자리 입력: **`);
    };
    

    const handleBack = () => {
        logClick("addcard-to-payment", "결제화면으로 돌아가기");
        navigate(-1);
    };

    return (
        <div>
            <div className={styleb.box}>
                <div className="add-card-container">
                    <h2 className="page-title">카드 등록</h2>
                    <hr className="page-title-bar" />

                    <div className="content-container">
                        <div>카드사 선택</div>
                        <div className="addcard-selected-container">
                            {cardCompanies.map((company) => (
                                <button
                                    key={company}
                                    className={`addcard-selected ${selectedCompany === company ? "active" : ""}`}
                                    onClick={() => {
                                        setSelectedCompany(company);
                                        logClick("addcard-selected", `카드사 선택: ${company}`, "button");
                                    }}
                                    id="addcard-selected"
                                >
                                    {company}
                                </button>
                            ))}
                        </div>

                        <div>
                            <div>카드 번호</div>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumber}
                                inputMode="numeric"
                                maxLength={19}
                                placeholder="카드번호 16자리"
                                className="addcard-inform-input"
                                id="addcard-card-number"
                            />
                        </div>

                        <div>
                            <div>CVC</div>
                            <input
                                type="password"
                                value={cvc}
                                onChange={handleCVC}
                                inputMode="numeric"
                                maxLength={3}
                                placeholder="cvc 번호 입력"
                                className="addcard-inform-input"
                                id="addcard-card-cvc"
                            />
                        </div>

                        <div>
                            <div>유효 기간</div>
                            <input
                                type="password"
                                value={expiry}
                                onChange={handleExpiry}
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="MMYY"
                                className="addcard-inform-input"
                                id="addcard-card-period"
                            />
                        </div>

                        <div>
                            <div>카드 비밀번호</div>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePassword}
                                inputMode="numeric"
                                maxLength={2}
                                placeholder="비밀번호 앞 2자리"
                                className="addcard-inform-input"
                                id="addcard-card-password"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="display-button">
                <button className={`${styles.button} addcard-back`} id="addcard-to-payment" onClick={handleBack}>이전</button>
                <button className={`${styles.button} addcard-search`} id="addcard-success" onClick={handleSubmit}>등록하기</button>
            </div>
        </div>
    );
};

export default AddCard;
