// ✅ AddCard.tsx — ownerPhone 저장 추가
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Button.module.css";
import styleb from "../styles/Box.module.css";
import "../styles/AddCard.css";

const cardCompanies = ["NH농업", "KB국민", "카카오", "신한", "우리", "하나", "토스", "기업", "새마을"];

const AddCard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { phoneNumber, phoneConfirmed, agree } = location.state || {};

    const [selectedCompany, setSelectedCompany] = useState("");
    const [rawCardNumber, setRawCardNumber] = useState("");
    const [cardNumber, setCardNumber] = useState("");

    const [rawCvc, setRawCvc] = useState("");
    const [cvc, setCvc] = useState("");

    const [rawExpiry, setRawExpiry] = useState("");
    const [expiry, setExpiry] = useState("");

    const [rawPassword, setRawPassword] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if (!selectedCompany) {
            alert("카드사를 선택해주세요.");
            return;
        }
        if (rawCardNumber.length !== 16) {
            alert("카드 번호 16자리를 정확히 입력해주세요.");
            return;
        }
        if (rawCvc.length !== 3) {
            alert("CVC 번호 3자리를 정확히 입력해주세요.");
            return;
        }
        if (!/^\d{4}$/.test(rawExpiry)) {
            alert("유효기간 4자리(MMYY)를 정확히 입력해주세요.");
            return;
        }
        if (rawPassword.length !== 2) {
            alert("카드 비밀번호 앞 2자리를 입력해주세요.");
            return;
        }

        const storedCards = JSON.parse(localStorage.getItem("customCards") || "[]");
        const newCard = {
            id: Date.now(),
            cardCompany: selectedCompany,
            cardNumber: rawCardNumber.replace(/(\d{4})(?=\d)/g, "$1-"),
            last4Digits: rawCardNumber.slice(-4),
            expirationDate: rawExpiry.replace(/(\d{2})(\d{2})/, "$1/$2"),
            ownerPhone: phoneNumber.replace(/-/g, "")
        };

        localStorage.setItem("customCards", JSON.stringify([...storedCards, newCard]));
        navigate("/reservation/payment", {
            state: {
                fromAddCard: true,
                phoneNumber,
                phoneConfirmed,
                agree,
                reservationData: location.state?.reservationData,
                trainInfo: location.state?.trainInfo,
                selectedSeats: location.state?.selectedSeats,
            }
        });
    };

    const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
        setRawCardNumber(raw);

        let masked = "";
        for (let i = 0; i < raw.length; i++) {
            const char = i < 12 ? raw[i] : "0";
            masked += char;
            if ((i + 1) % 4 === 0 && i !== raw.length - 1) masked += "-";
        }
        setCardNumber(masked);
    };

    const handleCVCNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
        setRawCvc(digits);
        setCvc("0".repeat(digits.length));
    };

    const handleExpirationPeriod = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
        setRawExpiry(digits);

        let masked = "";
        if (digits.length === 0) {
            masked = "";
        } else if (digits.length === 1) {
            masked = "0";
        } else if (digits.length === 2) {
            masked = "00";
        } else if (digits.length === 3) {
            masked = "00/0";
        } else {
            masked = "00/00";
        }

        setExpiry(masked);
    };

    const handleCardPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
        setRawPassword(digits);
        setPassword("0".repeat(digits.length));
    };

    const handleBack = () => navigate(-1);

    return (
        <div>
            <title>RegisterCredit</title>
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
                                    onClick={() => setSelectedCompany(company)}
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
                            />
                        </div>
                        <div>
                            <div>CVC</div>
                            <input
                                type="text"
                                value={cvc}
                                onChange={handleCVCNumber}
                                inputMode="numeric"
                                maxLength={3}
                            />
                        </div>
                        <div>
                            <div>유효 기간</div>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={handleExpirationPeriod}
                                inputMode="numeric"
                                maxLength={5}
                            />
                        </div>
                        <div>
                            <div>카드 비밀번호</div>
                            <input
                                type="password"
                                placeholder="비밀번호 앞 2자리"
                                value={password}
                                onChange={handleCardPassword}
                                inputMode="numeric"
                                maxLength={2}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="display-button">
                <button className={`${styles.button} addcard-back`} onClick={handleBack}>이전</button>
                <button className={`${styles.button} addcard-search`} onClick={handleSubmit}>등록하기</button>
            </div>
        </div>
    );
};

export default AddCard;
