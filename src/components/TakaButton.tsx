// [LLM] TakaButton 컴포넌트 - 사용자가 TakaButton을 눌러 질문창(TakaBox)을 열 수 있는 UI 제공
import { useState } from "react";
import takaIcon from "../assets/taka.svg";
import TakaBox from "./TakaBox";
import "./TakaButton.css";

const TakaButton = () => {
    // [LLM] TakaBox 표시 여부를 관리하는 상태 변수
    const [showBox, setShowBox] = useState(false);

    // [LLM] 질문 전송 시 payload 로그 출력 (후속 처리 목적)
    const handleSendQuestion = (payload: any) => {
        console.log("타카 질문 payload:", payload);
    };

    return (
        <>
            {/* [LLM] showBox가 true일 때 질문창 렌더링 */}
            {showBox && (
                <TakaBox
                    onClose={() => setShowBox(false)}
                    onSendQuestion={handleSendQuestion}
                />
            )}

            {/* [LLM] 화면 우측 하단의 타카 버튼 UI */}
            <div className="taka-wrapper">
                <button
                    id="taka-button"
                    className="taka-button"
                    onClick={() => setShowBox(true)} // [LLM] 버튼 클릭 시 질문창 오픈
                >
                    <img src={takaIcon} alt="Taka Icon" className="taka-icon" />
                </button>
            </div>
        </>
    );
};

export default TakaButton;
