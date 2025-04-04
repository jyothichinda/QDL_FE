//Designed and Developed by Gowtham
import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import '../css/Anamoly.css';

const Anamoly = () => {
  const columns = [
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
      width: '30%'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '70%'
    }
  ];

  const initialTransaction = {
    "msg_id": "MSGIDDK00034",
    "creation_date_time": "2025-03-27 10:35:00",
    "amount": 1125887.34,
    "debtor_name": "NovaMatrix Technologies",
    "debtor_address": "MECKENEMSTRASSE 10 46395 BOCHOLT GERMANY",
    "debtor_account_id": "DE84295337706984956921",
    "creditor_name": "QuantumTech Systems",
    "creditor_address": "C/ JOSE MARIA OLABARRI 1 48001 BILBAO SPAIN",
    "creditor_account_id": "ES3090357547846647899565",
    "debtor_network_type": "ACH",
    "creditor_network_type": "ACH",
    "debtor_bank_name": "Wells FargoCo",
    "creditor_bank_name": "Bank of Bavaria",
    "transaction_date": "2025-03-26 05:17:00",
    "fraud_status": "Suspicious"
  };

  const [currentTransaction, setCurrentTransaction] = useState(initialTransaction);
  const [nextTransaction, setNextTransaction] = useState(null);
  const [animationState, setAnimationState] = useState('initial'); // 'initial', 'sliding-out', 'sliding-in'

  const getNextTransaction = () => {
    return {
      ...currentTransaction,
      msg_id: `MSGIDDK${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      fraud_status: "Suspicious",
    };
  };

  const handleButtonClick = (status) => {
    console.log(`Marked as ${status}`);
    setNextTransaction(getNextTransaction());
    setAnimationState('sliding-out');
  };

  useEffect(() => {
    if (animationState === 'sliding-out') {
      const timer = setTimeout(() => {
        setCurrentTransaction(nextTransaction);
        setAnimationState('sliding-in');
      }, 500);
      return () => clearTimeout(timer);
    } else if (animationState === 'sliding-in') {
      const timer = setTimeout(() => {
        setAnimationState('initial');
        setNextTransaction(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animationState, nextTransaction]);

  const currentDataSource = Object.entries(currentTransaction).map(([key, value], index) => ({
    key: index,
    field: key.replace(/_/g, ' ').toUpperCase(),
    value: value.toString()
  }));

  const nextDataSource = nextTransaction 
    ? Object.entries(nextTransaction).map(([key, value], index) => ({
        key: index,
        field: key.replace(/_/g, ' ').toUpperCase(),
        value: value.toString()
      }))
    : [];

  return (
    <div className="dashboard">
      <h1>Suspicious Files</h1>
      <p>Analyse if the file is Suspicious or not</p>
      <div className="table-wrapper">
        <div 
          className={`table-container ${
            animationState === 'sliding-out' ? 'slide-out-right' : 
            animationState === 'sliding-in' ? 'slide-in-from-left' : ''
          }`}
        >
          <Table 
            columns={columns} 
            dataSource={animationState === 'sliding-in' ? nextDataSource : currentDataSource}
            pagination={false}
            bordered
            size="middle"
            style={{ marginTop: 20 }}
          />
          {animationState !== 'sliding-in' && (
            <div className="button-container" style={{ marginTop: 20, textAlign: 'center' }}>
              <Button 
                type="primary" 
                danger 
                onClick={() => handleButtonClick('Fraud')}
                style={{ marginRight: 10 }}
              >
                Fraud
              </Button>
              <Button 
                type="primary" 
                onClick={() => handleButtonClick('Legit')}
              >
                Legit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anamoly;