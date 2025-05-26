import axios from "axios";

// ✅ 키 상수 정의
export const CURRENT_SESSION_KEY = "currentReservationSession";
export const RESERVATION_HISTORY_KEY = "reservationSessions";
export const HISTORY_SESSION_KEY = "currentHistorySession";
export const HISTORY_SESSIONS_KEY = "historySessions";
export const RESERVATION_LOG_SESSION_KEY = "currentReservationLogSession";
export const RESERVATION_LOG_SESSIONS_KEY = "reservationLogSessions";

// ✅ 가장 최근 세션 로그 반환
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
    if (reservation && history) {
        return new Date(reservation.last_interaction) > new Date(history.last_interaction)
            ? reservation
            : history;
    }
    return reservation || history;
};

// ✅ 예매 세션 로컬 생성
export const createNewSession = () => {
    const sessionList = JSON.parse(localStorage.getItem(RESERVATION_HISTORY_KEY) || "[]");
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
    const history = JSON.parse(localStorage.getItem(RESERVATION_HISTORY_KEY) || "[]");
    const index = history.findIndex((item: any) => item.id === current.id);
    if (index !== -1) {
        history[index] = updated;
        localStorage.setItem(RESERVATION_HISTORY_KEY, JSON.stringify(history));
    }
};

// ✅ 예매 세션 종료
export const markSessionCompleted = async () => {
    const session = getCurrentSession();
    if (!session) return;
    updateCurrentSession({ completed: true });
    localStorage.removeItem(CURRENT_SESSION_KEY);
    localStorage.removeItem(RESERVATION_LOG_SESSION_KEY);

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

// ✅ 히스토리 세션 종료
export const markHistorySessionCompleted = async ({
    end_reason,
    current_page = "Header",
}: {
    end_reason: "history_completed" | "history_abandoned" | "refund_completed" | "refund_abandoned";
    current_page?: string;
}) => {
    const raw = localStorage.getItem(HISTORY_SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw);
    const sessionId = session.sessionId;
    session.status = "completed";
    session.end_reason = end_reason;
    session.current_page = current_page;
    session.last_interaction = new Date().toISOString();
    localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(session));
    const sessions = JSON.parse(localStorage.getItem(HISTORY_SESSIONS_KEY) || "[]");
    const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
    if (index !== -1) sessions[index] = session;
    else sessions.push(session);
    localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(sessions));
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
    localStorage.removeItem(HISTORY_SESSION_KEY);
};

// ✅ 히스토리 세션 상태 업데이트
export const updateHistorySession = async (updates: Partial<any>) => {
    const raw = localStorage.getItem(HISTORY_SESSION_KEY);
    const now = new Date().toISOString();

    let session: any;
    if (raw) {
        session = JSON.parse(raw);
    } else if (updates.sessionId) {
        session = {
            sessionId: updates.sessionId,
            status: "active",
            purpose: "history",
            current_page: updates.current_page ?? "unknown",
            start_time: now,
            last_interaction: now,
            previous_pages: [],
            logs: [],
        };
    } else {
        return;
    }

    const sessionId = session.sessionId;

    const patchPayload: {
        sessionId: string;
        current_page?: string;
        newPurpose?: "refund";
    } = { sessionId };

    if (updates.current_page) patchPayload.current_page = updates.current_page;
    if (updates.newPurpose) patchPayload.newPurpose = updates.newPurpose;

    try {
        const response = await axios.patch("http://localhost:3000/sessions/update", patchPayload);
        const updated = response.data;

        localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(updated));
        const sessions = JSON.parse(localStorage.getItem(HISTORY_SESSIONS_KEY) || "[]");
        const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
        if (index !== -1) sessions[index] = updated;
        else sessions.push(updated);
        localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error("히스토리 세션 업데이트 실패:", error);

        const updated = {
            ...session,
            ...updates,
            last_interaction: now,
        };
        localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(updated));
    }
};

// ✅ 히스토리 로그 추가
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
        page, event, target_id, tag, text,
        url: url ?? window.location.pathname,
        timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z"),
    };
    session.logs = [...(session.logs || []), newLog];
    session.last_interaction = new Date().toISOString();
    const seen = new Set<string>();
    session.previous_pages = [];
    for (const log of session.logs) {
        if (!seen.has(log.page)) {
            seen.add(log.page);
            session.previous_pages.push(log.page);
        }
    }
    localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(session));
    const sessions = JSON.parse(localStorage.getItem(HISTORY_SESSIONS_KEY) || "[]");
    const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
    if (index !== -1) sessions[index] = session;
    else sessions.push(session);
    localStorage.setItem(HISTORY_SESSIONS_KEY, JSON.stringify(sessions));
    axios.post("http://localhost:3000/logs", {
        sessionId, location: page, event, target_id, tag, url: url ?? window.location.href, text,
    }).catch((err) => console.error("History 로그 전송 실패:", err));
};

// ✅ 예매 로그 추가
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
        page, event, target_id, tag, text,
        url: url ?? window.location.pathname,
        timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z"),
    };
    session.logs = [...(session.logs || []), newLog];
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
    const sessions = JSON.parse(localStorage.getItem(RESERVATION_LOG_SESSIONS_KEY) || "[]");
    const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
    if (index !== -1) sessions[index] = session;
    else sessions.push(session);
    localStorage.setItem(RESERVATION_LOG_SESSIONS_KEY, JSON.stringify(sessions));
    axios.post("http://localhost:3000/logs", {
        sessionId, location: page, event, target_id, tag, url: url ?? window.location.href, text,
    }).catch((err) => console.error("Reservation 로그 전송 실패:", err));
};

// ✅ 예매 세션 상태 업데이트
export const updateReservationLogSession = async (updates: Partial<any>) => {
    const raw = localStorage.getItem(RESERVATION_LOG_SESSION_KEY);
    const now = new Date().toISOString();

    let session: any;
    if (raw) {
        session = JSON.parse(raw);
    } else if (updates.sessionId) {
        // 새 세션 초기화
        session = {
            sessionId: updates.sessionId,
            status: "active",
            purpose: "reservation",
            current_page: updates.current_page ?? "unknown",
            start_time: now,
            last_interaction: now,
            previous_pages: [],
            logs: [],
        };
    } else {
        return; // sessionId가 없으면 아무것도 못함
    }

    const sessionId = session.sessionId;

    const patchPayload: {
        sessionId: string;
        current_page?: string;
        newPurpose?: "refund";
    } = {
        sessionId,
        current_page: updates.current_page ?? session.current_page,
    };

    if (updates.newPurpose) patchPayload.newPurpose = updates.newPurpose;

    try {
        const response = await axios.patch("http://localhost:3000/sessions/update", patchPayload);
        const updated = response.data;

        localStorage.setItem(RESERVATION_LOG_SESSION_KEY, JSON.stringify(updated));

        const sessions = JSON.parse(localStorage.getItem(RESERVATION_LOG_SESSIONS_KEY) || "[]");
        const index = sessions.findIndex((s: any) => s.sessionId === sessionId);
        if (index !== -1) sessions[index] = updated;
        else sessions.push(updated);
        localStorage.setItem(RESERVATION_LOG_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error("세션 업데이트 실패:", error);

        const updated = {
            ...session,
            ...updates,
            last_interaction: now,
        };
        localStorage.setItem(RESERVATION_LOG_SESSION_KEY, JSON.stringify(updated));
    }
};
