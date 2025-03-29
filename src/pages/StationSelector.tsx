import React from "react";
import "../styles/StationSelector.css";

interface Props {
    stations: string[];
    onSelect: (station: string) => void;
}

const StationSelector: React.FC<Props> = ({ stations, onSelect }) => {
    return (
        <div className="station-popup">
        <div className="station-popup-title">역명</div>
        <div className="station-grid">
            {stations.map((station) => (
            <button
                key={station}
                className="station-button"
                onClick={() => onSelect(station)}
            >
                {station}
            </button>
            ))}
        </div>
        </div>
    );
};

export default StationSelector;
