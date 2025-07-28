import "./ScanButton.css";
import ScanIcon from "../../assets/icons/scan.png";

export default function ScanButton({ onClick, loading }) {
    return (
        <button
            className="scan-btn"
            onClick={onClick}
            disabled={loading === "loading" || loading === "none"}
        >
            <img
                src={ScanIcon}
                className={`scan-icon ${
                    loading === "loading" ? "spinning" : ""
                }`}
                alt="scan icon"
            />
            {loading === "loading" ? "กำลังคำนวณ..." : "คำนวณ"}
        </button>
    );
}
