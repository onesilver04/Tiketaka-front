//AddCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Button.module.css";
import styleb from "../styles/Box.module.css";
import "../styles/AddCard.css";

const cardCompanies = ["NH농업", "KB국민", "카카오", "신한", "우리", "하나", "토스", "기업", "새마을"];

const AddCard: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvc, setCvc] = useState("");
    const [expiry, setExpiry] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        // 카드 정보 저장 로직 (API 연동 가능)
        console.log({ selectedCompany, cardNumber, cvc, expiry, password });
        navigate(-1); // 이전 페이지로 이동
    };

    const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
        let masked = "";
    
        for (let i = 0; i < digits.length; i += 4) {
            if (e.target.value.length < 16) {
                alert("카드번호가 올바르지 않습니다. ");
            } else {
                masked += (masked ? "-" : "") + digits.slice(i, i + 4);
            }
        }
    
        setCardNumber(masked);
    };

    const handleCVCNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4)
        if (digits.length <= 3) return digits;
        return `${digits}`;
    };

    const handleExpirationPeriod = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
        const formatted =
            digits.length <= 2
                ? digits
                : digits.slice(0, 2) + "/" + "*".repeat(digits.length - 2);
        setExpiry(formatted);
    };

    const handleCardPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
        setPassword("*".repeat(digits.length));
    };

    const handleback = () => {
        navigate(-1);
    }

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
                                className="addcard-selected"
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
                            />
                            {/* 4개씩 16개 숫자 입력하면 4개씩 -로 묶이고 마지막 4자리는 *로 표시 */}
                        </div>

                        <div>
                            <div>CVC</div>
                            <input
                                type="text"
                                value={cvc}
                                onChange={handleCVCNumber}
                            />
                            {/* 숫자 세 개만 입력받고 모두 *로 표시 */}
                        </div>

                        <div>
                            <div>유효 기간</div>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={handleExpirationPeriod}
                            />
                            {/* MM/YY 형식으로 숫자 네자리 입력받고 뒤는 *로 표시 */}
                        </div>

                        <div>
                            <div>카드 비밀번호</div>
                            <input
                                type="password"
                                placeholder="비밀번호 앞 2자리"
                                value={password}
                                onChange={handleCardPassword}
                            />
                            {/* 숫자 두 개 입력 받고 *로 표시 */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="display-button">
                <button className={`${styles.button} addcard-back`} onClick={handleback}>이전</button>
                <button className={`${styles.button} addcard-search`} onClick={handleSubmit}>등록하기</button>
            </div>
        </div>

    );
};

export default AddCard;
