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
} from "../utils/session";

const Start = () => {
    const navigate = useNavigate();

    const handleStartReservation = () => {
        createNewSession(); // 예매용 예약 데이터 세션
        const sessionId = createReservationLogSession(); // ✅ 예매 로그 세션 시작

        updateReservationLogSession({
            previous_pages: ["Start"],
            location: "Reservation",
        });

        navigate("/reservation", { state: { reset: true, sessionId } }); // 넘겨줄 수도 있음
    };

    const handleStartSearch = () => {
        const sessionId = createHistorySession(); // 조회 로그 세션 시작
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
                    className={`${styles.button} reservation`}
                    onClick={handleStartReservation}
                >
                    예매하기
                </button>
                <button
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
