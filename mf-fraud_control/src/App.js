import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "./components/SideBar";
import AppHeader from "./components/Header";
import MainContent from "./components/Content";
import ChatInterface from "./components/ChatInterface";
import Dashboard from "./pages/Dashboard";

import Anamoly from "./pages/AnamolyDetection";
// import Sidebar from "./components/SideBar";


const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <AppHeader />
          <MainContent>
            <Routes>
              <Route path="/anamoly" element={<Anamoly />} />
              <Route
                path="/"
                element={<Dashboard/>}
              />
            </Routes>
          </MainContent>
          <ChatInterface />
        </Layout>
      </Layout>
    </Router>
  );
};
export default App;
