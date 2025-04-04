import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Card, Form, Input, Select, message, Drawer } from "antd";
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

const ReservesTable = ({
  data = [
    {
      id: 1,
      reserve_name: "Reserve 1",
      master_account: "MasterAccount1",
      currency: "USD",
      reserved_amount: 500000,
      minimum_required: 10000,
      status: "Active",
      last_updated: [2025, 3, 19, 14, 30],
      auto_refill: "Yes",
    },
    {
      id: 2,
      reserve_name: "Test",
      master_account: "Test",
      currency: "USD",
      reserved_amount: 10000,
      minimum_required: 7000,
      status: "Active",
      last_updated: null,
      auto_refill: "yes",
    },
  ],
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
  const [filters, setFilters] = useState({}); // Store filter values

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
  const filteredData = data.filter((item) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true; // Skip empty filters
      return item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* Settings and Filter Buttons */}
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
          <Form.Item label="Master Account" name="master account">
            <Input placeholder="Enter master account" />
          </Form.Item>
          <Form.Item label="Currency" name="currency">
            <Input placeholder="Enter currency" />
          </Form.Item>
          <Form.Item label="Reserved Amount" name="reserved amount">
            <Input placeholder="Enter reserved amount" />
          </Form.Item>
          <Form.Item label="Minimum Required" name="minimum required">
            <Input placeholder="Enter minimum required" />
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
          <Form.Item label="Auto Refill" name="auto_refill">
            <Select
              placeholder="Select auto refill"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>

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
              <div key={column.key}>
                <span>{column.title}</span>
              </div>
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