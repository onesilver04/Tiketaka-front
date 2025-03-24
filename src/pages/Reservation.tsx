import styles from "../styles/Button.module.css";
import styleb from "../styles/Box.module.css";
import "../styles/Reservation.css";

const Reservation = () => {
    return (
        <div>
            <div className={styleb.box}>
                <p className="box-name">승차권 예매</p>
            </div>
            <button className={`${styles.button} look-up2`}>조회</button>
        </div>
    );
};

export default Reservation;
