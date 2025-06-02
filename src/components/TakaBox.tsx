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
        if (!session) return; // [LLM] 세션이 없으면 질문 전송 불가

        // [LLM] 백엔드에 전송할 페이로드 구성
        const payload = {
            question: questionText, // [LLM] 사용자가 선택한 질문
            data: {
                sessionId: session.sessionId,
                purpose: session.purpose, // [LLM] reservation | history | refund
                location: session.location || location.pathname.replace("/", "") || "unknown",
                logs: session.logs || [],
            },
        };

        try {
            // ✅ 백엔드에 POST 요청 보내기
            const response = await axios.post("http://localhost:3000/llm/ask", {
                sessionId: session.sessionId,
                question: questionText,
            });

            const data = response.data

            if (data.audio_url) {
                const audio = new Audio(data.audio_url);
                audio.play().catch((err) => {
                    console.error("오디오 재생 오류", err);
                });
            }
            // 요청 후 콜백 실행
            onSendQuestion(payload);
            setIsClosing(true);
        } catch (error) {
            console.error("LLM 질문 전송 실패:", error);
        }
    };

    // [LLM] 질문 UI 렌더링: 세 개의 기본 질문 버튼 + 닫기 버튼
    return (
        <div className={`taka-container ${isClosing ? "closing" : ""}`}>
            {/* [LLM] 닫기 버튼 (우측 상단) */}
            <button className="taka-close" onClick={handleClose}>
                ×
            </button>
            {/* [LLM] 질문 버튼 목록 */}
            <div className="taka-questions">
                {/* [LLM] 현재 페이지에서의 행동 지시 질문 */}
                <button
                    id="taka-question-1"
                    className="taka-question"
                    onClick={() => handleQuestionClick("현재 페이지에서는 무엇을 해야 해?")}
                >
                    현재 페이지에서는 무엇을 해야 해?
                </button>
                {/* [LLM] 앞으로 남은 단계가 무엇인지 질문 */}
                <button
                    id="taka-question-2"
                    className="taka-question"
                    onClick={() => handleQuestionClick("앞으로는 무슨 단계가 남아있어?")}
                >
                    앞으로는 무슨 단계가 남아있어?
                </button>
                {/* [LLM] 전체 예매/환불/조회 프로세스에 대한 설명 요청 */}
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

