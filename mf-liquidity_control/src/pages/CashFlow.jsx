import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Drawer, Form, Input, Select, InputNumber, message } from "antd";
import {
  SettingOutlined,
  FilterOutlined,
  EditOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const allColumns = [
  { title: "Msg ID", dataIndex: "msgId", key: "msgId" },
  { title: "Creditor Name", dataIndex: "creditorName", key: "creditorName" },
  { title: "Debtor Name", dataIndex: "debtorName", key: "debtorName" },
  { title: "Creditor Network Type", dataIndex: "creditorNetworkType", key: "creditorNetworkType" },
  { title: "Debtor Network Type", dataIndex: "debtorNetworkType", key: "debtorNetworkType" },
  { title: "Clearing Network", dataIndex: "clearingNetwork", key: "clearingNetwork" },
  { title: "Tier", dataIndex: "tier", key: "tier" },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Amount", dataIndex: "amount", key: "amount" },
  { title: "Cash Flow", dataIndex: "cashFlow", key: "cashFlow" },
  {
    title: "Creation Date",
    dataIndex: "creationDateTime",
    key: "creationDateTime",
    render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
  },
];

const dummyData = [
  {
    id: 163,
    msgId: "MSGIDDK00034",
    creditorName: "QuantumTech Systems",
    debtorName: "NovaMatrix Technologies",
    creditorNetworkType: "ACH",
    debtorNetworkType: "ACH",
    clearingNetwork: "ACH",
    tier: "Tier1",
    status: "Processing",
    amount: 1125887.34,
    cashFlow: "Outflow",
    creationDateTime: "2025-04-04T10:35:00",
  },
  {
    id: 14,
    msgId: "MSGIDDK00028",
    creditorName: "QuantumTech Systems",
    debtorName: "NovaMatrix Technologies",
    creditorNetworkType: "ACH",
    debtorNetworkType: "ACH",
    clearingNetwork: "ACH",
    tier: "Tier1",
    status: "--",
    amount: 925887.34,
    cashFlow: "Inflow",
    creationDateTime: "2024-12-02T08:00:00",
  },
  {
    "id": 15,
    "msgId": "MSGIDDK00028",
    "creditorName": "QuantumTech Systems",
    "debtorName": "NovaMatrix Technologies",
    "creditorNetworkType": "ACH",
    "debtorNetworkType": "ACH",
    "clearingNetwork": "ACH",
    "tier": "Tier1",
    "status": "Processing",
    "amount": 925887.34,
    "cashFlow": "Inflow",
    "creationDateTime": "2024-12-02T08:00:00"
},
{
    "id": 16,
    "msgId": "MSGIDDK00028",
    "creditorName": "QuantumTech Systems",
    "debtorName": "NovaMatrix Technologies",
    "creditorNetworkType": "ACH",
    "debtorNetworkType": "ACH",
    "clearingNetwork": "ACH",
    "tier": "Tier3",
    "status": "Processing",
    "amount": 1.2692588734E8,
    "cashFlow": "Outflow",
    "creationDateTime": "2024-12-02T08:00:00"
},
{
    "id": 17,
    "msgId": "MSGIDDK00028",
    "creditorName": "QuantumTech Systems",
    "debtorName": "NovaMatrix Technologies",
    "creditorNetworkType": "ACH",
    "debtorNetworkType": "ACH",
    "clearingNetwork": "ACH",
    "tier": "Tier3",
    "status": "Processing",
    "amount": 4.192588734E7,
    "cashFlow": "Bank of Spain -> Bank of Bavaria",
    "creationDateTime": "2024-12-02T08:00:00"
},
{
    "id": 18,
    "msgId": "MSGIDDK00028",
    "creditorName": "QuantumTech Systems",
    "debtorName": "NovaMatrix Technologies",
    "creditorNetworkType": "ACH",
    "debtorNetworkType": "ACH",
    "clearingNetwork": "ACH",
    "tier": "Tier3",
    "status": "Processing",
    "amount": 4.192588734E7,
    "cashFlow": "Outflow",
    "creationDateTime": "2024-12-02T08:00:00"
},
{
    "id": 19,
    "msgId": "MSGIDDK00028",
    "creditorName": "QuantumTech Systems",
    "debtorName": "NovaMatrix Technologies",
    "creditorNetworkType": "ACH",
    "debtorNetworkType": "ACH",
    "clearingNetwork": "ACH",
    "tier": "Tier2",
    "status": "Processing",
    "amount": 2.192588734E7,
    "cashFlow": "Outflow",
    "creationDateTime": "2024-12-02T08:00:00"
},
];

const SortableItem = ({ column, isChecked, onToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 10,
    marginBottom: 8,
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: isChecked ? "#e6f7ff" : "#f0f0f0",
    borderRadius: 5,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isChecked ? (
          <MinusSquareOutlined
            style={{ color: "red", fontSize: 18, cursor: "pointer" }}
            onClick={() => onToggle(column.key)}
          />
        ) : (
          <PlusSquareOutlined
            style={{ color: "green", fontSize: 18, cursor: "pointer" }}
            onClick={() => onToggle(column.key)}
          />
        )}
        <span>{column.title}</span>
      </div>
    </div>
  );
};

