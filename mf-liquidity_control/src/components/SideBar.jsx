import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";
import {
  DollarCircleOutlined,
  SwapOutlined,
  BankOutlined,
  TransactionOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "liquidity-control",
      icon: <DollarCircleOutlined />,
      label: "Liquidity Control",
      children: [
        {
          key: "cash-flow",
          icon: <SwapOutlined />,
          label: <Link to="/cash-flow">Cash Flow</Link>,
        },
        {
          key: "cash-pooling",
          icon: <BankOutlined />,
          label: <Link to="/cash-pooling">Cash Pooling</Link>,
        },
        {
          key: "cash-sweeping",
          icon: <TransactionOutlined />,
          label: <Link to="/cash-sweeping">Cash Sweeping</Link>,
        },
        {
          key: "cash-reserves",
          icon: <BankOutlined />,
          label: <Link to="/cash-reserves">Cash Reserves</Link>,
        },
      ],
    },
  ];

  return (
    <Sider
      width={250}
      collapsedWidth={0}
      collapsed={collapsed}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        transition: "width 0.3s ease-in-out",
        background: "#fff", // Light mode
        borderRight: "1px solid #ddd",
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          fontSize: "18px",
          fontWeight: "bold",
          borderBottom: "1px solid #ddd",
          background: "#f5f5f5",
        }}
      >
        QDL
        <Button type="text" onClick={toggleSidebar}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>

      {/* Menu Items (Light Theme) */}
      <Menu
        theme="light"
        mode="inline"
        items={menuItems}
        style={{ borderRight: 0, fontSize: "16px" }}
      />
    </Sider>
  );
};

export default Sidebar;
