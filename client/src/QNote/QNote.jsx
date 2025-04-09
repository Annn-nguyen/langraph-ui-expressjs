import React, { useState } from "react";

const QNote = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/qnote", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
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
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default QNote;