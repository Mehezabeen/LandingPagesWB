import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import SideBar from "../../SideBar/SideBar";
import './ViewSupplier.css';

const ViewSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/supplier')
      .then(response => response.json())
      .then(data => setSuppliers(data))
      .catch(error => console.error('Error fetching suppliers:', error));
  }, []);

  const columns = [
    {
      title: 'Supplier ID',
      dataIndex: 'supplierId',
      key: 'supplierId',
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: 'Supplier Email',
      dataIndex: 'supplierEmail',
      key: 'supplierEmail',
    },
    {
      title: 'Supplier Contact No',
      dataIndex: 'supplierContactNo',
      key: 'supplierContactNo',
    },
    {
      title: 'Supplier Address Line 1',
      dataIndex: 'supplierAddressLine1',
      key: 'supplierAddressLine1',
    },
    {
      title: 'Supplier Address Line 2',
      dataIndex: 'supplierAddressLine2',
      key: 'supplierAddressLine2',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'ZIP',
      dataIndex: 'zip',
      key: 'zip',
    },
  ];

  return (
    <SideBar>
      <div className='view-supplier-page'>
        <h2 className="text-center">View Supplier</h2>
        <div>
          <Table dataSource={suppliers} columns={columns} rowKey="supplierId" />
        </div>
      </div>
    </SideBar>
  );
};

export default ViewSupplier;
