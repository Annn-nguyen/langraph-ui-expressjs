import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2em",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  sessionInfo: {
    fontSize: "1em",
    color: "#555",
    marginBottom: "10px",
    backgroundColor: "#f1f1f1",
    padding: "5px 10px",
    borderRadius: "5px",
  },
  chatbox: {
    width: "100%",
    maxWidth: "600px",
    height: "400px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#ffffff",
    color: "#000000",
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
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "600px",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4());

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message }),
      });

      const data = await response.json();
      setChat([...newChat, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chat with OpenAI</h1>
      <p style={styles.sessionInfo}><strong>Session ID:</strong> {sessionId}</p>
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
          onKeyDown={handleKeyPress}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

export default Chat; 