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
    <Sider width={250}>
      <Menu mode="inline" defaultSelectedKeys={["cash-flow"]}>
        <Menu.SubMenu
          key="fraud-control"
          icon={<DollarCircleOutlined />}
          title="Fraud Control"
        >
          <Menu.Item key="anamoly-detection" icon={<SwapOutlined />}>
            <Link to="/anamoly-detection">Anamoly Detection</Link>
          </Menu.Item>
          <Menu.Item key="email-analysis" icon={<BankOutlined />}>
            <Link to="/email-analysis">Email Analysis</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
