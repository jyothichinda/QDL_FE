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
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["repair-workflow"]}>
        <Menu.SubMenu
          key="data-control"
          icon={<DollarCircleOutlined />}
          title="Data Control"
        >
          <Menu.Item key="repair-workflow" icon={<SwapOutlined />}>
            <Link to="/repair-workflow">Repair Workflow</Link>
          </Menu.Item>
          <Menu.Item key="autocorrect-workflow" icon={<BankOutlined />}>
            <Link to="/autocorrect-workflow">Autocorrect Workflow</Link>
          </Menu.Item>
          <Menu.Item key="network-resolution" icon={<TransactionOutlined />}>
            <Link to="/network-resolution">Network Resolution</Link>
          </Menu.Item>
          
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
