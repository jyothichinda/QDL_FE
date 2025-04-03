import React, { useState } from "react";
import { Input, Button, Layout } from "antd";

const { Footer } = Layout;

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage("");
    }
  };

  return (
    <Footer
      style={{
        background: "#f0f2f5",
        padding: "10px",
        borderTop: "1px solid #d9d9d9",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={handleSendMessage}
        />
        <Button type="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </Footer>
  );
};

export default ChatInterface;
