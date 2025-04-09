import React, { useState } from "react";

const QNote = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);
    setResults([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/qnote", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "10px" }}>Consultation Assessment</h2>
      <p style={{ marginBottom: "20px" }}>Upload an Excel file for assessment testing.</p>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          style={{ padding: "5px" }}
        />
      </div>
      <button
        onClick={handleUpload}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#6c757d" : "#007bff",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload"}
      </button>

      {results.length > 0 && (
        <table style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Clinical Note</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Assessment</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{result.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{result.clinicalNote}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{result.assessment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QNote;