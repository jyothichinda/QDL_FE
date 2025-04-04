//Designed and Developed by Gowtham
import React from "react";
import { Card, Col, Row, Statistic, Typography, Table } from "antd";
import { WarningOutlined, AlertOutlined } from "@ant-design/icons";

const { Title } = Typography;

// Sample data for the table (replace with your actual data source)
const sampleSuspiciousData = [
    {
        key: '1',
        messageId: 'MSG001',
        creditorName: 'ABC Corp',
        debtorName: 'John Doe',
        transactionAmount: 1500.00,
        network: 'Visa',
        fraudStatus: 'Suspicious'
    },
    {
        key: '2',
        messageId: 'MSG002',
        creditorName: 'XYZ Inc',
        debtorName: 'Jane Smith',
        transactionAmount: 2300.50,
        network: 'Mastercard',
        fraudStatus: 'Suspicious'
    },
    {
        key: '3',
        messageId: 'MSG122',
        creditorName: 'Jasmine Inc',
        debtorName: 'Michael',
        transactionAmount: 2300.50,
        network: 'VISA',
        fraudStatus: 'Suspicious'
    }
];

const Dashboard = ({ 
    fraudCount = 27, 
    suspiciousCount = 150, 
    suspiciousFiles = sampleSuspiciousData, 
    loading = false 
}) => {
    // Table columns definition
    const columns = [
        {
            title: 'Message ID',
            dataIndex: 'messageId',
            key: 'messageId',
        },
        {
            title: 'Creditor Name',
            dataIndex: 'creditorName',
            key: 'creditorName',
        },
        {
            title: 'Debtor Name',
            dataIndex: 'debtorName',
            key: 'debtorName',
        },
        {
            title: 'Transaction Amount',
            dataIndex: 'transactionAmount',
            key: 'transactionAmount',
            render: (amount) => `$${amount.toFixed(2)}`,
            sorter: (a, b) => a.transactionAmount - b.transactionAmount,
        },
        {
            title: 'Network',
            dataIndex: 'network',
            key: 'network',
        },
        {
            title: 'Fraud Status',
            dataIndex: 'fraudStatus',
            key: 'fraudStatus',
            render: (status) => (
                <span style={{ 
                    color: status === 'Suspicious' ? '#faad14' : '#52c41a',
                    fontWeight: 'bold' 
                }}>
                    {status}
                </span>
            ),
        },
    ];

    return (
        <div className="dashboard" style={{ padding: 24 }}>
            <Title level={2}>Dashboard</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card hoverable loading={loading} style={{ borderColor: '#cf1322' }}>
                        <Statistic
                            title="Fraud Files"
                            value={fraudCount}
                            prefix={<AlertOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                            suffix={<span style={{ fontSize: 14, color: '#888' }}>cases</span>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card hoverable loading={loading} style={{ borderColor: '#faad14' }}>
                        <Statistic
                            title="Suspicious Files"
                            value={suspiciousCount}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#faad14' }}
                            suffix={<span style={{ fontSize: 14, color: '#888' }}>cases</span>}
                        />
                    </Card>
                </Col>
            </Row>
            
            {/* Suspicious Files Table */}
            <Card 
                title="Suspicious Files Details" 
                style={{ marginTop: 24 }}
                loading={loading}
            >
                <Table 
                    columns={columns}
                    dataSource={suspiciousFiles}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20'],
                    }}
                    scroll={{ x: 800 }} // Makes table horizontally scrollable on small screens
                />
            </Card>
        </div>
    );
};

export default Dashboard;

// Usage example:
// <Dashboard 
//     fraudCount={15} 
//     suspiciousCount={27} 
//     suspiciousFiles={yourDataArray}
// />