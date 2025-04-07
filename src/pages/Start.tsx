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

const Start = () => {
    const navigate = useNavigate();

    // 예매 버튼 클릭
    const handleStartReservation = () => {
        createNewSession(); // ✅ 예매용 예약 데이터 세션 생성
        const sessionId = createReservationLogSession(); // ✅ 예매용 로그 세션 생성

        updateReservationLogSession({
            previous_pages: [""],
            location: "Start",
        });

        // ✅ 예매 로그 기록
        addReservationLog({
            sessionId,
            page: "Start",
            event: "click",
            target_id: "start-to-reservation",
            tag: "button",
            text: "예매하기 버튼 클릭",
        });

        navigate("/reservation", { state: { reset: true, sessionId } });
    };

    // 조회 버튼 클릭
    const handleStartSearch = () => {
        const sessionId = createHistorySession();

        // ✅ Start 페이지에서만 클릭 로그 기록
        addHistoryLog({
            sessionId,
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
