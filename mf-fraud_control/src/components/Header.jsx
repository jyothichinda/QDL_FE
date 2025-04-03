import React from "react";
import { Layout, Avatar, Button } from "antd";
import { UserOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader = ({ collapsed, setCollapsed }) => {
  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        transition: "width 0.3s ease-in-out",
        background: "#fff",
        borderRight: "1px solid #ddd",
        width: "100%",
      }}
    >
      {collapsed && (
        <Button
          type="text"
          onClick={() => setCollapsed(false)}
          style={{
            position: "absolute",
            top: 16,
            left: 8, // Adjusted to avoid overlap
            zIndex: 1001,
          }}
        >
          <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
        </Button>
      )}
      <div
        style={{
          marginLeft: "5px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#fff",
        }}
      >
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
