
const PhoneNumber = () => {
    return (
        <div>
            <div>전화번호 입력</div>
            <input type="text" placeholder="전화번호 11자리 입력"></input>
            <div>
                <div>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                </div>
                <div>
                    <button>4</button>
                    <button>5</button>
                    <button>6</button>
                </div>
                <div>
                    <button>7</button>
                    <button>8</button>
                    <button>9</button>
                </div>
                <div>
                    <button></button>
                    <button>0</button>
                    <button><img src="./assets/delete-button"></img></button>
                </div>
            </div>
            <div>
                <button>이전</button>
                <button>다음</button>
            </div>
        </div> 
    )
}

export default PhoneNumber;