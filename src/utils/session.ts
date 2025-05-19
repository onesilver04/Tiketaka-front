// utils/session.ts
export const CURRENT_SESSION_KEY = "currentReservationSession";
export const RESERVATION_HISTORY_KEY = "reservationSessions";
export const HISTORY_SESSION_KEY = "currentHistorySession";
export const HISTORY_SESSIONS_KEY = "historySessions";
import axios from "axios";

// Get the current session logs-LM 정보 넘기기
export const getLatestSessionLogs = (): {
    sessionId: string;
    purpose: string;
    location: string;
    logs: any[];
} | null => {
    const reservationRaw = localStorage.getItem(RESERVATION_LOG_SESSION_KEY);
    const historyRaw = localStorage.getItem(HISTORY_SESSION_KEY);

    const reservation = reservationRaw ? JSON.parse(reservationRaw) : null;
    const history = historyRaw ? JSON.parse(historyRaw) : null;

    if (!reservation && !history) return null;

    // 둘 다 있을 경우 마지막 상호작용 기준
    if (reservation && history) {
        return new Date(reservation.last_interaction) > new Date(history.last_interaction)
            ? {
                    sessionId: reservation.sessionId,
                    purpose: reservation.purpose,
                    location: reservation.location,
                    logs: reservation.logs,
            }
            : {
                    sessionId: history.sessionId,
                    purpose: history.purpose,
                    location: history.location,
                    logs: history.logs,
            };
    }

    // 하나만 있는 경우
    if (reservation) {
        return {
            sessionId: reservation.sessionId,
            purpose: reservation.purpose,
            location: reservation.location,
            logs: reservation.logs,
        };
    }

    if (history) {
        return {
            sessionId: history.sessionId,
            purpose: history.purpose,
            location: history.location,
            logs: history.logs,
        };
    }

    return null;
};

export const loadCurrentSession = () => {
    const session = localStorage.getItem(CURRENT_SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

// "예매" 성공적으로 완료 후 세션 종료
export const markSessionCompleted = async () => {
    const session = loadCurrentSession();
    if (!session) return;

    updateCurrentSession({ completed: true });
    localStorage.removeItem(CURRENT_SESSION_KEY);

    // ✅ 예약 세션 로그 종료를 서버에 전송
    const sessionId = session.sessionId || session.id?.toString?.();
    if (!sessionId) return;

    try {
        await axios.patch("http://localhost:3000/sessions/end", {
            sessionId,
            status: "completed",
            end_reason: "booking_completed",
            current_page: "end",
        });
    } catch (error) {
        console.error("세션 종료 요청 실패:", error);
    }
};

// histyory 세션 종료
export const markHistorySessionCompleted = async ({
    end_reason,
    current_page = "Header",
}: {
    end_reason: "history_completed" | "history_abandoned" | "refund_completed" | "refund_abandoned";
    current_page?: string;
}) => {
    const raw = localStorage.getItem("currentHistorySession");
    if (!raw) return;

    const session = JSON.parse(raw);
    const sessionId = session.sessionId;

    // 로컬 세션 업데이트
    session.status = "completed";
    session.end_reason = end_reason;
    session.current_page = current_page;
    session.last_interaction = new Date().toISOString();
    localStorage.setItem("currentHistorySession", JSON.stringify(session));

    const sessions = JSON.parse(localStorage.getItem("historySessions") || "[]");
    const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
    if (index !== -1) {
        sessions[index] = session;
    } else {
        sessions.push(session);
    }
    localStorage.setItem("historySessions", JSON.stringify(sessions));

    // 백엔드로 종료 전송
    try {
        await axios.patch("http://localhost:3000/sessions/end", {
            sessionId,
            status: "completed",
            end_reason,
            current_page,
        });
    } catch (err) {
        console.error("히스토리 세션 종료 실패:", err);
    }

    // localStorage에서 삭제
    localStorage.removeItem("currentHistorySession");
};


export const createNewSession = () => {
    const sessionList = JSON.parse(
        localStorage.getItem(RESERVATION_HISTORY_KEY) || "[]"
    );

    const newSession = {
        id: Date.now(),
        reservationData: null,
        trainInfo: null,
        selectedSeats: null,
        paymentInfo: null,
        createdAt: new Date().toISOString(),
        completed: false,
    };

    sessionList.push(newSession);
    localStorage.setItem(RESERVATION_HISTORY_KEY, JSON.stringify(sessionList));
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(newSession));
};

export const getCurrentSession = () => {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
};

export const updateCurrentSession = (updates: Partial<any>) => {
    const current = getCurrentSession();
    if (!current) return;

    const updated = { ...current, ...updates };
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updated));

    const history = JSON.parse(
        localStorage.getItem(RESERVATION_HISTORY_KEY) || "[]"
    );
    const index = history.findIndex((item: any) => item.id === current.id);
    if (index !== -1) {
        history[index] = updated;
        localStorage.setItem(RESERVATION_HISTORY_KEY, JSON.stringify(history));
    }
};

