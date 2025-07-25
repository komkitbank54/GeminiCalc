import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const testResponse = {
    result:
      '{"status": "PASS", "process": "130:50x50 + 368:30x…0 + 32:20 + 72:20 + 73:10 + 89:50", "sum": "490"}',
  };

  const handleFileChange = (event) => {
    const MAX_FILES = 50;

    if (event.target.files.length > MAX_FILES) {
      alert(`ใส่รูปภาพได้สูงสุด ${MAX_FILES} รูป`);
      event.target.value = "";
      setFiles([]);
      return;
    }

    setFiles(event.target.files);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    setLoading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("image", files[i]);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/gemini",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setLoading(false);
  };

  function parseResponse(response, index) {
    try {
      const parsed = JSON.parse(testResponse.result);
      console.log("Parsed Response:", parsed);
    } catch (error) {
      console.error("Error parsing response:", error);
    }
  }
  parseResponse(testResponse);
  return (
    <>
      <div>
        <input
          type="file"
          accept="image/jpeg, image/png"
          multiple
          id="fileInput"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>
    </>
  );
}

export default App;
