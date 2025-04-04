import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Typography,
  Tag,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  Drawer,
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

const { Title } = Typography;

const allColumns = [
  { title: "Network Name", dataIndex: "name", key: "name" },
  { title: "Bank Name", dataIndex: "companyName", key: "companyName" },
  { title: "Type", dataIndex: "type", key: "type" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "Active" ? "green" : "red"}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
  { title: "Additional Information", dataIndex: "additionalInfo", key: "additionalInfo" },
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

const NetworkResolution = () => {
  const networks = [
    {
      _id: "67448270de0805626422af6e",
      name: "TCH",
      status: "Active",
      additionalInfo: "",
      type: "Secondary",
      companyName: "Wells Fargo & Co.",
    },
    {
      _id: "67448270de0805626422af6d",
      name: "FED",
      status: "Active",
      additionalInfo: "FedNow Service is operational. No issues reported.",
      type: "Primary",
      companyName: "Wells Fargo & Co.",
    },
  ];

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

  const filteredData = networks.filter((item) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      return item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  const handleCreateSubmit = (values) => {
    message.success("Network created successfully!");
    form.resetFields();
    setCreateModalVisible(false);
  };

  return (
    <div>
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

      <Drawer
        title="Filter Networks"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
      >
        <Form
          layout="vertical"
          onValuesChange={(changedValues, allValues) => setFilters(allValues)}
        >
          <Form.Item label="Network Name" name="name">
            <Input placeholder="Enter network name" />
          </Form.Item>
          <Form.Item label="Bank Name" name="companyName">
            <Input placeholder="Enter bank name" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select
              placeholder="Select type"
              options={[
                { value: "Primary", label: "Primary" },
                { value: "Secondary", label: "Secondary" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Create Network"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item
            label="Network Name"
            name="name"
            rules={[{ required: true, message: "Please enter network name" }]}
          >
            <Input placeholder="Enter network name" />
          </Form.Item>
          <Form.Item
            label="Bank Name"
            name="companyName"
            rules={[{ required: true, message: "Please enter bank name" }]}
          >
            <Input placeholder="Enter bank name" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select
              placeholder="Select type"
              options={[
                { value: "Primary", label: "Primary" },
                { value: "Secondary", label: "Secondary" },
              ]}
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
                { value: "Inactive", label: "Inactive" },
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

      <Card style={{ width: "100%", margin: "20px auto" }}>
        <Title level={4}>Network Status</Title>
        <Table
          columns={filteredColumns}
          dataSource={filteredData}
          pagination={false}
          bordered
          rowKey="_id"
        />
      </Card>
    </div>
  );
};

export default NetworkResolution;