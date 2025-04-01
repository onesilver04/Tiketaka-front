import React from "react";
import "../styles/RefundModalDetail.css";
import styles from "../styles/Button.module.css";

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
}

const RefundModalDetail: React.FC<Props> = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>
                    선택한 항목을 <br /> 정말 환불 하시겠습니까?
                </p>
                <div className="modal-buttons">
                    <button
                        className={`${styles.button} refund-detail-yes`}
                        onClick={onConfirm}
                    >
                        예
                    </button>
                    <button
                        className={`${styles.button} refund-detail-no`}
                        onClick={onCancel}
                    >
                        아니요
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RefundModalDetail;
