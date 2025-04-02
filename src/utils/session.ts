// utils/session.ts
export const CURRENT_SESSION_KEY = "currentReservationSession";
export const RESERVATION_HISTORY_KEY = "reservationSessions";

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