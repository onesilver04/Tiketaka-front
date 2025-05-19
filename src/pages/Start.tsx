import { useNavigate } from "react-router-dom";
import logoMain from "../assets/lolgo_main.svg";
import styles from "../styles/Button.module.css";
import "../styles/Start.css";
import {
    createNewSession,
    updateHistorySession,
    updateReservationLogSession,
    addReservationLog,
    addHistoryLog,
} from "../utils/session";
import axios from "axios";

const Start = () => {
    const navigate = useNavigate();

    // 예매 버튼 클릭
    const handleStartReservation = async () => {
        createNewSession(); // ✅ 예매 데이터 세션만 생성 (로컬용)

        let backendSessionId: string | null = null;

        try {
            const response = await axios.post("http://localhost:3000/sessions/start", {
                purpose: "reservation",
                current_page: "reservation",
            });
            backendSessionId = response.data.sessionId;

            if (backendSessionId) {
                localStorage.setItem("currentReservationBackendSessionId", backendSessionId);
                updateReservationLogSession({
                    sessionId: backendSessionId,
                    previous_pages: [""],
                    location: "Start",
                });

                addReservationLog({
                    sessionId: backendSessionId,
                    page: "Start",
                    event: "click",
                    target_id: "start-to-reservation",
                    tag: "button",
                    text: "예매하기 버튼 클릭",
                });
            } else {
                console.warn("백엔드에서 sessionId가 반환되지 않음");
            }
        } catch (error) {
            console.error("세션 생성 실패:", error);
        }

        navigate("/reservation", {
            state: { reset: true, sessionId: backendSessionId },
        });
    };

    // 조회 버튼 클릭
    const handleStartSearch = async () => {
        let backendSessionId: string | null = null;

        try {
            const response = await axios.post("http://localhost:3000/sessions/start", {
                purpose: "history",
                current_page: "phone_number",
            });
            backendSessionId = response.data.sessionId;

            if (backendSessionId) {
                localStorage.setItem("currentHistoryBackendSessionId", backendSessionId);

                updateHistorySession({
                    sessionId: backendSessionId,
                    previous_pages: ["Start"],
                    location: "PhoneNumber",
                });

                addHistoryLog({
                    sessionId: backendSessionId,
                    page: "Start",
                    event: "click",
                    target_id: "start-to-phonenumber",
                    tag: "button",
                    text: "조회하기 버튼 클릭",
                });
            } else {
                console.warn("백엔드에서 sessionId가 반환되지 않음");
            }
        } catch (error) {
            console.error("조회 세션 생성 실패:", error);
        }

        navigate("/phonenumber", {
            state: { sessionId: backendSessionId },
        });
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
