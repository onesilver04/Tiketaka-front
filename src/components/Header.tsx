import "/src/styles/Header.css";
import logoHeader from "../assets/header-logo.svg";

const Header = () => {
    return (
        <div className="header-container">
            <img src={logoHeader} alt="헤더로고" className="header-logo" />
        </div>
    );
};

export default Header;
