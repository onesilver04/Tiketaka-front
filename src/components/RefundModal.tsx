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
                    <button
                        className={`${styles.button} refund-yes`}
                        onClick={onConfirm}
                    >
                        예
                    </button>
                    <button
                        className={`${styles.button} refund-no`}
                        onClick={onCancel}
                    >
                        아니요
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RefundModal;
