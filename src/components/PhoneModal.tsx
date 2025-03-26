import React from "react";
import styles from "../styles/Button.module.css";
import "./PhoneModal.css";

interface PhoneModalProps {
    onClose: () => void;
}

const PhoneModal: React.FC<PhoneModalProps> = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>전화번호를 다 채워주세요!</p>
                <button className={`${styles.button} ok`} onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
};

export default PhoneModal;
