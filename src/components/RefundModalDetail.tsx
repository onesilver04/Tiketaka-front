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
                    {/* History 페이지에서 선택한 티켓 환불하는 버튼 중 예: RefundSuccess 페이지로 이동 */}
                    <button
                        id="refundModalDetail-yes-to-RefundSuccess"
                        className={`${styles.button} refund-detail-yes`}
                        onClick={onConfirm}
                    >
                        예
                    </button>
                    {/* History 페이지에서 바로 선택한 티켓 환불하는 버튼 중 아니오. */}
                    <button
                        id="refundModalDetail-no-to-History"
                        className={`${styles.button} refund-detail-no`}
                        onClick={onCancel}
                    >
                        아니오
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RefundModalDetail;
