import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoMain from "../assets/lolgo_main.svg";
import styles from "../styles/Button.module.css";
import {
    markSessionCompleted,
    updateReservationLogSession,
    addReservationLog,
} from "../utils/session";
// import axios from "axios";

const End = () => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState<string | null>(null);

    const logClick = (target_id: string, text: string, tag = "button") => {
        if (!sessionId) return;
        addReservationLog({
            sessionId,
            page: "End",
            event: "click",
            target_id,
            tag,
            text,
        });
    };

    useEffect(() => {
        const sessionRaw = localStorage.getItem("currentReservationLogSession");
        if (!sessionRaw) return;
        const session = JSON.parse(sessionRaw);
        const sid = session.sessionId;
        setSessionId(sid);

        // ✅ current_page 업데이트
        updateReservationLogSession({
            sessionId: sid,
            current_page: "End",
        });

        const alreadyLogged = session.logs?.some(
            (log: any) =>
                log.page === "End" &&
                log.event === "navigate" &&
                log.target_id === "page-load"
        );

        if (!alreadyLogged) {
            addReservationLog({
                sessionId: sid,
                page: "End",
                event: "navigate",
                target_id: "page-load",
                tag: "system",
                text: "End 페이지 도착",
            });
        }
    }, []);

    const handleConfirm = async () => {
        logClick("end-to-home", "확인 클릭 후 메인으로 이동");
        markSessionCompleted();
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
                    id="end-to-home"
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
