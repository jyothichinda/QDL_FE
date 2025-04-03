import React, { useState, useEffect } from "react";
import { Card, Table, Typography, Tag, Button, message, Modal } from "antd";

const { Title } = Typography;

const NetworkResolution = () => {

  const networks = [
    {
      "_id": "67448270de0805626422af6e",
      "name": "TCH",
      "status": "Active",
      "additionalInfo": "",
      "type": "Secondary",
      "companyId": "673c624d7b08b529fceb6e2a",
      "companyName": "Wells Fargo & Co.",
      "country": "US",
      "city": "New York",
      "approved": true,
      "bic": "CITIUS33XXX"
    },
    {
      "_id": "67448270de0805626422af6d",
      "name": "FED",
      "status": "Active",
      "additionalInfo": "FedNow Service is operational. No issues reported.",
      "type": "Primary",
      "companyId": "673c624d7b08b529fceb6e2a",
      "companyName": "Wells Fargo & Co.",
      "country": "US",
      "city": "Charlotte",
      "approved": false,
      "bic": "BOFAUS3NXXX"
    }
  ]

  const [isSwitched, setIsSwitched] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [primaryNetwork, setPrimaryNetwork] = useState(null);
  const [secondaryNetwork, setSecondaryNetwork] = useState(null);

  useEffect(() => {
    if (networks) {
      setPrimaryNetwork(networks.find((network) => network.type === "Primary"));
      setSecondaryNetwork(
        networks.find((network) => network.type === "Secondary")
      );
    }
  }, [networks]);

  const handleSwitchNetwork = () => {
    setIsModalVisible(true);
  };

  const confirmSwitchNetwork = async () => {
    if (!secondaryNetwork) {
      message.error("Secondary network details are unavailable.");
      return;
    }
  };

  const cancelSwitchNetwork = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Network Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Bank Name",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
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
    {
      title: "Additional Information",
      dataIndex: "additionalInfo",
      key: "additionalInfo",
    },
  ];

  return (
    <div>
      <Card
        style={{ width: "100%", margin: "20px auto" }}
      >
        <Title
          style={{
            backgroundColor: "#ffffff",
            color: "black",
          }}
          level={4}
        >
          Network Status
        </Title>
        <Table
          columns={columns}
          dataSource={networks}
          pagination={false}
          bordered
          rowClassName={() => ("light-row")}
          style={{
            backgroundColor: "#ffffff",
            color: "black",
          }}
        />
      </Card>

      {!isSwitched && primaryNetwork?.status === "Down" && (
        <Card
          className={`ant-card`}
          style={{ width: "100%", margin: "20px auto" }}
        >
          <Title
            style={{
              backgroundColor: "#ffffff",
              color: "black",
            }}
            level={4}
          >
            Primary network {primaryNetwork?.name} is down
          </Title>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>
              Do you want to switch to the secondary network{" "}
              {secondaryNetwork?.name} ({secondaryNetwork?.companyName})?
            </p>
            <Button type="primary" onClick={handleSwitchNetwork}>
              Switch to {secondaryNetwork?.name}
            </Button>
          </div>
        </Card>
      )}

      <Modal
        title="Confirm Network Switch"
        open={isModalVisible}
        onOk={confirmSwitchNetwork}
        onCancel={cancelSwitchNetwork}
        okText="Yes"
        cancelText="No"
      >
        <p>
          Are you sure you want to switch from {primaryNetwork?.name} to{" "}
          {secondaryNetwork?.name}?
        </p>
      </Modal>

      {isSwitched && (
        <Card style={{ width: "100%", margin: "20px auto" }}>
          <Title level={4}>Network Switch</Title>
          <p>
            {primaryNetwork?.name} was down, switched to{" "}
            {secondaryNetwork?.name}.
          </p>
        </Card>
      )}
    </div>
  );
};

export default NetworkResolution;
