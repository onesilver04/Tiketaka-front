import "../styles/RefundSuccess.css";
import styles from "../styles/Button.module.css";
import { useNavigate } from "react-router-dom";
import { addHistoryLog, updateHistorySession } from "../utils/session";
import { useEffect } from "react";

const RefundSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const sessionRaw = localStorage.getItem("currentHistorySession");
        if (sessionRaw) {
            const session = JSON.parse(sessionRaw);
            const sessionId = session.sessionId;

            const alreadyLogged = session.logs?.some(
                (log: any) =>
                    log.page === "RefundSuccess" &&
                    log.event === "navigate" &&
                    log.target_id === "page-load"
            );

            if (!alreadyLogged) {
                addHistoryLog({
                    sessionId,
                    page: "RefundSuccess",
                    event: "navigate",
                    target_id: "page-load",
                    tag: "system",
                    text: "RefundSuccess 페이지 도착",
                });
            }
        }
    }, []);

    const handleHome = () => {
        const sessionRaw = localStorage.getItem("currentHistorySession");
        if (sessionRaw) {
            const session = JSON.parse(sessionRaw);
            const sessionId = session.sessionId;

            // ✅ 로그 기록
            addHistoryLog({
                sessionId,
                page: "RefundSuccess",
                event: "click",
                target_id: "refundSuccess-to-home",
                tag: "button",
                text: "환불 완료 후 메인으로 돌아감",
            });

            // ✅ 세션 종료 + 목적 변경
            updateHistorySession({
                status: "completed",
                purpose: "refund", // 환불 완료 후 pupose: "refund"로 변경
            });
        }

        navigate("/");
    };

    return (
        <div className="refund-success">
            <img
                src="/src/assets/success-button.svg"
                className="success-image"
                alt="환불 성공 이미지"
            />
            <div className="ment">
                <p>환불 처리가 완료되었습니다.</p>
                <p>Tiketaka를 이용해주셔서 감사합니다.</p>
            </div>
            {/* 환불 성공창에서 메인 화면으로 이동하는 버튼 */}
            <button
                id="refundSuccess-to-home"
                className={`${styles.button} go-main`}
                onClick={handleHome}
            >
                메인 화면으로
            </button>
        </div>
    );
};

export default RefundSuccess;
