// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "./components/SideBar";
import AppHeader from "./components/Header";
import MainContent from "./components/Content";
import ChatInterface from "./components/ChatInterface";
import Dashboard from "./pages/Dashboard";
import Anamoly from "./pages/AnamolyDetection";

const App = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  const handleQuerySubmit = (query) => {
    if (query.trim()) {
      setInitialQuery(query);
      setIsChatActive(true);
    }
  };

  const handleChatClose = () => {
    setIsChatActive(false);
    setInitialQuery("");
  };

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <AppHeader />
          <MainContent>
            {isChatActive ? (
              <ChatInterface 
                initialQuery={initialQuery} 
                onClose={handleChatClose}
              />
            ) : (
              <Routes>
                <Route path="/anamoly" element={<Anamoly />} />
                <Route path="/" element={<Dashboard />} />
              </Routes>
            )}
          </MainContent>
          {!isChatActive && (
            <ChatInterface onQuerySubmit={handleQuerySubmit} />
          )}
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;