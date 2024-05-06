import {
  listNotificationByPageUsingPost,
  deleteNotificationUsingPost,
} from '@/services/bi/notificationController';

import CreateModal from '@/pages/Admin/Notification/components/CreateModal';
import UpdateModal from '@/pages/Admin/Notification/components/UpdateModal';

import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { message, Space, Typography, Button, Select } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

const NotificationAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.Notification>();

  const handleDelete = async (row: API.Notification) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteNotificationUsingPost({
        id: row.id as any,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const columns: ProColumns<API.Notification>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '标题',
      dataIndex: 'title',
      copyable: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      copyable: true,
      width: 250,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      search: false,
      sorter: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      search: false,
      sorter: true,
    },


    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '关闭',
        },
        1: {
          text: '开启',
        },

      },

      renderFormItem: (_, record) => {
        console.log(record, _, 'record');

        return (
          <Select
            defaultValue={record.value}
            options={[
              {
                label: '关闭',
                value: 0,
              },
              {
                label: '开启',
                value: 1,
              },
            ]}
          />
        );
      },
    },

    {
      title: '选择域名',
      dataIndex: 'domain',
      render: (_, record) => (
        <Space split="|">
          {record.domain?.map((domain: string) => (
            <span>{domain}</span>
          ))}
        </Space>
      ),

      renderFormItem: (_, { defaultRender, ...rest }) => {
        return <Select mode="tags" />;
      },
      copyable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.Notification>
        headerTitle={'分页展示表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listNotificationByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.UserQueryRequest);

          const newData = data?.records?.map((ele) => {
            return {
              ...ele,
              domain: JSON.parse(Boolean(ele.domain) ? ele.domain ?? '[]' : '[]'),
            };
          });
          console.log(newData, 'newData');
          return {
            success: code === 0,
            data: newData ?? [],
            // data: data?.records ?? [],
            total: Number(data?.total) || 0,
          };
        }}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
    </PageContainer>
  );
};
export default NotificationAdminPage;
