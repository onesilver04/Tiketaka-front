// [LLM] TakaBox 컴포넌트 - 사용자가 선택 가능한 질문 버튼을 제공하고, 선택 시 LLM 백엔드로 전송하는 UI 모듈

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLatestSessionLogs } from "../utils/session"; // [LLM] 현재 세션의 로그를 불러오는 유틸리티 함수
import "./TakaBox.css";
import axios from "axios";

interface Props {
    onClose: () => void;            // [LLM] 닫기 버튼 클릭 시 호출될 함수
    onSendQuestion: (payload: any) => void; // [LLM] 질문 전송 후 상위 컴포넌트에 전달할 콜백
}

const TakaBox = ({ onClose, onSendQuestion }: Props) => {
    const [isClosing, setIsClosing] = useState(false); // [LLM] 닫기 애니메이션 여부를 위한 상태
    const location = useLocation(); // [LLM] 현재 페이지 경로 정보를 가져오기 위한 훅

    // [LLM] 닫기 버튼 클릭 시 애니메이션 상태 변경
    const handleClose = () => {
        setIsClosing(true);
    };

    // [LLM] 닫기 애니메이션 후 onClose 콜백 실행
    useEffect(() => {
        if (isClosing) {
            const timeout = setTimeout(() => {
                onClose();
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [isClosing, onClose]);

    // [LLM] 질문 버튼 클릭 시 실행되는 함수
    const handleQuestionClick = async (questionText: string) => {
        const session = getLatestSessionLogs(); // [LLM] 가장 최근 세션 로그 가져오기
        if (!session) return;

        const payload = {
            question: questionText,
            data: {
                sessionId: session.sessionId,
                purpose: session.purpose, // [LLM] reservation | history | refund
                location: session.location || location.pathname.replace("/", "") || "unknown",
                logs: session.logs || [],
            },
        };

        try {
            // [LLM] 백엔드에 질문 전송
            await axios.post("http://localhost:3000/llm/ask", {
                sessionId: session.sessionId,
                question: questionText,
            });

            // [LLM] 질문 전송 후 부모 콜백 호출 및 닫기 애니메이션
            onSendQuestion(payload);
            setIsClosing(true);
        } catch (error) {
            console.error("LLM 질문 전송 실패:", error);
        }
    };

    // [LLM] 질문 UI 렌더링
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
                {/* [LLM] 향후 직접 입력 질문 기능 확장 가능 */}
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