import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Reservation.css';

const stations = [
    '선택', '서울', '광명', '수원', '천안아산', '오송', '대전', '마산', '밀양', '구포',
    '평창', '강릉', '전주', '목포', '청량리', '용산', '원주', '평택', '천안',
    '조치원', '서대전', '대구', '동해', '진부', '익산', '부산', '순천', '울산', '정동진'
];


const Reservation = () => {
    const [departure, setDeparture] = useState<string | null>(null);
    const [arrival, setArrival] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [adultCount, setAdultCount] = useState(0);
    const [seniorCount, setSeniorCount] = useState(0);
    const [teenCount, setTeenCount] = useState(0);
    
    const navigate = useNavigate();

    // let sessionValue = sessionStorage.getItem('departure')
    // const parseValue=JSON.parse(sessionValue);

    const handleStationChange = (type: 'departure' | 'arrival', value: string) => {
        const newValue = value === '선택' ? null : value; // 선택을 택하면 null로 처리해서 alert 창 뜨게, 선택을 제외한 나머지 선택을 했을 경우 value로 처리.
        if (type === 'departure') setDeparture(newValue);
        if (type === 'arrival') setArrival(newValue);
    };

    const handleSearch = () => {
        if (!departure ) {
            alert('출발역은 필수입니다.');
            return;
        }
        if (!arrival ) {
            alert('도착역은 필수입니다.');
            return;
        }
        if (!date) {
            alert('날짜는 필수입니다.');
            return;
        }
    
        if ((adultCount + seniorCount + teenCount) < 1) {
            alert('최소 1명 이상의 인원이 필요합니다.');
            return;
        }
    
        console.log('조회 정보:', {
            departure,
            arrival,
            date,
            adultCount,
            seniorCount,
            teenCount,
        });

        navigate('/reservation/train-list', {
            state: {
                departure,
                arrival,
                date,
                adultCount,
                seniorCount,
                teenCount,
            } // 네비게이션으로 해당 페이지의 정보 넘겨줌. useLocation().state 다음 페이지에서 이거 사용하면 이 페이지에서 선택한 내용이 
        });
    };

    const handleCountChange = (type: string, delta: number) => {
        if (type === 'adult') setAdultCount((prev) => Math.max(0, prev + delta));
        if (type === 'senior') setSeniorCount((prev) => Math.max(0, prev + delta));
        if (type === 'teen') setTeenCount((prev) => Math.max(0, prev + delta));
    };

    return (
        <div>
        <h2>승차권 예매</h2>

        <div>
            <label>출발</label>
            <select value={departure ?? '선택'} onChange={(e) => handleStationChange('departure', e.target.value)}>
            {stations.map((station) => (
                <option key={station} value={station}>{station}</option>
            ))}
            </select>

            <label>도착</label>
            <select value={arrival ?? '선택'} onChange={(e) => handleStationChange('arrival', e.target.value)}>
            {stations.map((station) => (
                <option key={station} value={station}>{station}</option>
            ))}
            </select>
        </div>

        <div>
        <h4>출발일 {date ? date.toLocaleDateString() : '날짜 선택 안됨'}</h4>
            <Calendar 
                onChange={(value) => {
                    if (value instanceof Date) {
                        setDate(value);
                    } else if (Array.isArray(value) && value[0] instanceof Date) {
                        setDate(value[0]);
                    } else {
                        setDate(null);
                    }
                }}
                value={date}
                selectRange={false}
                tileClassName={({ date: tileDate }) => 
                    date && tileDate.toDateString() === date.toDateString() ? 'selected-date' : ''
                }
            />
        </div>

        <div>
            <h4>인원 선택</h4>
            <div>
                <div>성인</div>
                <div>(만 19세 이상)</div>
                <button onClick={() => handleCountChange('adult', -1)}>-</button>
                <span>{adultCount}</span>
                <button onClick={() => handleCountChange('adult', 1)}>+</button>
            </div>
            <div>
                <div>노약자</div>
                <div>(만 65세 이상)</div>
                <button onClick={() => handleCountChange('senior', -1)}>-</button>
                <span>{seniorCount}</span>
                <button onClick={() => handleCountChange('senior', 1)}>+</button>
            </div>
            <div>
                <div>청소년</div>
                <div>(만 13~18세)</div>
                <button onClick={() => handleCountChange('teen', -1)}>-</button>
                <span>{teenCount}</span>
                <button onClick={() => handleCountChange('teen', 1)}>+</button>
            </div>
        </div>

        <div>
            <button onClick={handleSearch}>조회</button>
        </div>
        </div>
    );
};

export default Reservation;
