import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DollarCircleOutlined,
  SwapOutlined,
  BankOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider width={250} theme="dark">
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["cash-flow"]}>
        <Menu.SubMenu
          key="liquidity-control"
          icon={<DollarCircleOutlined />}
          title="Liquidity Control"
        >
          <Menu.Item key="cash-flow" icon={<SwapOutlined />}>
            <Link to="/cash-flow">Cash Flow</Link>
          </Menu.Item>
          <Menu.Item key="cash-pooling" icon={<BankOutlined />}>
            <Link to="/cash-pooling">Cash Pooling</Link>
          </Menu.Item>
          <Menu.Item key="cash-sweeping" icon={<TransactionOutlined />}>
            <Link to="/cash-sweeping">Cash Sweeping</Link>
          </Menu.Item>
          <Menu.Item key="cash-reserves" icon={<BankOutlined />}>
            <Link to="/cash-reserves">Cash Reserves</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
