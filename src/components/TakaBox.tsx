import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLatestSessionLogs } from "../utils/session"; // 세션 로그 불러오기 유틸 추가 필요
import "./TakaBox.css";
import axios from "axios";

interface Props {
    onClose: () => void;
    onSendQuestion: (payload: any) => void; // 질문 클릭 시 payload 전달
}

const TakaBox = ({ onClose, onSendQuestion }: Props) => {
    const [isClosing, setIsClosing] = useState(false);
    const location = useLocation();

    const handleClose = () => {
        setIsClosing(true);
    };

    useEffect(() => {
        if (isClosing) {
            const timeout = setTimeout(() => {
                onClose();
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [isClosing, onClose]);

    const handleQuestionClick = async (questionText: string) => {
        const session = getLatestSessionLogs();
        if (!session) return;

        const payload = { // json 형태로 변환
            question: questionText,
            data: {
                sessionId: session.sessionId,
                purpose: session.purpose, // reservation | history | refund
                location: session.location || location.pathname.replace("/", "") || "unknown",
                logs: session.logs || [],
            },
        };

        try {
            // ✅ 백엔드에 POST 요청 보내기
            await axios.post("http://localhost:3000/llm/ask", {
                sessionId: session.sessionId,
                question: questionText,
            });

            // 요청 후 콜백 실행
            onSendQuestion(payload);
            setIsClosing(true);
        } catch (error) {
            console.error("LLM 질문 전송 실패:", error);
        }
    };

    return (
        <div className={`taka-container ${isClosing ? "closing" : ""}`}>
            <button className="taka-close" onClick={handleClose}>
                ×
            </button>
            <div className="taka-questions">
                <button
                    id="taka-question-1"
                    className="taka-question"
                    onClick={() => handleQuestionClick("현재 페이지에서는 무엇을 해야 해?")}
                >
                    현재 페이지에서는 무엇을 해야 해?
                </button>
                <button
                    id="taka-question-2"
                    className="taka-question"
                    onClick={() => handleQuestionClick("앞으로는 무슨 단계가 남아있어?")}
                >
                    앞으로는 무슨 단계가 남아있어?
                </button>
                <button
                    id="taka-question-3"
                    className="taka-question"
                    onClick={() => handleQuestionClick("전체 과정을 알려줘")}
                >
                    전체 과정을 알려줘
                </button>
                {/* 타카 질문 밑에 입력창 */}
                {/* <div className="taka-question-input-wrapper">
                    <input
                        type="text"
                        className="taka-question-input"
                        placeholder="질문을 입력하세요"
                    />
                    <button className="taka-question-input-button">입력</button>
                </div> */}
            </div>
        </div>
    );
};

export default TakaBox;
