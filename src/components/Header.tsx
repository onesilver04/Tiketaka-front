// [LLM] Header 컴포넌트 - 상단 로고를 통해 홈으로 돌아갈 수 있는 인터페이스를 제공하며, 세션 종료 로직 포함

import "/src/styles/Header.css";
import logoHeader from "../assets/header-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { markHistorySessionCompleted } from "../utils/session";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // [LLM] 특정 페이지에서는 헤더 클릭 비활성화 (예: 환불 성공 페이지)
    const isClickable = !["/refund-success"].includes(location.pathname);

    // [LLM] 로고 클릭 시 실행되는 함수 - 세션 정리 후 홈으로 이동
    const handleHome = async () => {
        if (!isClickable) return;

        // [LLM] 1. 예약 세션 종료 로직 처리
        const reservationRaw = localStorage.getItem(
            "currentReservationLogSession"
        );
        if (reservationRaw) {
            const session = JSON.parse(reservationRaw);
            const sessionId = session.sessionId ?? session.id?.toString?.();
            try {
                await axios.patch("http://localhost:3000/sessions/end", {
                    sessionId,
                    status: "completed",
                    end_reason: "click_header",
                    current_page: "Start",
                });
                localStorage.removeItem("currentReservationLogSession");
            } catch (error) {
                console.error("예약 세션 종료 실패:", error);
            }
        }

        // [LLM] 2. 조회/환불 세션 종료 로직 처리
        const historyRaw = localStorage.getItem("currentHistorySession");
        if (historyRaw) {
            const session = JSON.parse(historyRaw);
            const purpose = session.purpose || "history";
            const end_reason =
                purpose === "refund" ? "refund_abandoned" : "history_completed";

            await markHistorySessionCompleted({
                end_reason,
                current_page: "Start",
            });
        }

        // [LLM] 홈으로 이동
        navigate("/");
    };

    return (
        // [LLM] 헤더 컨테이너 - 로고 포함
        <div id="header-container" className="header-container">
            {/* [LLM] 로고 클릭 시 handleHome 실행. RefundSuccess 페이지에서는 비활성화 */}
            <img
                src={logoHeader}
                onClick={handleHome}
                alt="헤더로고"
                className="header-logo"
                id={`header-logo ${isClickable ? "" : "unclickable"}`}
            />
        </div>
    );
};

export default Header;
