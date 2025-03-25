import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cardCompanies = ["배농업", "KB국민", "카카오", "신한", "우리", "하나", "토스", "기업", "새마을"];

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

    return (
        <div className="add-card-container">
        <h2>카드 등록</h2>
        <div className="card-companies">
            {cardCompanies.map((company) => (
            <button
                key={company}
                className={selectedCompany === company ? "selected" : ""}
                onClick={() => setSelectedCompany(company)}
            >
                {company}
            </button>
            ))}
        </div>
        <input type="text" placeholder="카드 번호" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
        <input type="text" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} />
        <input type="text" placeholder="유효 기간 (MM/YY)" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        <input type="password" placeholder="비밀번호 앞 2자리" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSubmit}>결제하기</button>
        </div>
    );
};

export default AddCard;
