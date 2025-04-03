import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const MainContent = ({ children }) => {
  return (
    <Content
      style={{
        margin: "20px",
        padding: "20px",
        background: "#fff",
        minHeight: "80vh",
        borderRadius: "8px",
      }}
    >
      {children}
    </Content>
  );
};

export default MainContent;
