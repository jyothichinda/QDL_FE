import React from "react";
import { Table } from "antd";

const CashFlowTable = (props) => {
  const { data } = props;

  const columns = [
    { title: "MsgId", dataIndex: "msgId", key: "msgId" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "In/Out-flow", dataIndex: "cashFlow", key: "cashFlow" },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5, hideOnSinglePage: true }} // Show 5 records at a time
      size="small" // Decrease row size
      style={{ fontSize: "12px" }} // Decrease font size for columns
    />
  );
};

export default CashFlowTable;
