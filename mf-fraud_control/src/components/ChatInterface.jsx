import React, { useState, useEffect } from "react";
import { Input, Button, Layout } from "antd";
import axios from "axios";
import { Pie } from '@ant-design/charts';
import PieChart from "../charts/piechart";
import LineChart from "../charts/Linechart";
import BarChart from "../charts/BarChart"; // Assuming you have a BarChart component
import TableChart from "../charts/TableChart";

const { Footer } = Layout;

const ChatInterface = ({ initialQuery, onQuerySubmit, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      setMessages([{ text: initialQuery, sender: "user" }]);
      fetchLLMResponse(initialQuery);
    }
  }, [initialQuery]);

  const fetchLLMResponse = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(process.env.REACT_APP_LLM, {  
        method: 'POST',
        mode: 'cors',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const data = await response.json();
      console.log("LLM Response:", data);
      
      const llmResponse = data.response;
      const containsPieChart = query.toLowerCase().includes("pie chart");
      const containsLineChart = query.toLowerCase().includes("line chart");
      const containsBarChart = query.toLowerCase().includes("bar chart");
      const containsTableChart = query.toLowerCase().includes("table chart");

      let chartComponent = null;
      
      if (containsPieChart) {
        chartComponent = (
          <div>
            <PieChart />
            <p>Here's the pie chart you requested along with the response.</p>
          </div>
        );
      } else if (containsLineChart) {
        chartComponent = (
          <div>
            <LineChart />
            <p>Here's the line chart you requested along with the response.</p>
          </div>
        );
      } else if (containsBarChart) {
        chartComponent = (
          <div>
            <BarChart />
            <p>Here's the bar chart you requested along with the response.</p>
          </div>
        );
      } else if (containsTableChart) {
        // Generate CSV from table data
        const csvData = generateCSVFromTableData(tableData);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(blob);
        
        // Analyze CSV with LLM
        const csvAnalysis = await analyzeCSVWithLLM(csvData);
        
        chartComponent = (
          <div>
            <TableChart onDataUpdate={setTableData} />
            <p>Here's the table you requested along with the response.</p>
            <p>CSV Analysis: {csvAnalysis}</p>
            <a href={csvUrl} download="table_data.csv">Download CSV</a>
          </div>
        );
      }

      setMessages(prev => [...prev, { 
        text: llmResponse,
        sender: "bot",
        ...(chartComponent && { component: chartComponent })
      }]);
    } catch (error) {
      console.error("Error fetching LLM response:", error);
      setMessages(prev => [...prev, { 
        text: `Sorry, there was an error: ${error.message}`, 
        sender: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
};

// Helper function to generate CSV data
const generateCSVData = (query, llmResponse) => {
  // This is a simple example - you might want to customize this based on your needs
  const headers = "Query,Response,Timestamp\n";
  const row = `"${query}","${llmResponse.replace(/"/g, '""')}",${new Date().toISOString()}\n`;
  return headers + row;
};

// Helper function to analyze CSV with LLM
const analyzeCSVWithLLM = async (csvData) => {
  try {
    const response = await fetch('http://10.10.0.16:8000/llmresponse', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: "Analyze this table data and provide a summary: " + csvData 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze CSV');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    return "Error analyzing CSV: " + error.message;
  }
};

  const handleSendMessage = () => {
    if (message.trim()) {
      if (!initialQuery && onQuerySubmit) {
        onQuerySubmit(message);
      } else {
        setMessages(prev => [...prev, { text: message, sender: "user" }]);
        fetchLLMResponse(message);
      }
      setMessage("");
    }
  };

  if (!initialQuery && onQuerySubmit) {
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
          <Button 
            type="primary" 
            onClick={handleSendMessage}
            loading={isLoading}
          >
            Send
          </Button>
        </div>
      </Footer>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                background: msg.sender === "user" ? "#1890ff" : "#f0f0f0",
                color: msg.sender === "user" ? "white" : "black",
                padding: "5px 10px",
                borderRadius: "10px",
                display: "inline-block",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              <span>{msg.text}</span>
              {/* Render additional component if it exists */}
              {msg.component && (
                <div style={{ marginTop: "10px" }}>
                  {msg.component}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: "left", margin: "5px 0" }}>
            <span
              style={{
                background: "#f0f0f0",
                color: "black",
                padding: "5px 10px",
                borderRadius: "10px",
                display: "inline-block",
              }}
            >
              Typing...
            </span>
          </div>
        )}
      </div>
      <Footer
        style={{
          background: "#f0 yourf2f5",
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
            disabled={isLoading}
          />
          <Button 
            type="primary" 
            onClick={handleSendMessage}
            loading={isLoading}
          >
            Send
          </Button>
          <Button onClick={onClose} disabled={isLoading}>
            Close
          </Button>
        </div>
      </Footer>
    </div>
  );
};

export default ChatInterface;