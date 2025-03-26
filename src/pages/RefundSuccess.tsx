import "../styles/RefundSuccess.css";

const RefundSuccess = () => {
    return (
        <div className="refund-success">
            <div className="ment">
                <p>환불 처리 완료되었습니다.</p>
                <p>Tiketaka를 이용해주셔서 감사합니다.</p>
            </div>
            <img src="/src/assets/success-button.svg" alt="success-img" />
        </div>
    );
};

export default RefundSuccess;
