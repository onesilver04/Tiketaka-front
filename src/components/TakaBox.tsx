import { useEffect, useState } from "react";
import "./TakaBox.css";

interface Props {
    onClose: () => void; // 부모가 상태 제거
}

const TakaBox = ({ onClose }: Props) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true); // 슬라이드 다운 시작
    };

    useEffect(() => {
        if (isClosing) {
            const timeout = setTimeout(() => {
                onClose(); // 부모에서 제거
            }, 300); // slideDown과 맞춤
            return () => clearTimeout(timeout);
        }
    }, [isClosing, onClose]);

    return (
        <div className={`taka-container ${isClosing ? "closing" : ""}`}>
            <button className="taka-close" onClick={handleClose}>
                ×
            </button>
            <div className="taka-questions">
                <button className="taka-question">
                    현재 페이지에서는 무엇을 해야 해?
                </button>
                <button className="taka-question">
                    앞으로는 무슨 단계가 남아있어?
                </button>
                <button className="taka-question">전체 과정을 알려줘</button>
            </div>
        </div>
    );
};

export default TakaBox;
