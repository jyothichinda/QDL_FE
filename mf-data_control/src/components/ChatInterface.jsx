import React, { useState, useEffect } from "react";
import { IoSendSharp, IoEllipsisHorizontalSharp } from "react-icons/io5";
import { AiOutlineHistory, AiOutlineExport } from "react-icons/ai";
import { Input, Button } from "antd";

const ChatInterface = ({ control }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [chartType, setChartType] = useState("pie");
  const [isHistoryVisible, setIsHistoryVisible] = useState(false); // Define the state for history visibility
  
  const availableColors = [
    "#10457D",
    "#215B97",
    "#3E6EA0",
    "#073666",
    "#03274B",
  ];

  // Load messages from localStorage for the current page
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`${control}ChatHistory`) || "[]");
    setMessages(savedMessages);
  }, [control]);

  // Save messages to localStorage whenever they change
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
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "10px",
          background: "#ffffff",
          gap: "20px",
          position: "relative", // For positioning the dropdown
        }}
      >
        {/* History Icon */}
        <div style={{ position: "relative" }}>
          <AiOutlineHistory
            style={{
              fontSize: "24px",
              cursor: "pointer",
              color: "#555",
            }}
            title="History"
            onClick={() => setIsHistoryVisible((prev) => !prev)} // Toggle visibility
          />
          {isHistoryVisible && (
            <div
              style={{
                position: "absolute",
                bottom: "30px", // Position above the icon
                left: "0",
                background: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                padding: "10px",
                zIndex: 1000,
              }}
            >
              {staticQueries[control]?.map((query, index) => (
                <div
                  key={index}
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderBottom: index !== staticQueries[control].length - 1 ? "1px solid #ddd" : "none",
                  }}
                  onClick={() => console.log(`Selected query: ${query}`)} // Handle query click
                >
                  {query}
                </div>
              ))}
            </div>
          )}
        </div>

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