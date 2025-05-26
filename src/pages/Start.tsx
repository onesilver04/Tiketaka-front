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
    let backendSessionId: string | null = null;

    try {
        const response = await axios.post(
            "http://localhost:3000/sessions/start",
            {
                purpose: "reservation",
                current_page: "reservation",
            }
        );

        const sessionData = response.data;
        backendSessionId = sessionData.sessionId;

        if (backendSessionId) {
            // ✅ 새로운 세션 객체 구성
            const newSession = {
                sessionId: backendSessionId,
                status: "active",
                purpose: "reservation",
                current_page: "reservation",
                start_time: new Date().toISOString(),
                last_interaction: new Date().toISOString(),
                previous_pages: [],
                logs: [],
            };

            // ✅ 현재 세션 저장 (로그 추적용)
            localStorage.setItem(
                "currentReservationLogSession",
                JSON.stringify(newSession)
            );

            // ✅ 전체 세션 목록에 추가
            const allSessions = JSON.parse(
                localStorage.getItem("reservationLogSessions") || "[]"
            );
            allSessions.push(newSession);
            localStorage.setItem(
                "reservationLogSessions",
                JSON.stringify(allSessions)
            );

            // ✅ 페이지 위치 업데이트
            await updateReservationLogSession({
                sessionId: backendSessionId,
                current_page: "reservation",
            });

            // ✅ 클릭 로그 추가
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
            const response = await axios.post(
                "http://localhost:3000/sessions/start",
                {
                    purpose: "history",
                    current_page: "start",
                }
            );
            const sessionData = response.data;
            backendSessionId = sessionData.sessionId;

            if (backendSessionId) {
                // ✅ reservation처럼 전체 세션 구조 저장
                localStorage.setItem("currentHistorySession", JSON.stringify(sessionData));

                // ✅ 이전 페이지, 현재 위치 업데이트
                updateHistorySession({
                    sessionId: backendSessionId,
                    previous_pages: ["Start"],
                    location: "PhoneNumber",
                });

                // ✅ 로그 기록
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