export const createHistorySession = () => {
    const prev = localStorage.getItem(HISTORY_SESSION_KEY);
    if (prev) {
        try {
            const prevSession = JSON.parse(prev);
            if (prevSession.status === "active") {
                prevSession.status = "incomplete";
                if (!prevSession.end_reason) {
                    prevSession.end_reason = null;
                }

                const sessionList = JSON.parse(
                    localStorage.getItem(HISTORY_SESSIONS_KEY) || "[]"
                );
                const index = sessionList.findIndex(
                    (s: any) => s.sessionId === prevSession.sessionId
                );
                if (index !== -1) {
                    sessionList[index] = prevSession;
                } else {
                    sessionList.push(prevSession);
                }
                localStorage.setItem(
                    HISTORY_SESSIONS_KEY,
                    JSON.stringify(sessionList)
                );
            }
        } catch {}
    }

    const newSession = {
        sessionId: Date.now().toString(),
        purpose: "history",
        status: "active",
        end_reason: null,
        location: "Start",
        start_time: new Date().toISOString(),
        last_interaction: new Date().toISOString(),
        previous_pages: [],
        logs: [],
    };

    localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(newSession));
    return newSession.sessionId;
};

export const addHistoryLog = ({
    sessionId,
    page,
    event,
    target_id,
    tag,
    url,
    text,
}: {
    sessionId: string;
    page: string;
    event: "click" | "navigate" | "submit";
    target_id: string;
    tag: string;
    url?: string;
    text: string;
}) => {
    const raw = localStorage.getItem(HISTORY_SESSION_KEY);
    if (!raw) return;

    const session = JSON.parse(raw);
    if (session.sessionId !== sessionId) return;

    const newLog = {
        page,
        event,
        target_id,
        tag,
        text,
        url: url ?? window.location.pathname,
        timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z"),
    };

    if (!session.logs) session.logs = [];
    session.logs.push(newLog);
    session.last_interaction = new Date().toISOString();

    const seen = new Set<string>();
    session.previous_pages = [];
    for (const log of session.logs) {
        if (log.page && !seen.has(log.page)) {
            seen.add(log.page);
            session.previous_pages.push(log.page);
        }
    }

    localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(session));

    const sessions = JSON.parse(
        localStorage.getItem(HISTORY_SESSIONS_KEY) || "[]"
    );
    const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
    if (index !== -1) {
        sessions[index] = session;
    } else {
        sessions.push(session);
    }
    localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(sessions));

    // ✅ 백엔드 로그 전송
    axios
        .post("http://localhost:3000/logs", {
            sessionId,
            location: page,
            event,
            target_id,
            tag,
            url: url ?? window.location.href,
            text,
        })
        .catch((err) => {
            console.error("History 로그 전송 실패:", err);
        });
};

