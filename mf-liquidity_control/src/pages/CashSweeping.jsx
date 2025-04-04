import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Select,
  Drawer,
  message,
  Card,
} from "antd";
import {
  SettingOutlined,
  EditOutlined,
  FilterOutlined,
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
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import axios from "axios";

const allColumns = [
  { title: "Sweep Name", dataIndex: "sweep_name", key: "sweep_name" },
  { title: "Master Account", dataIndex: "master_account", key: "master_account" },
  { title: "Currency", dataIndex: "currency", key: "currency" },
  { title: "Sweep Direction", dataIndex: "sweep_direction", key: "sweep_direction" },
  { title: "Frequency", dataIndex: "frequency", key: "frequency" },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Threshold Limit", dataIndex: "threshold_limit", key: "threshold_limit" },
  { title: "Enable Auto Transfer", dataIndex: "enable_auto_transfer", key: "enable_auto_transfer" },
  { title: "Next Execution", dataIndex: "next_execution", key: "next_execution" },
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

const SweepingTable = ({
  data = [
    {
      "id": 4,
      "sweep_name": "Weekly Sweep - XYZ Ltd",
      "master_account": "XYZ Bank - 002",
      "sweep_direction": "Bi-Directional",
      "frequency": "Weekly",
      "status": "Inactive",
      "threshold_limit": 5000,
      "currency": "EUR",
      "action": "View",
      "enable_auto_transfer": "YES",
      "next_execution": [2025, 3, 19, 18, 30]
    },
    {
      id: 1,
      sweep_name: "Test Sweep",
      master_account: "Account 1",
      currency: "USD",
      sweep_direction: "onewaydirection",
      frequency: "daily",
      status: "active",
      threshold_limit: 1000,
      enable_auto_transfer: "yes",
      next_execution: [2025, 3, 19, 18, 30],
    },
    {
      id: 2,
      sweep_name: "Weekly Sweep",
      master_account: "Account 2",
      currency: "EUR",
      sweep_direction: "biwaydirection",
      frequency: "weekly",
      status: "inactive",
      threshold_limit: 2000,
      enable_auto_transfer: "no",
      next_execution: [2025, 3, 21, 18, 30],
    },
    {
      "id": 3,
      "sweep_name": "Test 3",
      "master_account": "Check 3",
      "sweep_direction": "onewaydirection",
      "frequency": "Monthly",
      "status": "active",
      "threshold_limit": 3000,
      "currency": "USD",
      "action": null,
      "enable_auto_transfer": "yes",
      "next_execution": [2025, 3, 30, 18, 30]
    },
    {
      "id": 5,
      "sweep_name": "Test 4",
      "master_account": "Check 4",
      "sweep_direction": "onewaydirection",
      "frequency": "Daily",
      "status": "active",
      "threshold_limit": 1590,
      "currency": "INR",
      "action": null,
      "enable_auto_transfer": "yes",
      "next_execution": [2025, 3, 25, 18, 30]
    },
    {
      "id": 6,
      "sweep_name": "ABC",
      "master_account": "AB",
      "sweep_direction": "onewaydirection",
      "frequency": "10",
      "status": "active",
      "threshold_limit": 200000,
      "currency": "USD",
      "action": null,
      "enable_auto_transfer": "yes",
      "next_execution": [2025, 3, 28, 18, 30]
    },
    {
      "id": 7,
      "sweep_name": "A",
      "master_account": "BC",
      "sweep_direction": "biwaydirection",
      "frequency": "Weekly",
      "status": "active",
      "threshold_limit": 20000,
      "currency": "INR",
      "action": null,
      "enable_auto_transfer": "yes",
      "next_execution": [2025, 3, 29, 18, 30]
    },
    {
      "id": 8,
      "sweep_name": "B",
      "master_account": "CSA",
      "sweep_direction": "onewaydirection",
      "frequency": "Weekly",
      "status": "active",
      "threshold_limit": 20000,
      "currency": "INR",
      "action": null,
      "enable_auto_transfer": "yes",
      "next_execution": [2025, 3, 30, 18, 30]
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
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [customizeModalVisible, setCustomizeModalVisible] = useState(false);
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
        "http://192.168.1.9:9898/save/sweeping",
        values
      );
      message.success("Sweeping saved successfully!");
      setModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error("Failed to save sweeping!");
    }
  };

  const resetSweepToDefault = () => {
    form.resetFields();
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Filter, Create, and Customize Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
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
          onClick={() => setModalVisible(true)}
        >
          Create
        </Button>
        <Button
          icon={<SettingOutlined />}
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={() => setCustomizeModalVisible(true)}
        >
          Customize
        </Button>
      </div>

      {/* Filter Drawer */}
      <Drawer
        title="Filter Sweeping"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
      >
        <Form
          layout="vertical"
          onValuesChange={(changedValues, allValues) => setFilters(allValues)}
        >
          <Form.Item label="Sweep Direction" name="sweep_direction">
            <Select
              placeholder="Select Sweep Direction"
              options={[
                { value: "onewaydirection", label: "One-Way Direction" },
                { value: "biwaydirection", label: "Bi-Directional" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Frequency" name="frequency">
            <Select
              placeholder="Select Frequency"
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Currency" name="currency">
            <Select
              placeholder="Select Currency"
              options={[
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
                { value: "INR", label: "INR" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Enable Auto Transfer" name="enable_auto_transfer">
            <Select
              placeholder="Select Auto Transfer"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Customize Columns Modal */}
      <Modal
        title="Customize Columns"
        open={customizeModalVisible}
        onCancel={() => setCustomizeModalVisible(false)}
        footer={[
          <Button key="reset" onClick={resetToDefault}>
            Reset to Default
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => setCustomizeModalVisible(false)}
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

      {/* Create Modal */}
      <Modal
        title="Create Sweeping"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Sweep Name"
            name="sweep_name"
            rules={[{ required: true, message: "Please enter sweep name" }]}
          >
            <Input placeholder="Enter sweep name" />
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
            label="Sweep Direction"
            name="sweep_direction"
            rules={[{ required: true, message: "Please select Sweep Direction" }]}
          >
            <Select
              placeholder="Select Direction"
              options={[
                { value: "onewaydirection", label: "One-Way Direction" },
                { value: "biwaydirection", label: "Bi-Directional" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Frequency"
            name="frequency"
            rules={[{ required: true, message: "Please enter Frequency" }]}
          >
            <Select
              placeholder="Select Frequency"
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Threshold Limit"
            name="threshold_limit"
            rules={[{ required: true, message: "Please enter Threshold Limit" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter Threshold Limit"
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select Status" }]}
          >
            <Select
              placeholder="Select Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
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
            label="Enable Auto Transfer"
            name="enable_auto_transfer"
            rules={[{ required: true, message: "Please select Auto Transfer" }]}
          >
            <Select
              placeholder="Select Auto Transfer"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={resetSweepToDefault} style={{ marginRight: 10 }}>
              Reset to Default
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Sweeping Table */}
      <Table
        columns={filteredColumns}
        dataSource={filteredData.map((record, index) => ({
          ...record,
          key: record.id || index, // Ensure key is unique
        }))}
        rowKey="key"
      />
    </div>
  );
};

export default SweepingTable;