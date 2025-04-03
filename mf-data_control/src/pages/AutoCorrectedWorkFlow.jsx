import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Card, Form, Input, Select, message } from "antd";
import {
  SettingOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  EditOutlined,
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
 
import {data} from '../utils/dummydata'
 
const allColumns = [
  {
    title: "Transaction Id",
    dataIndex: "_id",
    key: "_id",
    render: (text) => text || "--",
  },
  {
    title: "Customer Name",
    dataIndex: "debtor.debtorName",
    key: "debtor.debtorName",
    render: (text) => text || "--",
  },
  {
    title: "Message Id",
    dataIndex: "msgId",
    key: "msgId",
    render: (text) => text || "--",
  },
  {
    title: "Transaction Amount",
    dataIndex: "amount",
    key: "amount",
    render: (text) => text || "--",
  },
  {
    title: "Applied Rule IDs",
    dataIndex: "ruleIDs",
    key: "ruleIDs",
    render: (text) => text || "--",
  },
  {
    title: "Status",
    dataIndex: "fileStatus",
    key: "fileStatus",
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
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text) => text || "--",
  },
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
 
const AutoCorrectedWorkFlow = () => {
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
 
  // Persist preferences
  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    localStorage.setItem("columnOrder", JSON.stringify(columnsOrder));
  }, [selectedColumns, columnsOrder]);
 
  // Toggle column visibility
  const handleColumnToggle = (key) => {
    setSelectedColumns((prevSelectedColumns) => {
      const updatedColumns = prevSelectedColumns.includes(key)
        ? prevSelectedColumns.filter((colKey) => colKey !== key) // Remove column when unchecked
        : [...prevSelectedColumns, key]; // Add column when checked
 
      console.log("Updated Columns:", updatedColumns); // Debugging log
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
 
  const fetchData = async () => {
    try {
      const response = await axios.get(URL);
      setData(response.data); // Assuming the response data is in the correct format
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data!");
    }
  };
 
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://192.168.1.9:9898/save/cash_reserves",
        values
      );
      console.log(response);
      message.success("Cash Reserves saved successfully!");
      setCreateModalVisible(false);
      form.resetFields();
      // Refresh data after successful creation
      fetchData();
    } catch (error) {
      message.error("Failed to save cash reserve!");
    }
  };
 
  // Function to reset from default values
  const resetReserveToDefault = () => {
    form.setFieldsValue({
      reserve_name: "",
      master_account: "",
      currency: "",
      reserved_amount: "",
      minimum_required: "",
      status: "",
      last_updated: "",
      auto_refill: "",
      action: "",
    });
  };
 
  return (
    <div style={{ padding: "20px" }}>
      {/* Settings Button */}
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
 
      <Modal
        title="Create Cash Reserves"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Transaction Id"
            name="_id"
            rules={[{ required: true, message: "please enter Transaction Id" }]}
          >
            <Input placeholder="Enter _id" />
          </Form.Item>
 
          <Form.Item
            label="Customer Name"
            name="debtor.debtorName"
            rules={[{ required: true, message: "please enter debtor.debtorName" }]}
          >
            <Input placeholder="Enter debtor name" />
          </Form.Item>
 
          <Form.Item
            label="Message Id"
            name="msgId"
            rules={[{ required: true, message: "please enter  Message Id" }]}
          >
            <Input placeholder="Enter message id " />
          </Form.Item>
 
          <Form.Item
            label="Transaction Amount"
            name="amount"
            rules={[
              { required: true, message: "please enter Transaction Amount " },
            ]}
          >
            <Input placeholder="Enter transaction amount " />
          </Form.Item>
 
          <Form.Item
            label="Applied Rule IDs"
            name="ruleIDs"
            rules={[
              { required: true, message: "please enter Applied Rule IDs" },
            ]}
          >
            <Input placeholder="Enter applied rule IDs" />
          </Form.Item>
 
          <Form.Item
            label="Status"
            name="fileStatus"
            rules={[{ required: true, message: "please select a Status " }]}
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
            label="Auto Refill"
            name="auto_refill"
            rules={[{ required: true, message: "please enter Auto Refill" }]}
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
            <Button onClick={resetReserveToDefault} style={{ marginRight: 10 }}>
              Reset to Default
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
 
      {/* Transactions Table */}
      <Table
        columns={filteredColumns}
        dataSource={data.map((record, index) => ({
          ...record,
          key: record.id || index, // Ensure key is unique
        }))}
        rowKey="key" // Explicitly tell AntD which field is the unique key
      />
    </div>
  );
};
 
export default AutoCorrectedWorkFlow;