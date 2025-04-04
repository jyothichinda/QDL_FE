import React, { useState, useEffect } from "react";
import { IoSendSharp, IoEllipsisHorizontalSharp } from "react-icons/io5";
import { AiOutlineHistory, AiOutlineExport } from "react-icons/ai";
import { Input, Button } from "antd";

const ChatInterface = ({ control }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const savedMessages = JSON.parse(
      localStorage.getItem(`${control}ChatHistory`) || "[]"
    );
    setMessages(savedMessages);
  }, [control]);

  useEffect(() => {
    localStorage.setItem(`${control}ChatHistory`, JSON.stringify(messages));
  }, [messages, control]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput.trim());
  };

  const sendMessage = async (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setUserInput("");
  };

  return (
    <div
      style={{
        background: "#f0f2f5",
        borderRadius: "8px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          background: "#ffffff",
          backtop: "1px solid #ddd",
        }}
      >
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask Your GPT..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            outline: "none",
            border: "1px solid #ddd",
          }}
        />
        <Button
          type="submit"
          disabled={!userInput.trim()}
          style={{
            background: "#f3f5f6",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "20px",
            marginLeft: "10px",
            cursor: userInput.trim() ? "pointer" : "not-allowed",
            opacity: userInput.trim() ? 1 : 0.5,
          }}
        >
          <IoSendSharp />
        </Button>
      </form>

      {/* Icons Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start", // Align icons to the left
          alignItems: "center",
          padding: "10px",
          background: "#ffffff",
          gap: "10px", // Small spacing between icons
        }}
      >
        {/* History Icon */}
        <AiOutlineHistory
          style={{
            fontSize: "24px",
            cursor: "pointer",
            color: "#555",
          }}
          title="History"
          onClick={() => console.log("History clicked")}
        />

        {/* Export Icon */}
        <AiOutlineExport
          style={{
            fontSize: "24px",
            cursor: "pointer",
            color: "#555",
          }}
          title="Export"
          onClick={() => console.log("Export clicked")}
        />

        {/* More Icon */}
        <IoEllipsisHorizontalSharp
          style={{
            fontSize: "24px",
            cursor: "pointer",
            color: "#555",
          }}
          title="More"
          onClick={() => console.log("More clicked")}
        />
      </div>
    </div>
  );
};

export default ChatInterface;