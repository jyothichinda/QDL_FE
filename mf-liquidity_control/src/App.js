import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Content from "./components/Content";
import ChatInterface from "./components/ChatInterface";

import CashFlow from "./pages/CashFlow";
import CashPooling from "./pages/CashPooling";
import CashReserves from "./pages/CashReserves";
import CashSweeping from "./pages/CashSweeping";
import DashBoard from "./pages/Dashboard/App";

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Header />
          <Content>
            <Routes>
              <Route path="/" element={<DashBoard/>}/>
              <Route path="/cash-flow" element={<CashFlow />} />
              <Route path="/cash-pooling" element={<CashPooling />} />
              <Route path="/cash-reserves" element={<CashReserves />} />
              <Route path="/cash-sweeping" element={<CashSweeping />} />
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