export const updateHistorySession = async (updates: Partial<any>) => {
    const raw = localStorage.getItem(HISTORY_SESSION_KEY);
    if (!raw) return;

    const session = JSON.parse(raw);
    const sessionId = session.sessionId;

    // ✅ PATCH 요청에 사용할 데이터 구성
    const patchPayload: {
        sessionId: string;
        current_page?: string;
        newPurpose?: "refund";
    } = {
        sessionId,
    };

    if (updates.current_page) patchPayload.current_page = updates.current_page;
    if (updates.newPurpose) patchPayload.newPurpose = updates.newPurpose;

    try {
        const response = await axios.patch("http://localhost:3000/sessions/update", patchPayload);
        const updatedFromServer = response.data;

        // ✅ 응답 데이터를 localStorage에 반영
        localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(updatedFromServer));

        const sessions = JSON.parse(
            localStorage.getItem(HISTORY_SESSIONS_KEY) || "[]"
        );
        const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
        if (index !== -1) {
            sessions[index] = updatedFromServer;
        } else {
            sessions.push(updatedFromServer);
        }
        localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error("히스토리 세션 PATCH 실패:", error);

        // ✅ 실패 시 기존 방식대로 local 업데이트
        const updated = {
            ...session,
            ...updates,
            last_interaction: new Date().toISOString(),
        };

        localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(updated));

        const sessions = JSON.parse(
            localStorage.getItem(HISTORY_SESSIONS_KEY) || "[]"
        );
        const index = sessions.findIndex((s: any) => s.sessionId === updated.sessionId);
        if (index !== -1) {
            sessions[index] = updated;
        } else {
            sessions.push(updated);
        }
        localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(sessions));
    }

    // const updated = {
    //     ...session,
    //     ...updates,
    //     last_interaction: new Date().toISOString(),
    // };

    // localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(updated));

    // const sessions = JSON.parse(
    //     localStorage.getItem(HISTORY_SESSIONS_KEY) || "[]"
    // );
    // const index = sessions.findIndex(
    //     (s: any) => s.sessionId === updated.sessionId
    // );
    // if (index !== -1) {
    //     sessions[index] = updated;
    // } else {
    //     sessions.push(updated);
    // }
    // localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(sessions));
};

export const RESERVATION_LOG_SESSION_KEY = "currentReservationLogSession";
export const RESERVATION_LOG_SESSIONS_KEY = "reservationLogSessions";

export const createReservationLogSession = () => {
    const newSession = {
        sessionId: Date.now().toString(),
        purpose: "reservation",
        status: "active",
        location: "Reservation",
        start_time: new Date().toISOString(),
        last_interaction: new Date().toISOString(),
        previous_pages: [],
        logs: [],
    };

    localStorage.setItem(
        RESERVATION_LOG_SESSION_KEY,
        JSON.stringify(newSession)
    );

    const sessionList = JSON.parse(
        localStorage.getItem(RESERVATION_LOG_SESSIONS_KEY) || "[]"
    );
    sessionList.push(newSession);
    localStorage.setItem(
        RESERVATION_LOG_SESSIONS_KEY,
        JSON.stringify(sessionList)
    );

    return newSession.sessionId;
};

export const addReservationLog = ({
    sessionId,
    page,
    event,
    target_id,
    tag,
    url,
    text,
}: {
    sessionId: string;
    page: string;
    event: "click" | "navigate" | "submit";
    target_id: string;
    tag: string;
    url?: string;
    text: string;
}) => {
    const raw = localStorage.getItem(RESERVATION_LOG_SESSION_KEY);
    if (!raw) return;

    const session = JSON.parse(raw);
    if (session.sessionId !== sessionId) return;

    const newLog = {
        page,
        event,
        target_id,
        tag,
        text,
        url: url ?? window.location.pathname,
        timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z"),
    };

    if (!session.logs) session.logs = [];
    session.logs.push(newLog);
    session.last_interaction = new Date().toISOString();

    const seen = new Set<string>();
    session.previous_pages = [];
    for (const log of session.logs) {
        if (!seen.has(log.page)) {
            seen.add(log.page);
            session.previous_pages.push(log.page);
        }
    }

    localStorage.setItem(RESERVATION_LOG_SESSION_KEY, JSON.stringify(session));

    const sessions = JSON.parse(
        localStorage.getItem(RESERVATION_LOG_SESSIONS_KEY) || "[]"
    );
    const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
    if (index !== -1) {
        sessions[index] = session;
    } else {
        sessions.push(session);
    }
    localStorage.setItem(
        RESERVATION_LOG_SESSIONS_KEY,
        JSON.stringify(sessions)
    );

    // ✅ 백엔드 로그 전송
    axios
        .post("http://localhost:3000/logs", {
            sessionId,
            location: page,
            event,
            target_id,
            tag,
            url: url ?? window.location.href,
            text,
        })
        .catch((err) => {
            console.error("Reservation 로그 전송 실패:", err);
        });
};

