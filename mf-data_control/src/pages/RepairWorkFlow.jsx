import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Card, Drawer, Form, Input, Select } from "antd";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import data from "../utils/dummydata";

const allColumns = [
  { title: "Transaction Id", dataIndex: "_id", key: "_id" },
  { title: "Customer Name", dataIndex: "debtorName", key: "debtorName" },
  { title: "Transaction Amount", dataIndex: "amount", key: "amount" },
  { title: "Applied Rule IDs", dataIndex: "rulesIDs", key: "rulesIDs" },
  { title: "Status", dataIndex: "fileStatus", key: "fileStatus" },
];

const SortableItem = ({ column, isChecked, onToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
    padding: 10,
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {isChecked ? (
        <MinusSquareOutlined
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => onToggle(column.key)}
        />
      ) : (
        <PlusSquareOutlined
          style={{ color: "green", cursor: "pointer" }}
          onClick={() => onToggle(column.key)}
        />
      )}
      <span>{column.title}</span>
    </div>
  );
};

const RepairWorkFlowTable = () => {
  const savedColumns = JSON.parse(localStorage.getItem("selectedColumns")) || allColumns.map((col) => col.key);
  const savedOrder = JSON.parse(localStorage.getItem("columnOrder")) || allColumns;

  const [selectedColumns, setSelectedColumns] = useState(savedColumns);
  const [columnsOrder, setColumnsOrder] = useState(savedOrder);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    localStorage.setItem("columnOrder", JSON.stringify(columnsOrder));
  }, [selectedColumns, columnsOrder]);

  const handleColumnToggle = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((colKey) => colKey !== key) : [...prev, key]
    );
  };

  const resetToDefault = () => {
    setSelectedColumns(allColumns.map((col) => col.key));
    setColumnsOrder(allColumns);
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columnsOrder.findIndex((col) => col.key === active.id);
      const newIndex = columnsOrder.findIndex((col) => col.key === over.id);
      setColumnsOrder(arrayMove(columnsOrder, oldIndex, newIndex));
    }
  };

  const filteredColumns = columnsOrder.filter((col) => selectedColumns.includes(col.key));

  const filteredData = data.paymentFiles.filter((item) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  const tableData = filteredData.map((record, index) => ({
    key: record._id || index, // Ensure unique key
    _id: record._id || "--",
    debtorName: record.debtor?.debtorName || "--",
    amount: record.amount || "--",
    rulesIDs: Array.isArray(record.rulesIDs)
      ? record.rulesIDs.join(", ")
      : record.rulesIDs || "--",
    fileStatus: record.fileStatus || "--",
  }));

  return (
    <div style={{ padding: "20px" }}>
      {/* Buttons aligned to the right */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
          gap: "10px",
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
          onClick={() => setFilterDrawerVisible(true)}
        >
          Filter
        </Button>
        <Button
          icon={<SettingOutlined />}
          type="primary"
          onClick={() => setModalVisible(true)}
        >
          Customize
        </Button>
      </div>

      {/* Filter Drawer */}
      <Drawer
        title="Filter Records"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
      >
        <Form
          layout="vertical"
          onValuesChange={(changedValues, allValues) => setFilters(allValues)}
        >
          <Form.Item label="_id" name="_id">
            <Input placeholder="Enter Transaction Id" />
          </Form.Item>
          <Form.Item label="CustomerName" name="customerName">
            <Input placeholder="Enter Customer Name" />
          </Form.Item>
          <Form.Item label="fileStatus" name="fileStatus">
            <Select
              placeholder="Select Status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Auto Refill" name="autoRefill">
            <Select
              placeholder="Select Auto Refill"
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
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="reset" onClick={resetToDefault}>
            Reset to Default
          </Button>,
          <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
            Done
          </Button>,
        ]}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={columnsOrder.map((col) => col.key)} strategy={verticalListSortingStrategy}>
            {columnsOrder.map((column) => (
              <SortableItem
                rowKey={column.key} // Ensure each column has a unique key
                column={column}
                isChecked={selectedColumns.includes(column.key)}
                onToggle={handleColumnToggle}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Modal>

      {/* Table */}
      <Table columns={filteredColumns} dataSource={tableData} rowKey="key" />
    </div>
  );
};

export default RepairWorkFlowTable;