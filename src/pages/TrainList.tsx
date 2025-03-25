// TrainList.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Train {
    id: number
    departure: string
    arrival: string
    price: string
    seatsLeft: number
    disabled?: boolean
}

const dummyTrains: Train[] = [
    { id: 1, departure: '05:13', arrival: '07:14', price: '69,000원', seatsLeft: 36 },
    { id: 2, departure: '06:21', arrival: '08:20', price: '69,000원', seatsLeft: 10 },
    { id: 3, departure: '08:36', arrival: '10:02', price: '71,600원', seatsLeft: 0, disabled: true },
    { id: 4, departure: '11:03', arrival: '13:14', price: '69,000원', seatsLeft: 29 },
    { id: 5, departure: '12:27', arrival: '15:20', price: '69,000원', seatsLeft: 12 },
    { id: 6, departure: '15:13', arrival: '17:14', price: '54,000원', seatsLeft: 97 },
    { id: 7, departure: '16:21', arrival: '18:20', price: '69,000원', seatsLeft: 23 },
    { id: 8, departure: '18:36', arrival: '20:02', price: '71,600원', seatsLeft: 0, disabled: true },
    { id: 9, departure: '21:03', arrival: '23:14', price: '32,000원', seatsLeft: 17 },
    { id: 10, departure: '22:27', arrival: '01:20', price: '69,000원', seatsLeft: 8 },
]

const TrainList = () => {
    const navigate = useNavigate()
    const [selectedTrainId, setSelectedTrainId] = useState<number | null>(null)

    const handleBack = () => {
        navigate(-1)
    }

    const handleSelect = (train: Train) => {
        if (!train.disabled) {
            setSelectedTrainId(train.id)
        }
    }

    const handleNext = () => {
        if (selectedTrainId === null) {
            alert('기차를 선택해주세요.')
            return
        }

        navigate('/reservation/select-seat')
    }

    return (
        <div>
            <h2>시간대 선택</h2>

            <table>
                <thead>
                    <tr>
                        <th>출발</th>
                        <th>도착</th>
                        <th>가격</th>
                        <th>남은 좌석 수</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyTrains.map((train) => (
                        <tr
                            key={train.id}
                            onClick={() => handleSelect(train)}
                            style={{
                                opacity: train.disabled ? 0.3 : 1,
                                backgroundColor: train.id === selectedTrainId ? '#9EA4AA' : 'transparent',
                                cursor: train.disabled ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <td>{train.departure}</td>
                            <td>{train.arrival}</td>
                            <td>{train.price}</td>
                            <td style={{ color: train.seatsLeft < 20 ? '#FF1744' : '#111111' }}>
                                {train.seatsLeft}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button onClick={handleBack}>이전</button>
                <button onClick={handleNext}>다음</button>
            </div>
        </div>
    )
}

export default TrainList
