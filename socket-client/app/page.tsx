"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

type Message = {
  text: string;
  type: "sent" | "received";
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);




  useEffect(() => {
    socket.on("receive_message123", (data: { text: string }) => {
      // 👉 server response (reversed)
      setChat((prev) => [
        ...prev,
        { text: data.text, type: "received" },
      ]);
    });

    return () => {
      socket.off("receive_message123");
    };
  }, []);



  const sendMessage = () => {
    if (!message.trim()) return;

    // 👉 show instantly (your message)
    setChat((prev) => [
      ...prev,
      { text: message, type: "sent" },
    ]);

    // 👉 send to server
    socket.emit("send_message", {
      text: message,
    });

    setMessage("");
  };















  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Chat App</h1>

      <div style={styles.chatBox}>
        {chat.map((msg, i) => {
          const isMe = msg.type === "sent";

          return (
            <div
              key={i}
              style={{
                ...styles.messageWrapper,
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.message,
                  backgroundColor: isMe ? "#e1341e" : "#1ecbe1",
                }}
              >
                <small style={{ opacity: 0.6 }}>
                  {isMe ? "You" : "Server"}
                </small>
                <br />
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  title: {
    textAlign: "center",
  },
  chatBox: {
    height: "400px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    overflowY: "auto",
    marginBottom: "10px",
  },
  messageWrapper: {
    display: "flex",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "15px",
    maxWidth: "70%",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "6px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};