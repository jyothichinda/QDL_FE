import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Card,
  Form,
  message,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Drawer, // Added Drawer import
} from "antd";
import {
  SettingOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  EditOutlined,
  FilterOutlined,
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
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import axios from "axios";

const allColumns = [
  { title: "Pool Name", dataIndex: "pool_name", key: "pool_name" },
  {
    title: "Master Account",
    dataIndex: "master_account",
    key: "master_account",
    render: (text) => text || "--",
  },
  {
    title: "Currency",
    dataIndex: "currency",
    key: "currency",
    render: (text) => text || "--",
  },
  {
    title: "Participating Accounts",
    dataIndex: "participating_accounts",
    key: "participating_accounts",
    render: (accounts) => accounts?.join(", ") || "--",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => text || "--",
  },
  {
    title: "Next Execution",
    dataIndex: "next_execution",
    key: "next_execution",
    render: (text) => text?.join("-") || "--",
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    render: (text) => text || "--",
  },
  {
    title: "Liquidity Threshold",
    dataIndex: "liquidity_threshold",
    key: "liquidity_threshold",
    render: (text) => text || "--",
  },
  {
    title: "Interest Rate(%)",
    dataIndex: "interest",
    key: "interest",
    render: (text) => text || "--",
  },
  {
    title: "Auto-Rebalancing",
    dataIndex: "auto_rebalancing",
    key: "auto_rebalancing",
    render: (text) => text || "--",
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
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
    </Card>
  );
};

const PoolingTable = ({
  data = [
    {
      id: 1,
      pool_name: "Check",
      master_account: "Test",
      currency: "USD",
      participating_accounts: ["XYZ", "ABC", "JYP"],
      status: "Active",
      next_execution: [2025, 3, 19, 18, 30],
      balance: 0,
      liquidity_threshold: 10000,
      interest: "15",
      auto_rebalancing: "yes",
    },
    {
      id: 2,
      pool_name: "Regional Pool - Europe",
      master_account: "Euro Bank - 102",
      currency: "USD",
      participating_accounts: ["account1", "account2", "account3"],
      status: "active",
      next_execution: [2025, 3, 20, 14, 30],
      balance: 50000,
      liquidity_threshold: 10000,
      interest: "5%",
      auto_rebalancing: "enabled",
    },
    {
      "id": 3,
      "pool_name": "Check 1",
      "master_account": "Test 1",
      "currency": "USD",
      "participating_accounts": [
        "INRIOP",
        "JKLOP"
      ],
      "status": "Active",
      "next_execution": [2025, 3, 19, 18, 30],
      "balance": 0,
      "liquidity_threshold": 1890,
      "interest": "12",
      "auto_rebalancing": "yes"
    },
    {
      "id": 4,
      "pool_name": "Check 5",
      "master_account": "Test 5",
      "currency": "USD",
      "participating_accounts": [
        "ASD",
        "GHJ"
      ],
      "status": "Active",
      "next_execution": [2025, 3, 27, 18, 30],
      "balance": 0,
      "liquidity_threshold": 10000,
      "interest": "15",
      "auto_rebalancing": "yes"
    },
    {
      "id": 5,
      "pool_name": "Check 10",
      "master_account": "Test 10",
      "currency": "INR",
      "participating_accounts": [
        "UIO"
      ],
      "status": "Active",
      "next_execution": [2025, 3, 21, 18, 30],
      "balance": 0,
      "liquidity_threshold": 1500,
      "interest": "16",
      "auto_rebalancing": "yes"
    },
    {
      "id": 6,
      "pool_name": "A",
      "master_account": "AB",
      "currency": "USD",
      "participating_accounts": [
        "BC"
      ],
      "status": "Active",
      "next_execution": [2025, 3, 28, 18, 30],
      "balance": 0,
      "liquidity_threshold": 1,
      "interest": "0.1",
      "auto_rebalancing": "yes"
    }
  ],
  fetchData,
}) => {
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

  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    localStorage.setItem("columnOrder", JSON.stringify(columnsOrder));
  }, [selectedColumns, columnsOrder]);

  const handleColumnToggle = (key) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.includes(key)
        ? prevSelectedColumns.filter((colKey) => colKey !== key)
        : [...prevSelectedColumns, key]
    );
  };

  const resetToDefault = () => {
    setSelectedColumns(allColumns.map((col) => col.key));
    setColumnsOrder(allColumns);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columnsOrder.findIndex((col) => col.key === active.id);
      const newIndex = columnsOrder.findIndex((col) => col.key === over.id);
      setColumnsOrder(arrayMove(columnsOrder, oldIndex, newIndex));
    }
  };

  const filteredColumns = columnsOrder.filter((col) =>
    selectedColumns.includes(col.key)
  );

  const filteredData = data.filter((item) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://192.168.1.9:9898/save/pooling",
        values
      );
      message.success("Pool saved successfully!");
      setCreateModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error("Failed to save pool!");
    }
  };

  const resetConfigToDefault = () => {
    form.resetFields();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => setCreateModalVisible(true)}
        >
          Create
        </Button>
        <Button
          icon={<FilterOutlined />}
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={() => setFilterDrawerVisible(true)}
        >
          Filter
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

      <Drawer
        title="Filter Pools"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
      >
        <Form
          layout="vertical"
          onValuesChange={(changedValues, allValues) => setFilters(allValues)}
        >
          <Form.Item label="Pool Name" name="pool_name">
            <Input placeholder="Enter Pool Name" />
          </Form.Item>
          <Form.Item label="Master Account" name="master_account">
            <Input placeholder="Enter Master Account" />
          </Form.Item>
          <Form.Item label="Currency" name="currency">
            <Input placeholder="Enter Currency" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select Status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Auto-Rebalancing" name="auto_rebalancing">
            <Select
              placeholder="Select Auto-Rebalancing"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>

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

      <Modal
        title="Create Pool"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Pool Name"
            name="pool_name"
            rules={[{ required: true, message: "Please enter pool name" }]}
          >
            <Input placeholder="Enter pool name" />
          </Form.Item>
          <Form.Item
            label="Master Account"
            name="master_account"
            rules={[{ required: true, message: "Please enter Master Account" }]}
          >
            <Input placeholder="Enter master account" />
          </Form.Item>
          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: "Please enter Currency" }]}
          >
            <Input placeholder="Enter currency" />
          </Form.Item>
          <Form.Item
            label="Participating Accounts"
            name="participating_accounts"
            rules={[
              {
                required: true,
                message: "Please enter Participating Accounts",
              },
            ]}
          >
            <Select
              mode="tags"
              placeholder="Enter multiple accounts"
              tokenSeparators={[","]}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a Status" }]}
          >
            <Select
              showSearch
              placeholder="Select an option"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Next Execution"
            name="next_execution"
            rules={[{ required: true, message: "Please enter Next Execution Date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
          <Form.Item
            label="Threshold"
            name="liquidity_threshold"
            rules={[{ required: true, message: "Please enter Threshold" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter Liquidity Threshold"
            />
          </Form.Item>
          <Form.Item
            label="Interest"
            name="interest"
            rules={[{ required: true, message: "Please enter Interest Rate" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter Interest %"
            />
          </Form.Item>
          <Form.Item
            label="Auto Rebalancing"
            name="auto_rebalancing"
            rules={[{ required: true, message: "Please Select for Auto Rebalance" }]}
          >
            <Select
              showSearch
              placeholder="Select an option"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={resetConfigToDefault} style={{ marginRight: 10 }}>
              Reset to Default
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={filteredColumns}
        dataSource={filteredData.map((record, index) => ({
          ...record,
          key: record.id || index,
        }))}
        rowKey="key"
      />
    </div>
  );
};

export default PoolingTable;