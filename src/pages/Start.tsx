import { useNavigate } from "react-router-dom";
import logoMain from "../assets/lolgo_main.svg";
import styles from "../styles/Button.module.css";
import "../styles/Start.css";
import {
    createNewSession,
    createHistorySession,
    updateHistorySession,
    createReservationLogSession,
    updateReservationLogSession,
    addReservationLog,
    addHistoryLog,
} from "../utils/session";
import axios from "axios";

const Start = () => {
    const navigate = useNavigate();

    // 예매 버튼 클릭
    const handleStartReservation = async () => {
        createNewSession(); // ✅ 예매용 예약 데이터 세션 생성
        let sessionId = "";
        try {
            const response = await axios.post(
                "http://localhost:3000/sessions/start",
                {
                    purpose: "reservation",
                    current_page: "reservation",
                }
            );

            const newSession = response.data; // ✅ 백엔드가 반환한 전체 세션 객체
            sessionId = newSession.sessionId;

            localStorage.setItem(
                "currentReservationLogSession",
                JSON.stringify(newSession)
            );

            const sessionList = JSON.parse(
                localStorage.getItem("reservationLogSessions") || "[]"
            );
            sessionList.push(newSession);
            localStorage.setItem(
                "reservationLogSessions",
                JSON.stringify(sessionList)
            );
        } catch (err) {
            console.error("세션 생성 실패:", err);
            return;
        }

        addReservationLog({
            sessionId,
            page: "Start",
            event: "click",
            target_id: "start-to-reservation",
            tag: "button",
            text: "예매하기 버튼 클릭",
        });

        updateReservationLogSession({
            current_page: "reservation",
            previous_pages: ["Start"],
        });

        navigate("/reservation", { state: { reset: true, sessionId } });
    };

    // 조회 버튼 클릭
    const handleStartSearch = async () => {
        let sessionId = "";
        try {
            const response = await axios.post(
                "http://localhost:3000/sessions/start",
                {
                    purpose: "history",
                    current_page: "phone_number",
                }
            );

            const newSession = response.data;
            sessionId = newSession.sessionId;

            localStorage.setItem(
                "currentHistorySession",
                JSON.stringify(newSession)
            );

            const sessionList = JSON.parse(
                localStorage.getItem("historySessions") || "[]"
            );
            sessionList.push(newSession);
            localStorage.setItem(
                "historySessions",
                JSON.stringify(sessionList)
            );
        } catch (error) {
            console.error("조회 세션 생성 실패:", error);
            return;
        }

        addHistoryLog({
            sessionId,
            page: "Start",
            event: "click",
            target_id: "start-to-phonenumber",
            tag: "button",
            text: "조회하기 버튼 클릭",
        });

        updateHistorySession({
            current_page: "phone_number",
            previous_pages: ["Start"],
        });

        navigate("/phonenumber", { state: { sessionId } });
    };
    
    return (
        <div>
            <title>Start</title>
            <div className="logo">
                <img className="main-logo" src={logoMain} alt="메인로고" />
            </div>
            <div className="button-container">
                <button
                    id="start-to-reservation"
                    className={`${styles.button} reservation`}
                    onClick={handleStartReservation}
                >
                    예매하기
                </button>
                <button
                    id="start-to-phonenumber"
                    className={`${styles.button} look-up`}
                    onClick={handleStartSearch}
                >
                    조회하기
                </button>
            </div>
        </div>
    );
};

export default Start;
