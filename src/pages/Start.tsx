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
        const logSessionId = createReservationLogSession();  // ✅ 예매용 로그 세션 생성

        updateReservationLogSession({
            previous_pages: [""],
            location: "Start",
        });

        // ✅ 백엔드 세션 생성
        let backendSessionId: string | null = null;

        try {
            const response = await axios.post("http://localhost:3000/sessions/start", {
                purpose: "reservation",
                current_page: "reservation",
            });
            backendSessionId = response.data.sessionId;

            if (backendSessionId) {
                localStorage.setItem("currentReservationBackendSessionId", backendSessionId);
            } else {
                console.warn("백엔드에서 sessionId가 반환되지 않음");
            }
        } catch (error) {
            console.error("세션 생성 실패:", error);
        }

        // ✅ 예매 로그 기록
        addReservationLog({
            sessionId: logSessionId,
            page: "Start",
            event: "click",
            target_id: "start-to-reservation",
            tag: "button",
            text: "예매하기 버튼 클릭",
        });

        navigate("/reservation", {
            state: { reset: true, sessionId: backendSessionId || logSessionId },
        });
    };

    // 조회 버튼 클릭
    const handleStartSearch = async () => {
        const localSessionId = createHistorySession(); // 로컬 세션 생성

        let backendSessionId: string | null = null;

        // ✅ 백엔드 세션 생성
        try {
            const response = await axios.post("http://localhost:3000/sessions/start", {
                purpose: "history",
                current_page: "phone_number",
            });
            backendSessionId = response.data.sessionId;

            if (backendSessionId) {
                localStorage.setItem("currentHistoryBackendSessionId", backendSessionId); // ✅ 저장
            } else {
                console.warn("백엔드에서 sessionId가 반환되지 않음");
            }
        } catch (error) {
            console.error("조회 세션 생성 실패:", error);
        }

        // ✅ Start 페이지에서만 클릭 로그 기록
        addHistoryLog({
            sessionId: localSessionId,
            page: "Start",
            event: "click",
            target_id: "start-to-phonenumber",
            tag: "button",
            text: "조회하기 버튼 클릭",
        });

        updateHistorySession({
            previous_pages: ["Start"],
            location: "PhoneNumber",
        });

        navigate("/phonenumber", {
            state: { sessionId: backendSessionId || localSessionId },
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