// session 상태 갱신
export const updateReservationLogSession = async (updates: Partial<any>) => {
    const raw = localStorage.getItem(RESERVATION_LOG_SESSION_KEY);
    if (!raw) return;

    const session = JSON.parse(raw);
    const sessionId = session.sessionId;

    // ✅ PATCH 요청에 사용할 데이터 추출
    const patchPayload: {
        sessionId: string;
        current_page?: string;
        newPurpose?: "refund";
    } = {
        sessionId,
    };

    if (updates.current_page) patchPayload.current_page = updates.current_page;
    if (updates.newPurpose) patchPayload.newPurpose = updates.newPurpose;

    try {
        const response = await axios.patch("http://localhost:3000/sessions/update", patchPayload);
        const updatedFromServer = response.data;

        // ✅ 서버 응답 기준으로 localStorage 업데이트
        localStorage.setItem(RESERVATION_LOG_SESSION_KEY, JSON.stringify(updatedFromServer));

        const sessions = JSON.parse(
            localStorage.getItem(RESERVATION_LOG_SESSIONS_KEY) || "[]"
        );
        const index = sessions.findIndex(
            (s: any) => s.sessionId === sessionId
        );
        if (index !== -1) {
            sessions[index] = updatedFromServer;
        } else {
            sessions.push(updatedFromServer);
        }
        localStorage.setItem(
            RESERVATION_LOG_SESSIONS_KEY,
            JSON.stringify(sessions)
        );
    } catch (error) {
        console.error("세션 업데이트 백엔드 전송 실패:", error);

        // ✅ 실패 시 기존 방식으로 local 업데이트만 수행
        const updated = {
            ...session,
            ...updates,
            last_interaction: new Date().toISOString(),
        };

        localStorage.setItem(RESERVATION_LOG_SESSION_KEY, JSON.stringify(updated));

        const sessions = JSON.parse(
            localStorage.getItem(RESERVATION_LOG_SESSIONS_KEY) || "[]"
        );
        const index = sessions.findIndex(
            (s: any) => s.sessionId === updated.sessionId
        );
        if (index !== -1) {
            sessions[index] = updated;
        } else {
            sessions.push(updated);
        }
        localStorage.setItem(
            RESERVATION_LOG_SESSIONS_KEY,
            JSON.stringify(sessions)
        );
    }

    // const updated = {
    //     ...session,
    //     ...updates,
    //     last_interaction: new Date().toISOString(),
    // };

    // localStorage.setItem(RESERVATION_LOG_SESSION_KEY, JSON.stringify(updated));

    // const sessions = JSON.parse(
    //     localStorage.getItem(RESERVATION_LOG_SESSIONS_KEY) || "[]"
    // );
    // const index = sessions.findIndex(
    //     (s: any) => s.sessionId === updated.sessionId
    // );
    // if (index !== -1) {
    //     sessions[index] = updated;
    // } else {
    //     sessions.push(updated);
    // }
    // localStorage.setItem(
    //     RESERVATION_LOG_SESSIONS_KEY,
    //     JSON.stringify(sessions)
    // );
};

