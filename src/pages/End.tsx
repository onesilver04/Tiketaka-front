import { useNavigate } from "react-router-dom";
import logoMain from "../assets/lolgo_main.svg";
import styles from "../styles/Button.module.css";
import { markSessionCompleted } from "../utils/session";

const End = () => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        markSessionCompleted(); // 현재 세션 완료 처리
        navigate("/");
    };

    return (
        <div>
            <title>End</title>
            <div className="logo">
                <img src={logoMain} alt="main-logo" />
            </div>
            <div className="button-container">
                <button
                    className={`${styles.button} reservation`}
                    onClick={handleConfirm}
                >
                    확인
                </button>
                <div style={{ textAlign: "center" }}>
                    이용해 주셔서 감사합니다.
                </div>
            </div>
        </div>
    );
};

export default End;
