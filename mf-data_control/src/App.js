import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Content from "./components/Content";
import ChatInterface from "./components/ChatInterface";

import NetworkResolution from "./pages/NetworkResolution";


const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Header />
          <Content>
            <Routes>
              <Route path="/network-resolution" element={<NetworkResolution />} />

              <Route
                path="/"
                element={<h2>Select a module from the sidebar</h2>}
              />
            </Routes>
          </Content>
          <ChatInterface />
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
