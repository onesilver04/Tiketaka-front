// [LLM] 환불 확인 모달 (BookingDetail용) - 사용자에게 환불 여부를 묻는 간단한 확인창 UI

import React from "react";
import "../styles/RefundModal.css";
import styles from "../styles/Button.module.css";

// [LLM] 컴포넌트에 전달되는 props: onConfirm (예 클릭 시 실행), onCancel (아니오 클릭 시 실행)
interface Props {
    onConfirm: () => void;
    onCancel: () => void;
}

const RefundModal: React.FC<Props> = ({ onConfirm, onCancel }) => {
    return (
        // [LLM] 모달 외부의 어두운 배경
        <div className="modal-overlay">
            {/* [LLM] 모달 내부 박스 - 환불 메시지와 버튼 포함 */}
            <div className="modal-box">
                <p>정말 환불 하시겠습니까?</p>
                {/* [LLM] 버튼 영역 - 예/아니오 */}
                <div className="modal-buttons">
                    {/* [LLM] '예' 버튼 - RefundSuccess 페이지로 이동하는 onConfirm 호출 */}
                    <button
                        id="refundModal-yes-to-success"
                        className={`${styles.button} refund-yes`}
                        onClick={onConfirm}
                    >
                        예
                    </button>
                    {/* [LLM] '아니오' 버튼 - 이전 페이지 (BookingDetail 등)으로 복귀 */}
                    <button
                        id="refundModal-no-to-bookingDetail"
                        className={`${styles.button} refund-no`}
                        onClick={onCancel}
                    >
                        아니오
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RefundModal;
