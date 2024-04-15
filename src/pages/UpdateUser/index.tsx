import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getLoginUserUsingGET, updateMyUserUsingPOST } from '@/services/yubi/userController';
import { uploadFileUsingPOST } from '@/services/yubi/fileController';
import { useModel } from '@@/exports';

// 处理头像上传
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const UpdateUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { setInitialState } = useModel('@@initialState');
  const [user, setUser] = useState<API.LoginUserVO | null>();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getLoginUserUsingGET();
      if (response.data) {
        setUser(response.data);
        form.setFieldsValue(response.data);
      }
    };
    fetchUser();
  }, []);

  const handleFormFinish = async (values: API.UserUpdateMyRequest) => {
    try {
      setLoading(true);
      const response = await updateMyUserUsingPOST(values);
      if (response.data) {
        setInitialState((s) => ({
          ...s,
          currentUser: {
            ...s?.currentUser ?? {},
            ...values,
          },
        }));
        message.success('User information updated successfully');
      } else {
        message.error('Failed to update user information');
      }
    } catch (error) {
      message.error('Failed to update user information');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = (info) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // 这里的 info.file.response 应该返回上传后的文件信息，包括 URL
      // 假设服务器返回了文件 URL，这里需要替换成服务器实际返回的字段
      setLoading(false);
    }
  };

  const hanleUploadCustomRequest = (options) => {
    const { onSuccess, onError, file } = options;
    console.log(file);
    uploadFileUsingPOST(
      {
        // @ts-ignore
        biz: 'user_avatar',
      },
      {},
      file,
    ).then((response) => {
      setLoading(false);

      if (response.code === 0) {
        onSuccess('Ok');
        console.log(response);
        setUser({
          ...user,
          userAvatar: response.data,
        });
        form.setFieldValue('userAvatar', response.data);
      } else {
        onError('error');
        message.error(response.message);
      }
    });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Card title="Update User Information">
      <Form form={form} layout="vertical" onFinish={handleFormFinish}>
        <Form.Item name="userAvatar" label="Avatar">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            // handle change to update avatar
            onChange={handleUploadChange}
            withCredentials={true}
            customRequest={hanleUploadCustomRequest}
          >
            {user && user.userAvatar ? (
              <img src={user.userAvatar} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="userName" label="Nickname">
          <Input />
        </Form.Item>
        <Form.Item name="userProfile" label="Profile">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UpdateUser;
