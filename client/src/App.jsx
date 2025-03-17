import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ Generate unique session IDs

const App = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4());

  // ✅ Save session ID to localStorage to persist across page reloads
  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3008/chat", { // ✅ Updated API port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message }), // ✅ Send only the latest message
      });

      const data = await response.json();
      setChat([...newChat, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ Handle "Enter" key to send message
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents form submission
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chat with OpenAI</h1>
      <p style={styles.sessionInfo}><strong>Session ID:</strong> {sessionId}</p> {/* ✅ Display session ID */}
      <div style={styles.chatbox}>
        {chat.map((msg, index) => (
          <p key={index} style={msg.role === "user" ? styles.userMessage : styles.aiMessage}>
            <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>{msg.content}
          </p>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyPress} // ✅ Listen for Enter key
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

// ✅ Define CSS styles as a JavaScript object
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
  },
  sessionInfo: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
    backgroundColor: "#e9ecef",
    padding: "5px 10px",
    borderRadius: "5px",
  },
  chatbox: {
    width: "600px",
    height: "400px",
    overflowY: "auto",
    border: "2px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: "10px",
  },
  userMessage: {
    textAlign: "right",
    color: "#007bff",
    marginBottom: "10px",
  },
  aiMessage: {
    textAlign: "left",
    color: "#28a745",
    marginBottom: "10px",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    width: "600px",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    padding: "10px 20px",
    marginLeft: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  }
};

export default App;
