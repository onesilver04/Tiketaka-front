import "/src/styles/Header.css";
import logoHeader from "../assets/header-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { markHistorySessionCompleted } from "../utils/session";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isClickable = !["/refund-success"].includes(location.pathname); // RefundSuccess에서 헤더 클릭 막기 위해 추가

    const handleHome = async () => {
        if (!isClickable) return;
        // 1. 예약 세션 종료
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
                    end_reason: "click_header", // 또는 session_abandoned
                    current_page: "Start",
                });
                localStorage.removeItem("currentReservationLogSession");
            } catch (error) {
                console.error("예약 세션 종료 실패:", error);
            }
        }

        // 2. 조회/환불 세션 종료
        const historyRaw = localStorage.getItem("currentHistorySession");
        if (historyRaw) {
            const session = JSON.parse(historyRaw);            
            const purpose = session.purpose || "history";
            const end_reason =
                purpose === "refund" ? "refund_abandoned" : "history_abandoned";

            await markHistorySessionCompleted({
                end_reason,
                current_page: "Start",
            });
        }

        navigate("/");
    };

    return (
        <div className="header-container">
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
