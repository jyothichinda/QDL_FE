const ISOStandardFields = [
    {
      _id: "674465ce52634fb3a3025ce3",
      field: "ns0:MsgId",
      label: "Message ID",
    },
    {
      _id: "674465cf52634fb3a3025ce4",
      field: "ns0:IntrBkSttlmAmt/_",
      label: "Txn Amount",
    },
    {
      _id: "674465d052634fb3a3025ce6",
      field: "ns0:InitgPty/Nm",
      label: "Initiating Party Name",
    },
    {
      _id: "674465d152634fb3a3025ce8",
      field: "ns0:InitgPty/ns0:Ctry",
      label: "Initiating Party Country",
    },
    {
      _id: "674465d152634fb3a3025ce9",
      field: "ns0:InitgPty/ns0:TaxId",
      label: "Initiating Party TaxId",
    },
    {
      _id: "674465d252634fb3a3025cea",
      field: "ns0:PmtMtd",
      label: "Payment Method",
    },
    {
      field: "ns0:PmtMtd",
      label: "Payment Method",
      _id: "674465d252634fb3a3025cea",
    },
    {
      _id: "674465d252634fb3a3025ced",
      field: "ns0:ReqdExctnDt",
      label: "Requested Execution Date",
    },
    {
      _id: "674465d352634fb3a3025cee",
      field: "ns0:SttlmMtd",
      label: "Settlement Method",
    },
    {
      _id: "674465d352634fb3a3025cef",
      field: "ns0:Dbtr/ns0:Nm",
      label: "Debtor Name",
    },
    {
      _id: "674465d352634fb3a3025cf0",
      field: "ns0:Dbtr/ns0:PstlAdr/ns0:Ctry",
      label: "Debtor Country",
    },
    {
      _id: "674465d352634fb3a3025cf1",
      field: "ns0:DbtrAgt/ns0:FinInstnId/ns0:BICFI",
      label: "Debtor BIC",
    },
    {
      _id: "674465d352634fb3a3025cf2",
      field: "ns0:Dbtr/ns0:TaxId",
      label: "Debtor Tax Id",
    },
    {
      _id: "674465d452634fb3a3025cf4",
      field: "ns0:DbtrAgt",
      label: "Debtor Branch and FI Id",
    },
    {
      _id: "674465d452634fb3a3025cf6",
      field: "ns0:CdtTrfTxInf/ns0:PmtId/ns0:TxId",
      label: "Transaction ID",
    },
    {
      _id: "674465d552634fb3a3025cf8",
      field: "ns0:Cdtr/ns0:Nm",
      label: "Creditor Name",
    },
    {
      _id: "674465d552634fb3a3025cf9",
      field: "ns0:Cdtr/ns0:PstlAdr/ns0:Ctry",
      label: "Creditor Country",
    },
    {
      _id: "674465d652634fb3a3025cfa",
      field: "ns0:CdtrAgt/ns0:FinInstnId/ns0:BICFI",
      label: "Creditor BIC",
    },
    {
      _id: "674465d652634fb3a3025cfc",
      field: "ns0:Cdtr/ns0:TaxId",
      label: "Creditor Tax Id",
    },
    {
      _id: "674465d652634fb3a3025cfe",
      field: "ns0:CdtrAgt",
      label: "Creditor Branch and FI Id",
    },
    {
      _id: "674465d752634fb3a3025cff",
      field: "ns0:ChrgBr",
      label: "Charge Bearer",
    },
    {
      _id: "674465d752634fb3a3025d00",
      field: "ns0:RmtInf",
      label: "Remittance Information",
    },
    {
      _id: "674465d752634fb3a3025d01",
      field: "ns0:InstgAgt",
      label: "Instructing Agent",
    },
    {
      _id: "674465d752634fb3a3025d02",
      field: "ns0:InstdAgt",
      label: "Instructed Agent",
    },
  ]
  

  const companies = [
      {
        _id: "673c821edccfa01a7cb8e71d",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "Netflix Inc.",
      },
      {
        _id: "673c81eadccfa01a7cb8e71b",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "Meta Platforms Inc.",
      },
      {
        _id: "674ee89aa93c4256b87b1cc3",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "Microsoft Corporation",
      },
      {
        _id: "674ee982a93c4256b87b1cc7",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "FedEx Corp",
      },
      {
        _id: "674ee9dfa93c4256b87b1cc9",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "Walmart",
      },
      {
        _id: "674eea23a93c4256b87b1ccb",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "Johnson & Johnson",
      },
      {
        _id: "674eeac7a93c4256b87b1ccd",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "IBM",
      },
      {
        _id: "674eeb44a93c4256b87b1ccf",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "Qualcomm",
      },
      {
        _id: "67500c2c5640772bbc6df5a7",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "The Boeing Company",
      },
      {
        _id: "67500bac5640772bbc6df5a5",
        company: "673c624d7b08b529fceb6e2a",
        customerName: "Google LLC",
      },
    ]
  
export default {  ISOStandardFields, companies };