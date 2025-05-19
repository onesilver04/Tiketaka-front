import "../styles/RefundSuccess.css";
import styles from "../styles/Button.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { addHistoryLog, updateHistorySession } from "../utils/session";
import { useEffect } from "react";
import axios from "axios";

const RefundSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const reservations = (location.state as any)?.reservations || [];

    useEffect(() => {
        const sessionRaw = localStorage.getItem("currentHistorySession");
        const session = sessionRaw ? JSON.parse(sessionRaw) : null;
        const sessionId = session?.sessionId;

        // ✅ 예약 삭제 API 호출
        const deleteReservations = async () => {
            for (const res of reservations) {
                try {
                    await axios.delete(`http://localhost:3000/refunds/${res.reservationId}`);
                    console.log(`환불 성공: ${res.reservationId}`);
                } catch (err) {
                    console.error(`환불 실패: ${res.reservationId}`, err);
                }
            }
        };

        deleteReservations();

        // ✅ 페이지 진입 로그
        if (sessionId) {
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
    }, [reservations]);

    const handleHome = async () => {
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

            try {
                await axios.patch("http://localhost:3000/sessions/update", {
                    sessionId,
                    current_page: "RefundSuccess",
                    newPurpose: "refund",
                });

                await axios.patch("http://localhost:3000/sessions/end", {
                    sessionId,
                    status: "completed",
                    end_reason: "refund_completed",
                    current_page: "RefundSuccess",
                });

            } catch (err) {
                console.error("세션 목적 변경 실패:", err);
            }

            // ✅ 세션 종료 + 목적 변경
            updateHistorySession({
                status: "completed",
                purpose: "refund",
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
