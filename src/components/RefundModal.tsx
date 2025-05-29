import React from "react";
import "../styles/RefundModal.css";
import styles from "../styles/Button.module.css";

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
}

const RefundModal: React.FC<Props> = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>정말 환불 하시겠습니까?</p>
                <div className="modal-buttons">
                    {/* refundModal창에서 예 버튼 클릭 시 RefundSuccess 페이지로 이동하는 버튼 */}
                    <button
                        id="refundModal-yes-to-success"
                        className={`${styles.button} refund-yes`}
                        onClick={onConfirm}
                    >
                        예
                    </button>
                    {/* refundModal창에서 아니오 버튼 클릭 시 BookingDetail페이지 */}
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
