import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PhoneNumber.css";
import deleteIcon from "../assets/delete-button.svg";
import styles from "../styles/Button.module.css";
import PhoneModal from "../components/PhoneModal";

const PhoneNumber = () => {
    const navigate = useNavigate();
    const [inputDigits, setInputDigits] = useState(""); // 010 제외한 8자리만 저장
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 숫자 버튼 입력
    const handleNumberClick = (num: string) => {
        if (inputDigits.length >= 8) return;
        setInputDigits((prev) => prev + num);
    };

    // 삭제 버튼
    const handleDelete = () => {
        setInputDigits((prev) => prev.slice(0, -1));
    };

    // 포맷: 010-XXXX-XXXX
    const getFormattedPhone = () => {
        const d = inputDigits;
        if (d.length <= 4) return `010-${d}`;
        return `010-${d.slice(0, 4)}-${d.slice(4, 8)}`;
    };

    // 다음 버튼
    const handleNextClick = () => {
        if (inputDigits.length === 8) {
            const fullNumber = "010" + inputDigits; // 👉 하이픈 없이 11자리
            navigate("/history", { state: { phoneNumber: fullNumber } });
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="phone-number">
            <h1>전화번호 입력</h1>

            <input
                type="text"
                value={getFormattedPhone()}
                readOnly
                placeholder="010-1234-5678"
            />

            <div className="keypad">
                {[
                    ["1", "2", "3"],
                    ["4", "5", "6"],
                    ["7", "8", "9"],
                    ["empty", "0", "del"],
                ].map((row, i) => (
                    <div key={i} className="keypad-row">
                        {row.map((key, j) => {
                            if (key === "empty") {
                                return (
                                    <button
                                        key={`empty-${i}-${j}`}
                                        disabled
                                        style={{ visibility: "hidden" }}
                                    >
                                        {/* 공간 유지용 */}
                                    </button>
                                );
                            }

                            if (key === "del") {
                                return (
                                    <button
                                        key={`del-${i}-${j}`}
                                        onClick={handleDelete}
                                    >
                                        취소
                                        {/* <img
                                            src={deleteIcon}
                                            alt="delete"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                            }}
                                        /> */}
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={`num-${i}-${j}`}
                                    onClick={() => handleNumberClick(key)}
                                >
                                    {key}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="nav-buttons">
                <button className={styles.button} onClick={() => navigate("/")}>
                    이전
                </button>
                <button className={styles.button} onClick={handleNextClick}>
                    다음
                </button>
            </div>

            {isModalOpen && (
                <PhoneModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default PhoneNumber;
