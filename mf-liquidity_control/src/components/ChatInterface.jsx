import React, { useState,useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { Input,Button } from "antd";

const ChatInterface = ({ control }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [chartType, setChartType] = useState("pie");

  const availableColors = [
    "#10457D",
    "#215B97",
    "#3E6EA0",
    "#073666",
    "#03274B",
  ];


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
    setIsTyping(true);
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
          borderTop: "1px solid #ddd",
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
      
    </div>
  );
};

export default ChatInterface;
