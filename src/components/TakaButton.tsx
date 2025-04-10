import React, { useState } from "react";
import takaIcon from "../assets/taka.svg";
import TakaBox from "./TakaBox";
import "./TakaButton.css";

const TakaButton = () => {
    const [showBox, setShowBox] = useState(false);

    const handleSendQuestion = (payload: any) => {
        console.log("타카 질문 payload:", payload);
    };

    return (
        <>
            {showBox && <TakaBox onClose={() => setShowBox(false)} onSendQuestion={handleSendQuestion}/>}
            <div className="taka-wrapper">
                <button
                    className="taka-button"
                    onClick={() => setShowBox(true)}
                >
                    <img src={takaIcon} alt="Taka Icon" className="taka-icon" />
                </button>
            </div>
        </>
    );
};

export default TakaButton;
