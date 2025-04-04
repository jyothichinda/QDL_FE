import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Content from "./components/Content";
import ChatInterface from "./components/ChatInterface";
import Dashboard from "./pages/Dashboard";
import NetworkResolution from "./pages/NetworkResolution";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout
          className="main-layout"
          style={{
            marginLeft: collapsed ? 0 : 250,
            transition: "margin-left 0.3s ease-in-out",
            background: "#fff",
            minHeight: "100vh",
          }}
        >
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content>
            <Routes>
              <Route
                path="/network-resolution"
                element={<NetworkResolution />}
              />

              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Content>
          <ChatInterface />
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
