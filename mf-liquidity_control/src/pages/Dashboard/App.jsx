import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Select, Typography, Card, Tabs } from "antd";
import moment from "moment-timezone";
import { ArrowUpOutlined } from "@ant-design/icons"; // Import the icon

import DashBoardSkeleton from "./DashboardSkeleton";
import CardsContainer from "./CardsContainer";
import AreaChartContainer from "./AreaChartContainer";
import BarWithLineChartContainer from "./BarWithLineChartContainer";
import SunburstChart from "./SunburstChart";
import CashFlowTable from "./CashFlowTable";
import GuageChart from "./GaugeChart";
import DonutChart from "./DonutChart";
import axios from "axios";

const { Option } = Select;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [projectedData, setProjectedData] = useState([]);
  const [chartData, setChartData] = useState([
    {
      name: "Fixed Costs",
      children: [
        { name: "Salaries", value: 30 },
        { name: "Rent", value: 25 },
      ],
    },
    {
      name: "Variable Costs",
      children: [
        { name: "Inventory", value: 20 },
        { name: "Marketing", value: 15 },
        { name: "Utilities", value: 10 },
      ],
    },
  ]);
  const [txnData, setTxnData] = useState([
    {
      id: 148,
      msgId: "MSGIDDK00098",
      amount: 925887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 147,
      msgId: "MSGIDDK00098",
      amount: 625887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 146,
      msgId: "MSGIDDK00098",
      amount: 825887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 163,
      msgId: "MSGIDDK00034",
      amount: 1125887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 14,
      msgId: "MSGIDDK00028",
      amount: 925887.34,
      status: null,
      cashFlow: "Inflow",
    },
    {
      id: 15,
      msgId: "MSGIDDK00028",
      amount: 925887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 16,
      msgId: "MSGIDDK00028",
      amount: 126925887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 17,
      msgId: "MSGIDDK00028",
      amount: 41925887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 18,
      msgId: "MSGIDDK00028",
      amount: 41925887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 19,
      msgId: "MSGIDDK00028",
      amount: 21925887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 20,
      msgId: "MSGIDDK00028",
      amount: 21925887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 21,
      msgId: "MSGIDDK00028",
      amount: 21925887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 22,
      msgId: "MSGIDDK00028",
      amount: 21925887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 23,
      msgId: "MSGIDDK00028",
      amount: 21925887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 149,
      msgId: "MSGIDDK00098",
      amount: 925887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 150,
      msgId: "MSGIDDK00098",
      amount: 925887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 151,
      msgId: "MSGIDDK00098",
      amount: 925887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 164,
      msgId: "MSGIDDK00034",
      amount: 1125887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 152,
      msgId: "MSGIDDK00098",
      amount: 925887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 153,
      msgId: "MSGIDDK00048",
      amount: 825887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 154,
      msgId: "MSGIDDK00048",
      amount: 725887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 155,
      msgId: "MSGIDDK00038",
      amount: 625887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 156,
      msgId: "MSGIDDK00034",
      amount: 1225887.34,
      status: "Processing",
      cashFlow: "Inflow",
    },
    {
      id: 157,
      msgId: "MSGIDDK00037",
      amount: 1325887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 165,
      msgId: "MSGIDDK00034",
      amount: 1125887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 166,
      msgId: "MSGIDDK00034",
      amount: 1125887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 167,
      msgId: "MSGIDDK00034",
      amount: 1125887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 158,
      msgId: "MSGIDDK00034",
      amount: 1125887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
    {
      id: 159,
      msgId: "MSGIDDK00034",
      amount: 1125887.34,
      status: "Processing",
      cashFlow: "Outflow",
    },
  ]);

  const [selectedTimezone, setSelectedTimezone] = useState(
    localStorage.getItem("selectedTimezone") || "UTC"
  );
  const [currentTime, setCurrentTime] = useState(moment().tz(selectedTimezone));

  const apiHourlyData = [
    {
      timestamp: "2024-02-25 00:00",
      title: "Current Cash InFlow",
      amount: 1000.5,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 00:00",
      title: "Current Cash OutFlow",
      amount: 800.75,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 03:00",
      title: "Current Cash InFlow",
      amount: 1200.0,
      currency: "USD",
    },
    {
      timestamp: "2024-02-25 03:00",
      title: "Current Cash OutFlow",
      amount: 950.3,
      currency: "USD",
    },
  ];

  const apiMonthlyData = [
    {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
      series: [
        {
          name: "Debt",
          type: "column",
          data: [30000, 35000, 32000, 40000, 45000, 37000, 50000, 34000, 31000],
        },
        {
          name: "Equity",
          type: "column",
          data: [25000, 30000, 27000, 26000, 28000, 29000, 27000, 30000, 40000],
        },
      ],
    },
  ];

  const handleTimezoneChange = (value) => {
    setSelectedTimezone(value);
    localStorage.setItem("selectedTimezone", value);
  };

  // async function fetchProjectedData() {
  //   try {
  //     const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  //     const res = await axios.get(
  //       `http://192.168.1.2:9898/projected_data?date=${today}`
  //     );

  //     const roundToTwo = (value) => Number(value).toFixed(2);

  //     // Convert the response into an array format
  //     const formattedData = Object.entries(res.data.projectedData).map(
  //       ([key, value]) => ({
  //         id: key, // Use the key as a unique identifier
  //         title: formatTitle(key), // Format the key into a readable title
  //         amount: roundToTwo(value), // Round the value to two decimal places
  //         currency: "USD", // Add a default currency
  //       })
  //     );
  //     setProjectedData(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching projected data:", error);
  //   }
  // }

  // async function fetchTxnData() {
  //   try {
  //     const res = await axios.get(
  //       "http://192.168.1.2:9999/api/getAll_payments"
  //     );
  //     setTxnData(res.data || []);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  // Helper function to format keys into readable titles
  function formatTitle(key) {
    const titleMap = {
      projectedOpeningBalance: "Projected Opening Balance",
      projectedCashInflow: "Projected Cash Inflow",
      projectedCashOutflow: "Projected Cash Outflow",
      projectedNetCashFlow: "Projected Net Cash Flow",
      projectedClosingBalance: "Projected Closing Balance",
    };

    return titleMap[key] || key; // Fallback to the key if no mapping is found
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 2000);

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(moment().tz(selectedTimezone));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTimezone]);

  // useEffect(() => {
  //   fetchProjectedData();
  //   fetchTxnData();
  // }, []);

  if (loading) return <DashBoardSkeleton />;

  return (
    <Layout style={{ padding: "10px", maxWidth: "100%", margin: "0 auto" }}>
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "2%" }}
      >
        <Typography.Title level={5}>
          <strong>AI Insights:</strong> Today's Projected Cash Net Flow: 
          <Typography.Text type="success" style={{ marginLeft: "8px" }}>

            +$15,000 <ArrowUpOutlined style={{ color: "green" }} />
          </Typography.Text>
        </Typography.Title>
      </Row>

      {/* Cards */}
      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "2%" }}>
        <CardsContainer cardData={projectedData} />
      </Row>

      {/* Charts Row 1 */}
      <Row
        gutter={[16, 16]}
        justify="space-evenly"
        style={{ marginBottom: "2%" }}
      >
        <Col span={8}>
          <Card title="Net Balance" style={{ height: "100%" }}>
            <AreaChartContainer data={apiHourlyData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Transactions" style={{ height: "100%" }}>
            <CashFlowTable data={txnData} type="payments" />,
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Cash Outflows" style={{ height: "100%" }}>
            <SunburstChart  data={chartData}/>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Montly CashFlow" style={{ height: "100%" }}>
            <BarWithLineChartContainer  />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Cash Available for Operations" style={{ height: "100%" }}>
            <DonutChart data={apiMonthlyData[0]} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Liquidity Ratio & Risk Alerts" style={{ height: "100%" }}>
            <GuageChart data={apiMonthlyData[0]} />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default App;
