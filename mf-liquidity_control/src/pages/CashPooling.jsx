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
  Dropdown,
  Menu,
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
    render: (text) => text || "--",
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
    title: "Last Pool Update",
    dataIndex: "update",
    key: "update",
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
  { title: "Action", dataIndex: "action", key: "action" },
];

// Sortable item component
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
        {/* Toggle between Plus and Minus Icons */}
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

const PoolingTable = ({ data = [
  {
    "id": 1,
    "pool_name": "Check",
    "master_account": "Test",
    "currency": "USD",
    "participating_accounts": [
      "XYZ",
      "ABC",
      "JYP"
    ],
    "status": "Active",
    "next_execution": [2025, 3, 19, 18, 30],
    "balance": 0,
    "liquidity_threshold": 10000,
    "interest": "15",
    "auto_rebalancing": "yes"
  },
  {
    "id": 2,
    "pool_name": "Regional Pool - Europe",
    "master_account": "Euro Bank - 102",
    "currency": "USD",
    "participating_accounts": [
      "account1",
      "account2",
      "account3"
    ],
    "status": "ACTIVE",
    "next_execution": [2025, 3, 20, 14, 30],
    "balance": 50000,
    "liquidity_threshold": 10000,
    "interest": "5%",
    "auto_rebalancing": "enabled"
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
], fetchData }) => {
  // Load preferences from local storage
  const savedColumns =
    JSON.parse(localStorage.getItem("selectedColumns")) ||
    allColumns.map((col) => col.key);
  const savedOrder =
    JSON.parse(localStorage.getItem("columnOrder")) || allColumns;

  const [selectedColumns, setSelectedColumns] = useState(savedColumns);
  const [columnsOrder, setColumnsOrder] = useState(savedOrder);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({
    poolName: "",
    masterAccount: "",
    currency: "",
    participatingAccounts: "",
    status: "",
    nextExecution: null,
    balance: "",
    liquidityThreshold: "",
    lastPoolUpdate: null,
    interest: "",
    autoRebalancing: "",
  });

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    localStorage.setItem("columnOrder", JSON.stringify(columnsOrder));
  }, [selectedColumns, columnsOrder]);

  // Update filtered data when data or filters change
  useEffect(() => {
    let tempData = [...data];

    if (filters.poolName) {
      tempData = tempData.filter((item) =>
        item.pool_name?.toLowerCase().includes(filters.poolName.toLowerCase())
      );
    }

    if (filters.masterAccount) {
      tempData = tempData.filter((item) =>
        item.master_account?.toLowerCase().includes(filters.masterAccount.toLowerCase())
      );
    }

    if (filters.currency) {
      tempData = tempData.filter((item) =>
        item.currency?.toLowerCase().includes(filters.currency.toLowerCase())
      );
    }

    if (filters.participatingAccounts) {
      tempData = tempData.filter((item) =>
        item.participating_accounts?.some((account) =>
          account.toLowerCase().includes(filters.participatingAccounts.toLowerCase())
        )
      );
    }

    if (filters.status) {
      tempData = tempData.filter((item) =>
        item.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.nextExecution) {
      tempData = tempData.filter((item) => {
        if (!item.next_execution) return false;
        const [year, month, day] = item.next_execution;
        const executionDate = dayjs(`${year}-${month}-${day}`);
        return executionDate.isSame(filters.nextExecution, "day");
      });
    }

    if (filters.balance) {
      tempData = tempData.filter((item) =>
        item.balance?.toString().includes(filters.balance)
      );
    }

    if (filters.liquidityThreshold) {
      tempData = tempData.filter((item) =>
        item.liquidity_threshold?.toString().includes(filters.liquidityThreshold)
      );
    }

    if (filters.lastPoolUpdate) {
      tempData = tempData.filter((item) => {
        if (!item.update) return false;
        return dayjs(item.update).isSame(filters.lastPoolUpdate, "day");
      });
    }

    if (filters.interest) {
      tempData = tempData.filter((item) =>
        item.interest?.toString().includes(filters.interest)
      );
    }

    if (filters.autoRebalancing) {
      tempData = tempData.filter((item) =>
        item.auto_rebalancing?.toLowerCase() === filters.autoRebalancing.toLowerCase()
      );
    }

    setFilteredData(tempData);
  }, [data, filters]);

  // Toggle column visibility
  const handleColumnToggle = (key) => {
    setSelectedColumns((prevSelectedColumns) => {
      const updatedColumns = prevSelectedColumns.includes(key)
        ? prevSelectedColumns.filter((colKey) => colKey !== key)
        : [...prevSelectedColumns, key];

      console.log("Updated Columns:", updatedColumns);
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

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://192.168.1.9:9898/save/pooling",
        values
      );
      console.log(response);
      message.success("Pool saved successfully!");
      setCreateModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error("Failed to save pool!");
    }
  };

  // Function to reset form to default values
  const resetConfigToDefault = () => {
    form.setFieldsValue({
      pool_name: "",
      master_account: "",
      currency: "",
      participating_accounts: [],
      status: "",
      balance: "",
      liquidity_threshold: "",
      interest: "",
      auto_rebalancing: "",
    });
  };

  // Handle filter form submission
  const handleFilterSubmit = (values) => {
    setFilters({
      poolName: values.poolName || "",
      masterAccount: values.masterAccount || "",
      currency: values.currency || "",
      participatingAccounts: values.participatingAccounts || "",
      status: values.status || "",
      nextExecution: values.nextExecution || null,
      balance: values.balance || "",
      liquidityThreshold: values.liquidityThreshold || "",
      lastPoolUpdate: values.lastPoolUpdate || null,
      interest: values.interest || "",
      autoRebalancing: values.autoRebalancing || "",
    });
    setFilterModalVisible(false);
  };

  // Reset filters
  const resetFilters = () => {
    filterForm.resetFields();
    setFilters({
      poolName: "",
      masterAccount: "",
      currency: "",
      participatingAccounts: "",
      status: "",
      nextExecution: null,
      balance: "",
      liquidityThreshold: "",
      lastPoolUpdate: null,
      interest: "",
      autoRebalancing: "",
    });
  };

  // Filter dropdown menu
  const filterMenu = (
    <Menu>
      <Menu.Item key="filter">
        <Button
          onClick={() => setFilterModalVisible(true)}
          style={{ border: "none", boxShadow: "none" }}
        >
          Open Filter Modal
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Buttons Section */}
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
          icon={<SettingOutlined />}
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={() => setModalVisible(true)}
        >
          Customize
        </Button>
        <Dropdown overlay={filterMenu} trigger={["click"]}>
          <Button
            icon={<FilterOutlined />}
            Wtype="primary"
            style={{ marginLeft: "10px" }}
          >
            Filters
          </Button>
        </Dropdown>
      </div>

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

      {/* Create Pool Modal */}
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
            rules={[
              {
                required: true,
                message: "Please select a Status",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select an option"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "Active", label: "Active" },
                { value: "InActive", label: "InActive" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Next Execution"
            name="next_execution"
            rules={[
              { required: true, message: "Please enter Next Execution Date" },
            ]}
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
            rules={[
              { required: true, message: "Please Select for Auto Rebalance" },
            ]}
          >
            <Select
              showSearch
              placeholder="Select an option"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
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

      {/* Filter Modal */}
      <Modal
        title="Filters"
        open={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        footer={[
          <Button key="clear" onClick={resetFilters}>
            Clear
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => filterForm.submit()}
          >
            Apply
          </Button>,
        ]}
      >
        <Form form={filterForm} layout="vertical" onFinish={handleFilterSubmit}>
          <Form.Item label="Pool Name" name="poolName">
            <Input placeholder="Enter Pool Name" />
          </Form.Item>
          <Form.Item label="Master Account" name="masterAccount">
            <Input placeholder="Enter Master Account" />
          </Form.Item>
          <Form.Item label="Currency" name="currency">
            <Input placeholder="Enter Currency" />
          </Form.Item>
          <Form.Item label="Participating Accounts" name="participatingAccounts">
            <Input placeholder="Enter Participating Account" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select Status"
              allowClear
              options={[
                { value: "Active", label: "Active" },
                { value: "InActive", label: "InActive" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Next Execution" name="nextExecution">
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder="Select Next Execution Date"
            />
          </Form.Item>
          <Form.Item label="Balance" name="balance">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter Balance"
            />
          </Form.Item>
          <Form.Item label="Liquidity Threshold" name="liquidityThreshold">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter Liquidity Threshold"
            />
          </Form.Item>
          <Form.Item label="Last Pool Update" name="lastPoolUpdate">
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder="Select Last Pool Update Date"
            />
          </Form.Item>
          <Form.Item label="Interest Rate(%)" name="interest">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter Interest Rate"
            />
          </Form.Item>
          <Form.Item label="Auto-Rebalancing" name="autoRebalancing">
            <Select
              placeholder="Select Auto-Rebalancing"
              allowClear
              options={[
                { value: "yes", label: "Yes" },
                { value: "enabled", label: "Enabled" },
                { value: "no", label: "No" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Pooling Table */}
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