import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Card } from "antd";
import { SettingOutlined, MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { data } from "../utils/dummydata";

const allColumns = [
  { title: "Transaction Id", dataIndex: "transactionId", key: "transactionId" },
  { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
  { title: "Message Id", dataIndex: "messageId", key: "messageId" },
  { title: "Transaction Amount", dataIndex: "transactionAmount", key: "transactionAmount" },
  { title: "Applied Rule IDs", dataIndex: "appliedRules", key: "appliedRules" },
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Last Updated", dataIndex: "lastUpdated", key: "lastUpdated" },
  { title: "Auto Refill", dataIndex: "autoRefill", key: "autoRefill" },
  { title: "Action", dataIndex: "action", key: "action" },
];

const RepairWorkFlowTable = () => {
  const savedColumns = JSON.parse(localStorage.getItem("selectedColumns")) || allColumns.map((col) => col.key);
  const savedOrder = JSON.parse(localStorage.getItem("columnOrder")) || allColumns;

  const [selectedColumns, setSelectedColumns] = useState(savedColumns);
  const [columnsOrder, setColumnsOrder] = useState(savedOrder);
  const [modalVisible, setModalVisible] = useState(false);

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

  return (
    <div style={{ padding: "20px" }}>
      <Button icon={<SettingOutlined />} type="primary" onClick={() => setModalVisible(true)}>
        Customize
      </Button>

      <Modal
        title="Customize Columns"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="reset" onClick={resetToDefault}>Reset to Default</Button>,
          <Button key="close" type="primary" onClick={() => setModalVisible(false)}>Done</Button>,
        ]}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={columnsOrder.map((col) => col.key)} strategy={verticalListSortingStrategy}>
            {columnsOrder.map((column) => (
              <Card key={column.key} style={{ marginBottom: 8, padding: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {selectedColumns.includes(column.key) ? (
                    <MinusSquareOutlined style={{ color: "red", cursor: "pointer" }} onClick={() => handleColumnToggle(column.key)} />
                  ) : (
                    <PlusSquareOutlined style={{ color: "green", cursor: "pointer" }} onClick={() => handleColumnToggle(column.key)} />
                  )}
                  <span>{column.title}</span>
                </div>
              </Card>
            ))}
          </SortableContext>
        </DndContext>
      </Modal>

      <Table
        columns={filteredColumns}
        dataSource={data.map((record, index) => ({ ...record, key: record.id || index }))}
        rowKey="key"
      />
    </div>
  );
};

export default RepairWorkFlowTable;