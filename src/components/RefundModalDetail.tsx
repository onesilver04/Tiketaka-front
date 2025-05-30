// [LLM] 환불 확인 모달 - 사용자에게 환불 여부를 묻는 간단한 확인 창 UI

import React from "react";
import "../styles/RefundModalDetail.css";
import styles from "../styles/Button.module.css";

// [LLM] 컴포넌트에 전달되는 props 정의: 환불 확인(onConfirm), 취소(onCancel)
interface Props {
    onConfirm: () => void;
    onCancel: () => void;
}

const RefundModalDetail: React.FC<Props> = ({ onConfirm, onCancel }) => {
    return (
        // [LLM] 모달 외부 오버레이 (어두운 배경)
        <div className="modal-overlay">
            {/* [LLM] 환불 확인 메시지와 버튼이 포함된 모달 박스 */}
            <div className="modal-box">
                <p>
                    선택한 항목을 <br /> 정말 환불 하시겠습니까?
                </p>
                {/* [LLM] 버튼 영역 - '예'와 '아니오' */}
                <div className="modal-buttons">
                    {/* [LLM] '예' 버튼 - 환불 확정 로직 실행, RefundSuccess 페이지로 이동 예정 */}
                    <button
                        id="refundModalDetail-yes-to-RefundSuccess"
                        className={`${styles.button} refund-detail-yes`}
                        onClick={onConfirm}
                    >
                        예
                    </button>
                    {/* [LLM] '아니오' 버튼 - 환불 취소, History 페이지로 복귀 */}
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