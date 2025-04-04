// utils/session.ts
export const CURRENT_SESSION_KEY = "currentReservationSession";
export const RESERVATION_HISTORY_KEY = "reservationSessions";
// 조회용
export const HISTORY_SESSION_KEY = "currentHistorySession";
export const HISTORY_LOG_KEY = "historyLogs";

export const loadCurrentSession = () => {
    const session = localStorage.getItem(CURRENT_SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

export const markSessionCompleted = () => {
    const session = loadCurrentSession();
    if (!session) return;

    updateCurrentSession({ completed: true });
    localStorage.removeItem(CURRENT_SESSION_KEY);
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

// 조회용 세션 생성
export const createHistorySession = () => {
    const newSession = {
        sessionId: Date.now().toString(),
        purpose: "history",
        status: "active",
        // end_reason: "",
        current_page: "PhoneNumber",
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
        url: window.location.href,
        timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z"),
    };

    // 1. 현재 세션 객체에 로그 추가
    if (!session.logs) session.logs = [];
    session.logs.push(newLog);
    session.last_interaction = new Date().toISOString();

    // 2. 중복 없이 previous_pages 재생성
    const seen = new Set<string>();
    session.previous_pages = [];
    for (const log of session.logs) {
        if (log.page && !seen.has(log.page)) {
            seen.add(log.page);
            session.previous_pages.push(log.page);
        }
    }

    localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(session));

    // 3. logs_{sessionId} 키에도 별도 저장 (세션별 로그 추적용)
    const key = `logs_${sessionId}`;
    const existing = localStorage.getItem(key);
    const parsed = existing
        ? JSON.parse(existing)
        : {
              sessionId,
              purpose: "history",
              location: session.current_page || "unknown",
              logs: [],
          };

    parsed.logs.push(newLog);
    localStorage.setItem(key, JSON.stringify(parsed));
};

export const updateHistorySession = (updates: Partial<any>) => {
    const raw = localStorage.getItem(HISTORY_SESSION_KEY);
    if (!raw) return;

    const session = JSON.parse(raw);

    const updated = {
        ...session,
        ...updates,
        last_interaction: new Date().toISOString(),
    };

    // previous_pages는 addHistoryLog에서 관리하므로 이곳에서는 제외
    localStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(updated));
};
