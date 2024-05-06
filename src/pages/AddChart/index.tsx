import { genChartByAiUsingPOST } from '@/services/yubi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {reduceScoreUsingPost} from "@/services/bi/scoreController";
import {getLoginUserUsingGet} from "@/services/bi/userController";
// import {userScoreUsingPost} from "@/services/bi/scoreController";

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.yubiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const res2 = await getLoginUserUsingGet();
        const deleteRequest = {
          id: res2.data.id ?? -1
        };
        reduceScoreUsingPost(deleteRequest);
        const chartOption = JSON.parse(res.data.getChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误')
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };
  // const MyNamespace = {
  //   Zo: undefined
  // };

// 在命名空间下声明变量或函数
//   MyNamespace.Zo = function() {const script = document.createElement('script');
//     script.src = 'https://bi-1317055661.cos.ap-nanjing.myqcloud.com/index-DCcypd_U.js';
//     script.defer = true;
//     document.head.appendChild(script); };
//   useEffect(() => {
//     // 当组件加载完成后，创建和加载脚本
//
//
//     // 延迟加载脚本（如果需要的话），或者直接调用 loadScript
//     // loadScript(); // 如果你不需要延迟，可以直接调用
//
//     // 延迟加载脚本的示例setTimeout(loadScript, 500); // 假设延迟500毫秒加载脚本
//
//   }, []);

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form name="addChart" labelAlign="left" labelCol={{ span: 5 }}
                  wrapperCol={{ span: 16 }} onFinish={onFinish} initialValues={{}}>
              <Form.Item
                name="target"
                label="分析目标"
                rules={[{ required: true, message: '请输入分析目标' }]}
              >
                <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况" />
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <Input placeholder="请输入图表名称" />
              </Form.Item>
              <Form.Item name="chartType" label="图表类型">
                <Select
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '堆叠图', label: '堆叠图' },
                    { value: '饼图', label: '饼图' },
                    { value: '雷达图', label: '雷达图' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="file" label="原始数据">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button danger type="text">
                    (消耗一积分)
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.getResult ?? <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting}/>
          </Card>
          <Divider />
          <Card title="可视化图表">
            {
              option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>
            }
            <Spin spinning={submitting}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
