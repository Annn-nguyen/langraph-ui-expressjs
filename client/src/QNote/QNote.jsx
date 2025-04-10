import React, { useState } from "react";

const QNote = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [inputMode, setInputMode] = useState("file");
    const [clinicalNote, setClinicalNote] = useState("");

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    const handleToggle = (mode) => {
        setInputMode(mode);
        setFile(null);
        setClinicalNote("");
    };

    const handleUpload = async () => {
        if (inputMode === "file" && !file) {
            alert("Please select a file first.");
            return;
        }

        if (inputMode === "note" && !clinicalNote.trim()) {
            alert("Please enter a clinical note.");
            return;
        }

        setLoading(true);
        setResults([]);

        const formData = new FormData();
        if (inputMode === "file") {
            formData.append("file", file);
        } else {
            formData.append("clinicalNote", clinicalNote);
        }

        try {
            const response = await fetch("/api/qnote", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data.results);
            } else {
                alert("Failed to process input.");
            }
        } catch (error) {
            console.error("Error processing input:", error);
            alert("An error occurred while processing the input.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ marginBottom: "10px" }}>Consultation Assessment</h2>
            <p style={{ marginBottom: "20px" }}>Upload an Excel file or enter a clinical note for assessment.</p>

            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={() => handleToggle("file")}
                    style={{
                        padding: "10px 20px",
                        marginRight: "10px",
                        backgroundColor: inputMode === "file" ? "#007bff" : "#6c757d",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Upload File
                </button>
                <button
                    onClick={() => handleToggle("note")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: inputMode === "note" ? "#007bff" : "#6c757d",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Enter Clinical Note
                </button>
            </div>

            {inputMode === "file" && (
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>Upload File:</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        style={{ padding: "5px" }}
                    />
                </div>
            )}

            {inputMode === "note" && (
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>Enter Clinical Note:</label>
                    <textarea
                        value={clinicalNote}
                        onChange={(e) => setClinicalNote(e.target.value)}
                        placeholder="Enter clinical notes here..."
                        rows="5"
                        style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
                    ></textarea>
                </div>
            )}

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
                {loading ? "Processing..." : "Submit"}
            </button>

            {results.length > 0 && (
                <table style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse", overflowX: "auto", display: "block" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f8f9fa" }}>ID</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", backgroundColor: "#f8f9fa", width: "300px" }}>Clinical Note</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", width: "100px" }}>Score</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", width: "30px" }}>Avg Score</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px", width: "300px" }}>Suggestions for Improvement</th>
                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Assessment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result.id}>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{result.id}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{result.clinicalNote}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{`${result.assessment.chiefComplaintAndHPI} - ${result.assessment.pastMedicalHistory} - ${result.assessment.allergiesAndAdverseDrugReactions} - ${result.assessment.physicalFindings} - ${result.assessment.assessment} - ${result.assessment.planOfCare} - ${result.assessment.followUpInstructions} - ${result.assessment.problemList} - ${result.assessment.medicationList} - ${result.assessment.socialAndFamilyHistory} - ${result.assessment.reviewOfSystems}`}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {
                                        Math.round(
                                            (
                                                result.assessment.chiefComplaintAndHPI +
                                                result.assessment.pastMedicalHistory +
                                                result.assessment.allergiesAndAdverseDrugReactions +
                                                result.assessment.physicalFindings +
                                                result.assessment.assessment +
                                                result.assessment.planOfCare +
                                                result.assessment.followUpInstructions
                                            ) / 7
                                        )
                                        + result.assessment.problemList
                                        + result.assessment.medicationList
                                        + result.assessment.socialAndFamilyHistory
                                        + result.assessment.reviewOfSystems
                                    }
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }} dangerouslySetInnerHTML={{ __html: result.assessment.suggestionsForImprovement }}></td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }} dangerouslySetInnerHTML={{ __html: result.assessment.summary }}></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default QNote;