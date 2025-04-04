import React, { useState, useEffect } from "react";
import { IoSendSharp, IoEllipsisHorizontalSharp } from "react-icons/io5";
import { AiOutlineHistory, AiOutlineExport } from "react-icons/ai";
import { Input, Button } from "antd";

const ChatInterface = ({ control }) => {
  // Static messages
  const staticMessages = ["what are the networks that are down?"];
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

  // Load messages from localStorage for the current page or workflow
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`${control}ChatHistory`) || "[]");
    const combinedMessages = [
      ...(Array.isArray(staticMessages) ? staticMessages : []),
      ...(Array.isArray(savedMessages) ? savedMessages : []),
    ]; // Combine static and saved messages
    setMessages(combinedMessages); // Ensure `messages` is an array
    console.log("Loaded messages from localStorage:", combinedMessages);
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
    setMessages((prev) => (Array.isArray(prev) ? [...prev, text] : [text])); // Ensure `prev` is an array
    setUserInput("");
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000); // Simulate typing delay
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
                bottom: "30px",
                left: "0",
                background: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                padding: "10px",
                zIndex: 1000,
                width: "200px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {messages.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
                  {messages.map((msg, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "5px 0",
                        borderBottom: index !== messages.length - 1 ? "1px solid #eee" : "none",
                        textTransform: "capitalize", // Optional: Capitalize the first letter
                      }}
                    >
                      {msg}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#888", textAlign: "center" }}>No history available</p>
              )}
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