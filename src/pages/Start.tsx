import { useNavigate } from "react-router-dom";
import logoMain from "../assets/lolgo_main.svg";
import styles from "../styles/Button.module.css";
import "../styles/Start.css";
import { createNewSession } from "../utils/session";

const Start = () => {
    const navigate = useNavigate();

    const handleStartReservation = () => {
        createNewSession(); // 기존 세션 리셋 및 새로운 세션 생성
        navigate("/reservation", { state: { reset: true } }); // reservation에 초기화 지시
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
                    onClick={() => navigate("/phonenumber")}
                >
                    조회하기
                </button>
            </div>
        </div>
    );
};

export default Start;
