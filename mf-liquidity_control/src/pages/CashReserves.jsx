import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Input, Select, message, Drawer, InputNumber } from "antd";
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
  arrayMove,
  useSortable, // Import useSortable here
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";

const allColumns = [
  {
    title: "Reserve Name",
    dataIndex: "reserve_name",
    key: "reserve_name",
    render: (text) => text || "--",
  },
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
    title: "Reserved Amount",
    dataIndex: "reserved_amount",
    key: "reserved_amount",
    render: (text) => text || "--",
  },
  {
    title: "Minimum Required",
    dataIndex: "minimum_required",
    key: "minimum_required",
    render: (text) => text || "--",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => text || "--",
  },
  {
    title: "Last Updated",
    dataIndex: "last_updated",
    key: "last_updated",
    render: (text) => text || "--",
  },
  {
    title: "Auto Refill",
    dataIndex: "auto_refill",
    key: "auto_refill",
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

const ReservesTable = ({
  data = [
    {
      "id": 1,
      "reserve_name": "Reserve 1",
      "master_account": "MasterAccount1",
      "currency": "USD",
      "reserved_amount": 500000,
      "minimum_required": 10000,
      "status": "Active",
      "last_updated": [2025, 3, 19, 14, 30],
      "auto_refill": "Yes"
    },
    {
      "id": 2,
      "reserve_name": "Test",
      "master_account": "Test",
      "currency": "USD",
      "reserved_amount": 10000,
      "minimum_required": 7000,
      "status": "Active",
      "last_updated": null,
      "auto_refill": "yes"
    },
    {
      "id": 3,
      "reserve_name": "Test",
      "master_account": "Check",
      "currency": "USD",
      "reserved_amount": 10000,
      "minimum_required": 5000,
      "status": "InActive",
      "last_updated": [2025, 3, 19, 16, 13, 18, 35422000],
      "auto_refill": "yes"
    }
  ],
  fetchData,
}) => {
  const [selectedColumns, setSelectedColumns] = useState(
    JSON.parse(localStorage.getItem("selectedColumns")) || allColumns.map((col) => col.key)
  );
  const [columnsOrder, setColumnsOrder] = useState(
    JSON.parse(localStorage.getItem("columnOrder")) || allColumns
  );
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

  const handleCreateSubmit = async (values) => {
    try {
      await axios.post("http://192.168.1.9:9898/save/reserve", values);
      message.success("Reserve created successfully!");
      setCreateModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error("Failed to create reserve!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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
        title="Filter Reserves"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
      >
        <Form
          layout="vertical"
          onValuesChange={(changedValues, allValues) => setFilters(allValues)}
        >
          <Form.Item label="Reserve Name" name="reserve_name">
            <Input placeholder="Enter reserve name" />
          </Form.Item>
          <Form.Item label="Master Account" name="master_account">
            <Input placeholder="Enter master account" />
          </Form.Item>
          <Form.Item label="Currency" name="currency">
            <Input placeholder="Enter currency" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select status"
              options={[
                { value: "Active", label: "Active" },
                { value: "InActive", label: "InActive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Create Modal */}
      <Modal
        title="Create Reserve"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item
            label="Reserve Name"
            name="reserve_name"
            rules={[{ required: true, message: "Please enter reserve name" }]}
          >
            <Input placeholder="Enter reserve name" />
          </Form.Item>
          <Form.Item
            label="Master Account"
            name="master_account"
            rules={[{ required: true, message: "Please enter master account" }]}
          >
            <Input placeholder="Enter master account" />
          </Form.Item>
          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: "Please enter currency" }]}
          >
            <Input placeholder="Enter currency" />
          </Form.Item>
          <Form.Item
            label="Reserved Amount"
            name="reserved_amount"
            rules={[{ required: true, message: "Please enter reserved amount" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter reserved amount"
            />
          </Form.Item>
          <Form.Item
            label="Minimum Required"
            name="minimum_required"
            rules={[{ required: true, message: "Please enter minimum required" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Enter minimum required"
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder="Select status"
              options={[
                { value: "Active", label: "Active" },
                { value: "InActive", label: "InActive" },
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
          key: record.id || index,
        }))}
        rowKey="key"
      />
    </div>
  );
};

export default ReservesTable;