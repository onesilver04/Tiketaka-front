import React from "react";
import { addHistoryLog } from "../utils/session";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Button.module.css";
import "../styles/History.css";

const HistoryNone = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sessionId = location.state?.sessionId;

    const handleGoHome = () => {
        if (sessionId) {
            addHistoryLog({
                sessionId,
                page: "HistoryNone",
                event: "click",
                target_id: "historyNone-to-home",
                tag: "button",
                text: "해당 날짜 없음 메인으로 돌아감",
            });
        }
        navigate("/");
    };

    return (
        <div className="ticket-container-none">
            <hr className="page-title-bar" />

            <div className="no-reservation-section">
                <img
                    src="/src/assets/failed-button.svg"
                    alt="no-reservation"
                    className="no-reservation-image"
                />
                <p className="no-reservation-text">
                    해당 조회기간에는
                    <br />
                    예매 내역이 없습니다.
                </p>
            </div>
            {/* HistoryNone에서 메인화면으로 이동하는 버튼 */}
            <button
                id="historyNone-to-home"
                className={styles.button}
                onClick={() => {
                    const sessionId = JSON.parse(
                        localStorage.getItem("currentHistorySession") || "{}"
                    )?.sessionId;
                    if (sessionId) {
                        addHistoryLog({
                            sessionId,
                            page: "Start",
                            event: "click",
                            target_id: "historyNone-to-home",
                            tag: "button",
                            text: "예매 없어서 메인으로 돌아감",
                            url: window.location.href,
                        });
                    }
                    navigate("/");
                }}
            >
                메인 화면으로
            </button>
        </div>
    );
};

export default HistoryNone;
