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

const allColumns = [
  {
    title: "Msg ID",
    dataIndex: "msg_id",
    key: "msg_id",
    render: (text) => text || "--",
  },
  {
    title: "Creation Date Time",
    dataIndex: "creation_date_time",
    key: "creation_date_time",
    render: (text) => text || "--",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (text) => text || "--",
  },
  {
    title: "Debtor Name",
    dataIndex: "debtor_name",
    key: "debtor_name",
    render: (text) => text || "--",
  },
  {
    title: "Debtor Address",
    dataIndex: "debtor_address",
    key: "debtor_address",
    render: (text) => text || "--",
  },
  {
    title: "Debtor Agent BIC",
    dataIndex: "debtor_agent_bic",
    key: "debtor_agent_bic",
    render: (text) => text || "--",
  },
  {
    title: "Debtor Account ID",
    dataIndex: "debtor_account_id",
    key: "debtor_account_id",
    render: (text) => text || "--",
  },
  {
    title: "Creditor Name",
    dataIndex: "creditor_name",
    key: "creditor_name",
    render: (text) => text || "--",
  },
  {
    title: "Creditor Address",
    dataIndex: "creditor_address",
    key: "creditor_address",
    render: (text) => text || "--",
  },
  {
    title: "Creditor Agent BIC",
    dataIndex: "creditor_agent_bic",
    key: "creditor_agent_bic",
    render: (text) => text || "--",
  },
  {
    title: "Creditor Account ID",
    dataIndex: "creditor_account_id",
    key: "creditor_account_id",
    render: (text) => text || "--",
  },
  {
    title: "Network Type",
    dataIndex: "network_type",
    key: "network_type",
    render: (text) => text || "--",
  },
  {
    title: "Debtor Bank Name",
    dataIndex: "debtor_bank_name",
    key: "debtor_bank_name",
    render: (text) => text || "--",
  },
  {
    title: "Creditor Bank Name",
    dataIndex: "creditor_bank_name",
    key: "creditor_bank_name",
    render: (text) => text || "--",
  },
  {
    title: "Transaction Date",
    dataIndex: "transaction_date",
    key: "transaction_date",
    render: (text) => text || "--",
  },
  {
    title: "Fraud Status",
    dataIndex: "fraud_status",
    key: "fraud_status",
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

const AnamolyDetectionTable = ({
  data =  [
    {
        "msg_id": "MSGIDDK00034",
        "creation_date_time": "2025-03-27 10:35:00",
        "amount": 1125887.34,
        "debtor_name": "NovaMatrix Technologies",
        "debtor_address": "MECKENEMSTRASSE 10 46395 BOCHOLT GERMANY",
        "debtor_agent_bic": "BOVBDE8H",
        "debtor_account_id": "DE84295337706984956921",
        "creditor_name": "QuantumTech Systems",
        "creditor_address": "C/ JOSE MARIA OLABARRI 1 48001 BILBAO SPAIN",
        "creditor_agent_bic": "BPFEES73",
        "creditor_account_id": "ES3090357547846647899565",
        "network_type": "ACH",
        "debtor_bank_name": "Wells FargoCo",
        "creditor_bank_name": "Bank of Bavaria",
        "transaction_date": "2025-03-26 05:17:00",
        "fraud_status": "Non Suspicious"
      },
    {
      "msg_id": "MSGIDDK00035",
      "creation_date_time": "2025-03-27 11:00:00",
      "amount": 2500000.00,
      "debtor_name": "TechVision Ltd",
      "debtor_address": "123 Silicon Avenue, San Jose, CA, USA",
      "debtor_agent_bic": "CHASUS33",
      "debtor_account_id": "US6758493023847658493",
      "creditor_name": "AI Global Solutions",
      "creditor_address": "56 Innovation Road, London, UK",
      "creditor_agent_bic": "HSBCGB2L",
      "creditor_account_id": "GB29NWBK60161331926819",
      "network_type": "SWIFT",
      "debtor_bank_name": "JPMorgan Chase",
      "creditor_bank_name": "HSBC Bank",
      "transaction_date": "2025-03-26 09:15:00",
      "fraud_status": "Suspicious"
    },
    {
      "msg_id": "MSGIDDK00036",
      "creation_date_time": "2025-03-27 12:20:00",
      "amount": 480000.75,
      "debtor_name": "BlueWave Enterprises",
      "debtor_address": "89 Ocean Drive, Sydney, Australia",
      "debtor_agent_bic": "ANZBAU3M",
      "debtor_account_id": "AU123456789012345678",
      "creditor_name": "GreenFuture Ltd",
      "creditor_address": "23 Renewable Street, Berlin, Germany",
      "creditor_agent_bic": "DEUTDEFF",
      "creditor_account_id": "DE09876543210987654321",
      "network_type": "SEPA",
      "debtor_bank_name": "ANZ Bank",
      "creditor_bank_name": "Deutsche Bank",
      "transaction_date": "2025-03-26 15:45:00",
      "fraud_status": "Non Suspicious"
    },
    {
      "msg_id": "MSGIDDK00037",
      "creation_date_time": "2025-03-27 14:05:00",
      "amount": 965432.99,
      "debtor_name": "Redwood Technologies",
      "debtor_address": "456 Tech Valley, Dublin, Ireland",
      "debtor_agent_bic": "AIBKIE2D",
      "debtor_account_id": "IE29AIBK93115212345678",
      "creditor_name": "CyberCore Ltd",
      "creditor_address": "78 Data Park, Zurich, Switzerland",
      "creditor_agent_bic": "UBSWCHZH",
      "creditor_account_id": "CH5604835012345678009",
      "network_type": "SWIFT",
      "debtor_bank_name": "Allied Irish Bank",
      "creditor_bank_name": "UBS Bank",
      "transaction_date": "2025-03-26 11:30:00",
      "fraud_status": "Under Investigation"
    },
    {
      "msg_id": "MSGIDDK00038",
      "creation_date_time": "2025-03-27 16:45:00",
      "amount": 315678.42,
      "debtor_name": "Sunrise Logistics",
      "debtor_address": "12 Harbor Street, Los Angeles, USA",
      "debtor_agent_bic": "BOFAUS3N",
      "debtor_account_id": "US1234009876543210009",
      "creditor_name": "Global Freight Ltd",
      "creditor_address": "7 Cargo Lane, Singapore",
      "creditor_agent_bic": "DBSSSGSG",
      "creditor_account_id": "SG5432109876543210009",
      "network_type": "ACH",
      "debtor_bank_name": "Bank of America",
      "creditor_bank_name": "DBS Bank",
      "transaction_date": "2025-03-26 18:20:00",
      "fraud_status": "Non Suspicious"
    },
    {
      "msg_id": "MSGIDDK00039",
      "creation_date_time": "2025-03-27 17:50:00",
      "amount": 1500000.00,
      "debtor_name": "Future Innovators Inc",
      "debtor_address": "99 AI Street, San Francisco, USA",
      "debtor_agent_bic": "CITIUS33",
      "debtor_account_id": "US9876543210123456789",
      "creditor_name": "Quantum Analytics",
      "creditor_address": "18 Data Drive, Tokyo, Japan",
      "creditor_agent_bic": "MUFGJPJT",
      "creditor_account_id": "JP123456789012345678",
      "network_type": "SWIFT",
      "debtor_bank_name": "Citibank",
      "creditor_bank_name": "MUFG Bank",
      "transaction_date": "2025-03-26 20:10:00",
      "fraud_status": "Suspicious"
    }
  ]
  
}) => {
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
        msg_id: "",
      creation_date_time: "",
      amount: "",
      reserved_amount: "",
      debtor_address: "",
      debtor_agent_bic: "",
      debtor_account_id: "",
      creditor_name: "",
      creditor_address: "",
      creditor_agent_bic: "",
      creditor_account_id: "",
      network_type: "",
      debtor_bank_name: "",
      creditor_bank_name: "",
      transaction_date: "",
      fraud_status: "",
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
            label="Message ID"
            name="msg_id"
            rules={[{ required: true, message: "please enter reserve name" }]}
          >
            <Input placeholder="Enter reserve name" />
          </Form.Item>

          <Form.Item
            label="creation_date_time"
            name="creation_date_time"
            rules={[{ required: true, message: "please enter Master Account" }]}
          >
            <Input placeholder="Enter master account" />
          </Form.Item>

          <Form.Item
            label="amount"
            name="amount"
            rules={[{ required: true, message: "please enter Amount " }]}
          >
            <Input placeholder="Enter Amount " />
          </Form.Item>

          <Form.Item
            label="Debtor Name"
            name="debtor_name"
            rules={[
              { required: true, message: "please enter Debtor Name " },
            ]}
          >
            <Input placeholder="Enter Debtor Name " />
          </Form.Item>

          <Form.Item
            label="Debtor Address"
            name="debtor_address"
            rules={[
              { required: true, message: "please enter Minimum Required" },
            ]}
          >
            <Input placeholder="Enter minimum required" />
          </Form.Item>

          <Form.Item
            label="Debtor Agent BIC"
            name="debtor_agent_bic"
            rules={[{ required: true, message: "please select a Debtor Agent BIC " }]}
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
            label="Creditor Name"
            name="creditor_name"
            rules={[{ required: true, message: "please enter Creditor Name" }]}
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

export default AnamolyDetectionTable;
