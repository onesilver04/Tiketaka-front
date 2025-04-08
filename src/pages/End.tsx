import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoMain from "../assets/lolgo_main.svg";
import styles from "../styles/Button.module.css";
import {
    markSessionCompleted,
    updateReservationLogSession,
    addReservationLog,
} from "../utils/session";

const End = () => {
    const navigate = useNavigate();

    const sessionId = (() => {
        try {
            return JSON.parse(
                localStorage.getItem("currentReservationLogSession") || "null"
            )?.sessionId;
        } catch {
            return null;
        }
    })();

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
        if (sessionId) {
            updateReservationLogSession({
                location: "End",
                previous_pages: ["Payment"],
            });

            const sessionRaw = localStorage.getItem(
                "currentReservationLogSession"
            );
            if (sessionRaw) {
                const session = JSON.parse(sessionRaw);
                const alreadyLogged = session.logs?.some(
                    (log: { page: string; event: string; target_id: string }) =>
                        log.page === "End" &&
                        log.event === "navigate" &&
                        log.target_id === "page-load"
                ); // ts에서 any 쓰는 건 ts의 장점을 해치는거고, any 자체에 자꾸 오류나니까 type 위에 처럼 바꿈. 이상하면 다시 log: any로 변경ㄱㄱ

                if (!alreadyLogged) {
                    addReservationLog({
                        sessionId,
                        page: "End",
                        event: "navigate",
                        target_id: "page-load",
                        tag: "system",
                        text: "End 페이지 도착",
                    });
                }
            }
        }
    }, [sessionId]);

    const handleConfirm = () => {
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
