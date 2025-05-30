// [LLM] 전화번호 입력 누락 경고 모달 - 전화번호가 입력되지 않았을 때 사용자에게 경고 메시지를 표시

import React from "react";
import styles from "../styles/Button.module.css";
import "./PhoneModal.css";

// [LLM] 모달 컴포넌트에 전달되는 props 타입 정의: 닫기 핸들러(onClose)
interface PhoneModalProps {
    onClose: () => void;
}

const PhoneModal: React.FC<PhoneModalProps> = ({ onClose }) => {
    return (
        // [LLM] 전체 모달을 감싸는 어두운 배경 오버레이
        <div className="modal-overlay">
            {/* [LLM] 모달 박스 - 경고 메시지 및 확인 버튼 포함 */}
            <div className="modal-box">
                <p>전화번호를 다 채워주세요!</p>
                {/* [LLM] '확인' 버튼 - 모달을 닫기 위해 onClose 호출 */}
                <button
                    className={`${styles.button} phonemodal-ok`}
                    onClick={onClose}
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default PhoneModal;
