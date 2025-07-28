import "./FileInput.css";
import uploadIcon from "../../assets/icons/upload.png";

export default function FileInput({ maxFiles, disabled, onFilesSelected }) {
    const handleChange = (event) => {
        if (event.target.files.length > maxFiles) {
            alert(`ใส่รูปได้สูงสุด ${maxFiles} รูป`);
            event.target.value = "";
            onFilesSelected([]);
            return;
        }
        onFilesSelected(event.target.files);
    };

    return (
        <label className="file-input">
            <img src={uploadIcon} alt="Upload" className="upload-icon" />
            <input
                type="file"
                accept="image/jpeg, image/png"
                multiple
                onChange={handleChange}
                disabled={disabled}
                style={{ display: "none" }}
            />
            เลือกรูป
        </label>
    );
}
