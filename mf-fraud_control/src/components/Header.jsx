import React from "react";
import { Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        background: "#001529",
        color: "#fff",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>
        Fraud Control
      </div>
      <Avatar
        size="large"
        icon={<UserOutlined />}
        style={{ backgroundColor: "#1890ff" }}
      />
    </Header>
  );
};

export default AppHeader;