const CashFlowTable = () => {
  const savedColumns =
    JSON.parse(localStorage.getItem("selectedColumns")) ||
    allColumns.map((col) => col.key);
  const savedOrder =
    JSON.parse(localStorage.getItem("columnOrder")) || allColumns;
  const [selectedColumns, setSelectedColumns] = useState(savedColumns);
  const [columnsOrder, setColumnsOrder] = useState(savedOrder);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    localStorage.setItem("columnOrder", JSON.stringify(columnsOrder));
  }, [selectedColumns, columnsOrder]);

  // Toggle column visibility
  const handleColumnToggle = (key) => {
    setSelectedColumns((prevSelectedColumns) => {
      const updatedColumns = prevSelectedColumns.includes(key)
        ? prevSelectedColumns.filter((colKey) => colKey !== key)
        : [...prevSelectedColumns, key];
      return updatedColumns;
    });
  };

  // Reset to default
  const resetToDefault = () => {
    setSelectedColumns(allColumns.map((col) => col.key));
    setColumnsOrder(allColumns);
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Handle column reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columnsOrder.findIndex((col) => col.key === active.id);
      const newIndex = columnsOrder.findIndex((col) => col.key === over.id);
      setColumnsOrder(arrayMove(columnsOrder, oldIndex, newIndex));
    }
  };

  // Filter visible columns
  const filteredColumns = columnsOrder.filter((col) =>
    selectedColumns.includes(col.key)
  );

  // Apply filters to data
  const filteredData = dummyData.filter((item) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  const handleCreateSubmit = async (values) => {
    try {
      // Simulate API call
      message.success("Cash Flow entry created successfully!");
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create Cash Flow entry!");
    }
  };

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      {/* Filter, Create, and Customize Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          icon={<FilterOutlined />}
          type="primary"
          onClick={() => setFilterDrawerVisible(true)}
        >
          Filter
        </Button>
        <Button
          icon={<EditOutlined />}
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={() => setCreateModalVisible(true)}
        >
          Create
        </Button>
        <Button
          icon={<SettingOutlined />}
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={() => setModalVisible(true)}
        >
          Customize
        </Button>
      </div>

      {/* Filter Drawer */}
      <Drawer
        title="Filter Transactions"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
      >
        <Form
          layout="vertical"
          onValuesChange={(changedValues, allValues) => setFilters(allValues)}
        >
          <Form.Item label="Msg ID" name="msgId">
            <Input placeholder="Enter Msg ID" />
          </Form.Item>
          <Form.Item label="Creditor Name" name="creditorName">
            <Input placeholder="Enter Creditor Name" />
          </Form.Item>
          <Form.Item label="Debtor Name" name="debtorName">
            <Input placeholder="Enter Debtor Name" />
          </Form.Item>
          <Form.Item label="Tier" name="tier">
            <Select
              placeholder="Select Tier"
              options={[
                { value: "Tier1", label: "Tier 1" },
                { value: "Tier2", label: "Tier 2" },
                { value: "Tier3", label: "Tier 3" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Cash Flow" name="cashFlow">
            <Select
              placeholder="Select Cash Flow"
              options={[
                { value: "Inflow", label: "Inflow" },
                { value: "Outflow", label: "Outflow" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select Status"
              options={[
                { value: "Processing", label: "Processing" },
                { value: "Completed", label: "Completed" },
                { value: "--", label: "--" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Create Modal */}
      <Modal
        title="Create Cash Flow Entry"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item
            label="Msg ID"
            name="msgId"
            rules={[{ required: true, message: "Please enter Msg ID" }]}
          >
            <Input placeholder="Enter Msg ID" />
          </Form.Item>
          <Form.Item
            label="Creditor Name"
            name="creditorName"
            rules={[{ required: true, message: "Please enter Creditor Name" }]}
          >
            <Input placeholder="Enter Creditor Name" />
          </Form.Item>
          <Form.Item
            label="Debtor Name"
            name="debtorName"
            rules={[{ required: true, message: "Please enter Debtor Name" }]}
          >
            <Input placeholder="Enter Debtor Name" />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter Amount" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter Amount"
            />
          </Form.Item>
          <Form.Item
            label="Cash Flow"
            name="cashFlow"
            rules={[{ required: true, message: "Please select Cash Flow" }]}
          >
            <Select
              placeholder="Select Cash Flow"
              options={[
                { value: "Inflow", label: "Inflow" },
                { value: "Outflow", label: "Outflow" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => form.resetFields()} style={{ marginRight: 10 }}>
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Customization Modal */}
      <Modal
        title="Customize Columns"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="reset" onClick={resetToDefault}>
            Reset to Default
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => setModalVisible(false)}
          >
            Done
          </Button>,
        ]}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnsOrder.map((col) => col.key)}
            strategy={verticalListSortingStrategy}
          >
           {columnsOrder.map((column) => (
              <SortableItem
                key={column.key}
                column={column}
                isChecked={selectedColumns.includes(column.key)}
                onToggle={handleColumnToggle}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Modal>

      {/* Transactions Table */}
      <Table
        columns={filteredColumns}
        dataSource={filteredData.map((record, index) => ({
          ...record,
          key: record.id || `${record.msgId}-${index}`, // Ensure unique keys
        }))}
      />
    </div>
  );
};

export default CashFlowTable;