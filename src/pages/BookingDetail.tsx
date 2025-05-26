import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BookingDetail.css";
import styles from "../styles/Button.module.css";
import styleb from "../styles/Box.module.css";
import RefundModal from "../components/RefundModal";
import { addHistoryLog, updateHistorySession } from "../utils/session";
import axios from "axios";

interface RefundDetails {
    // 결제 정보 인터페이스
    reservationId: string;
    departure: string;
    arrival: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    passengerCount: {
        adult: number;
        senior: number;
        youth: number;
        total: number;
    };
    refundAmount: number;
    paymentMethod: {
        type: "card" | "kakao" | "mobile";
        cardNumber: string;
    };
}

interface LocationState {
    reservations: { reservationId: string }[];
}

const BookingDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as LocationState | null;
    const reservationId = locationState?.reservations?.[0]?.reservationId ?? "";

    const [refundDetails, setRefundDetails] = useState<RefundDetails | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    // ✅ 세션 ID를 백엔드에서 받아오기
useEffect(() => {
        const sessionRaw = localStorage.getItem("currentHistorySession");
        if (!sessionRaw) return;
        const session = JSON.parse(sessionRaw);
        setSessionId(session.sessionId);

        // 1. 백엔드 세션 상태 먼저 업데이트
        updateHistorySession({
            sessionId: session.sessionId,
            current_page: "BookingDetail",
        });

        // 2. 로그 기록 (이미 기록되었는지 확인 후)
        const alreadyLogged = session.logs?.some(
            (log: any) =>
                log.page === "BookingDetail" &&
                log.event === "navigate" &&
                log.target_id === "page-load"
        );

        if (!alreadyLogged) {
            addHistoryLog({
                sessionId: session.sessionId,
                page: "BookingDetail",
                event: "navigate",
                target_id: "page-load",
                tag: "system",
                text: "BookingDetail 페이지 도착",
            });
        }
    }, []);
// ✅ 환불 정보 조회 (결제 정보 포함)
useEffect(() => {
    if (!reservationId) return;

    axios
        .get(`http://localhost:3000/refunds/${reservationId}`)
        .then((res) => setRefundDetails(res.data))
        .catch((err) => {
            console.error("환불 정보 조회 실패:", err);
            setRefundDetails(null);
        });
}, [reservationId]);

// ✅ 페이지 방문 로그 기록
// useEffect(() => {
//     const sessionRaw = localStorage.getItem("currentHistorySession");
//     if (!sessionRaw) return;

//     const session = JSON.parse(sessionRaw);
//     const sessionId = session.sessionId;
//     const alreadyLogged = session.logs?.some(
//         (log: any) =>
//             log.page === "BookingDetail" &&
//             log.event === "navigate" &&
//             log.target_id === "page-load"
//     );

//     if (!alreadyLogged) {
//         addHistoryLog({
//             sessionId,
//             page: "BookingDetail",
//             event: "navigate",
//             target_id: "page-load",
//             tag: "system",
//             text: "BookingDetail 페이지 도착",
//             url: window.location.pathname,
//         });
//     }
// }, []);

const handleBack = () => navigate(-1);

const handleRefund = () => {
    if (sessionId) {
        addHistoryLog({
            sessionId,
            page: "BookingDetail",
            event: "click",
            target_id: "detail-to-refund",
            tag: "button",
            text: "bookingdetail에서 환불하기 버튼 클릭",
        });
    }
    setIsModalOpen(true);
};

const confirmRefund = () => {
    if (sessionId) {
        addHistoryLog({
            sessionId, // 백엔드에서 받은 세션 ID
            page: "RefundModal",
            event: "click",
            target_id: "refundModal-yes-to-success",
            tag: "button",
            text: "RefundModal에서 yes 클릭, 환불 성공",
        });

        updateHistorySession({
            sessionId, // 세션 상태 업데이트
            end_reason: "refund_success",
        });
    }

    // 백엔드 처리와 무관한 localStorage 삭제는 생략하거나 유지 방식 선택
    setIsModalOpen(false);
    navigate("/history/refund-success", {
        state: {
            reservations: [{ reservationId }], // 배열로 감싸야 RefundSuccess에서 map 가능
        },
    });
};

const cancelRefund = () => {
    if (sessionId) {
        addHistoryLog({
            sessionId,
            page: "RefundModal",
            event: "click",
            target_id: "refundModal-no-to-success",
            tag: "button",
            text: "RefundModal에서 no 클릭으로 환불 취소",
        });
    }
    setIsModalOpen(false);
};

return (
    <>
        <div
            className={`${styleb.box} detail-box ${
                isModalOpen ? "blurred" : ""
            }`}
        >
            <h3 className="page-title">티켓 상세 내역</h3>
            <hr className="page-title-bar" />

            {refundDetails && (
                <>
                    <div className="route-box">
                        <div className="route-detail">
                            <p>출발</p>
                            <p className="booking-detail-station">
                                {refundDetails.departure}역
                            </p>
                            <span>{refundDetails.departureTime}</span>
                        </div>
                        <span className="arrow">→</span>
                        <div className="route-detail">
                            <p>도착</p>
                            <p className="booking-detail-station">
                                {refundDetails.arrival}역
                            </p>
                            <span>{refundDetails.arrivalTime}</span>
                        </div>
                    </div>

                    <div className="passenger-info">
                        <p>
                            <strong>
                                총 인원 수: {refundDetails.passengerCount.total}
                                명
                            </strong>
                        </p>
                        <p>성인: {refundDetails.passengerCount.adult}</p>
                        <p>노약자: {refundDetails.passengerCount.senior}</p>
                        <p>어린이: {refundDetails.passengerCount.youth}</p>
                    </div>

                    <hr className="page-title-bar" />

                    <div className="price-info">
                        <strong>
                            총 환불액:{" "}
                            {refundDetails.refundAmount.toLocaleString()}원
                        </strong>
                    </div>

                    {refundDetails.paymentMethod.type === "card" ? (
                        <>
                            <p className="title-card-info">카드 정보</p>
                            <hr className="page-title-bar" />
                            <div className="card-number">
                                <p>카드 번호</p>
                                <p className="card-number-info">
                                    <strong>
                                        {refundDetails.paymentMethod.cardNumber.replace(
                                            /\d{4}$/,
                                            "****"
                                        )}
                                    </strong>
                                </p>
                            </div>
                        </>
                    ) : (
                        // 결제 수단이 카카오페이나 휴대폰 결제인 경우
                        <>
                            <p className="title-card-info">
                                {refundDetails.paymentMethod.type === "kakao"
                                    ? "카카오페이"
                                    : refundDetails.paymentMethod.type ===
                                      "mobile"
                                    ? "휴대폰 결제"
                                    : "결제 정보"}
                            </p>
                        </>
                    )}
                </>
            )}
        </div>

        <button
            id="detail-to-history"
            className={`${styles.button} detail-to-history`}
            onClick={handleBack}
        >
            이전
        </button>
        <button
            id="detail-to-refund"
            className={`${styles.button} detail-to-refund`}
            onClick={handleRefund}
        >
            환불하기
        </button>

        {isModalOpen && (
            <RefundModal onConfirm={confirmRefund} onCancel={cancelRefund} />
        )}
    </>
);
};

export default BookingDetail;
