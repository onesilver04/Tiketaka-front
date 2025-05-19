import "/src/styles/Header.css";
import logoHeader from "../assets/header-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isClickable = !["/refund-success"].includes(location.pathname); // RefundSuccess에서 헤더 클릭 막기 위해 추가

    const handleHome = async () => {
        if (!isClickable) return;
        // 1. 예약 세션 종료
        const reservationRaw = localStorage.getItem("currentReservationSession");
        if (reservationRaw) {
            const session = JSON.parse(reservationRaw);
            const sessionId = session.sessionId;
            try {
                await axios.patch("http://localhost:3000/sessions/end", {
                    sessionId,
                    status: "completed",
                    end_reason: "booking_aborted", // 또는 session_abandoned
                    current_page: "Header",
                });
                localStorage.removeItem("currentReservationSession");
            } catch (error) {
                console.error("예약 세션 종료 실패:", error);
            }
        }

        // 2. 조회/환불 세션 종료
        const historyRaw = localStorage.getItem("currentHistorySession");
        if (historyRaw) {
            const session = JSON.parse(historyRaw);
            const sessionId = session.sessionId;
            const purpose = session.purpose || "history";
            let end_reason = "history_aborted";
            if (purpose === "refund") end_reason = "refund_aborted";

            try {
                await axios.patch("http://localhost:3000/sessions/end", {
                    sessionId,
                    status: "completed",
                    end_reason,
                    current_page: "Header",
                });
                localStorage.removeItem("currentHistorySession");
            } catch (error) {
                console.error("조회/환불 세션 종료 실패:", error);
            }
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
