import { useState } from "react";
import axios from "axios";
import FileInput from "./components/INPUT_File/FileInput";
import ScanButton from "./components/BTN_Scan/ScanButton";

import "./App.css";

import imgIcon from "./assets/icons/camera.png";

export default function App() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState("none"); // none, uploaded, loading
    const [result, setResult] = useState([]);

    const handleFileChange = (newFiles) => {
        const filesArray = Array.from(newFiles);
        const filesWithPreview = filesArray.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setFiles(filesWithPreview);
        setLoading("uploaded");
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            alert("Please select files to upload.");
            return;
        }

        setResult([]);
        setLoading("loading");
        for (const item of files) {
            const formData = new FormData();
            formData.append("image", item.file);

            try {
                const response = await axios.post(
                    "http://localhost:3000/api/gemini",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                console.log(`response= ${JSON.stringify(response.data)}`);
                let resultText = response.data.result.trim();

                if (resultText.startsWith("```json")) {
                    resultText = resultText
                        .replace(/^```json\s*/, "")
                        .replace(/```$/, "")
                        .trim();
                }

                parseResponse(item.file.name, resultText, item.previewUrl);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        setFiles([]);
        setLoading("none");
    };

    function parseResponse(fileName, response, previewUrl) {
        try {
            const objResult = JSON.parse(response);
            objResult.fileName = fileName;
            objResult.previewUrl = previewUrl;
            setResult((prevResults) => [...prevResults, objResult]);
        } catch (error) {
            console.error("Error parsing response:", error);
        }
    }

    return (
        <div className="container">
            <h1 className="title">เว็บคำนวณยอด</h1>
            <p className="subtitle">**รูปที่ไม่ชัดจะสแกนไม่ได้**</p>
            <div clalssName="scan-section">
                <FileInput
                    maxFiles={50}
                    disabled={loading === "loading"}
                    onFilesSelected={handleFileChange}
                />
                {files.length > 0 && (
                    <div>
                        <h1 className="file-header">
                            <img
                                className="imgIcon"
                                src={imgIcon}
                                alt="Image Icon"
                            />
                            รูปที่จะสแกน ({files.length})
                        </h1>
                        <div className="file-preview-container">
                            {files.map((item, index) => (
                                <img
                                    key={index}
                                    src={item.previewUrl}
                                    alt={`preview-${index}`}
                                    style={{
                                        maxWidth: "300px",
                                        margin: "10px",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
                <ScanButton onClick={handleSubmit} loading={loading} />
            </div>
            {result.length > 0 && (
                <div className="result-section">
                    <h2 className="s">รูป</h2>
                    <div className="result-grid">
                        {result.map((item, index) => (
                            <div key={index} className="result-item">
                                <div className="result-image-wrapper">
                                    <img
                                        src={item.previewUrl}
                                        alt={`uploaded-${index}`}
                                        className="result-image"
                                    />
                                </div>
                                <div className="result-content">
                                    <div className="result-summary">
                                        <span className="sum-text">
                                            ยอดรวม:
                                        </span>
                                        <span className="sum-value">
                                            {item.sum}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
