import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
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
        const response = await axios.post("http://localhost:3000/api/gemini", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setLoading(false);
  };

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
          {loading ? "Scanning..." : "Submit"}
        </button>
      </div>
    </>
  );
}

export default App;
