import "/src/styles/Header.css";
import logoHeader from "../assets/header-logo.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    
    const handleHome = () => {
        navigate("/");
    };

    return (
        <div className="header-container">
            <img src={logoHeader} onClick={handleHome} alt="헤더로고" className="header-logo" />
        </div>
    );
};

export default Header;
