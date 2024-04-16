// admin.tsx

import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';

const Admin = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
    // Add more user data as needed
  ]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  const handleEdit = (user) => {
    // Handle edit user logic
    Modal.info({
      title: 'Edit User',
      content: (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          {/* Add more user details here */}
        </div>
      ),
    });
  };

  return (
    <div>
      <h1>User Management</h1>
      <Table dataSource={users} columns={columns} />
    </div>
  );
};

export default Admin;
