import {Button, Card, Form, message, Space ,notification} from 'antd';
import ReactECharts from "echarts-for-react";
// import {loginSingInUsingPost} from "@/services/bi/scoreController";
import React, {useEffect, useState} from 'react';
import {getLoginUserUsingGet} from "@/services/bi/userController";
import {addScoreUsingPost, findScoreUsingPost} from "@/services/bi/scoreController";
import {getNotificationVoUsingGet} from "@/services/bi/notificationController";
// import { useModel } from 'umi';
// import { Helmet } from 'umi';
// import headScripts from "umi-plugin-react/src/plugins/headScripts";

/**
 * 首页
 * @constructor
 */

const AddScore: React.FC = () => {

  const [userData, setUserData] = useState<API.BaseResponseLoginUserVO_>();
  const [api, contextHolder] = notification.useNotification();
  const [userScore, setUserScore] = useState(0);
  const [flag, setFlag] = useState(0);
  // const [forceUpdate, setForceUpdate] = useState(false);
  // const [dataLoaded, setDataLoaded] = useState(false);




  const getScore = async () => {
    const deleteRequest = {
      id: userData?.data?.id ?? -1
    };

    const res = await findScoreUsingPost(deleteRequest);
    setUserScore(res.data ?? 0);
    // setDataLoaded(true);
    // setForceUpdate(prev => !prev); // 触发重新渲染
  };

  /**
   * 签到
   */
  const fetchUserInfo = async () => {
    const deleteRequest = {
      id: userData?.data?.id ?? -1
    };
    const res = await addScoreUsingPost(deleteRequest);
    if (res.code) {
      message.error(res.message);
      return;
    }
    message.success('签到成功');
    getScore();
    fetchData();
  };

  const close = () => {
    console.log(
      'Notification was closed. Either the close button was clicked or duration time elapsed.',
    );
  };
  const fetchNotification = async (domain : string)=> {
    // 发起请求获取通知信息的逻辑
    const res = await getNotificationVoUsingGet({ domain });
    const data = res.data;
    const id = data.id;
    const updateTime = data.updateTime;
        if (
          !localStorage.getItem(id + updateTime) &&
          data.title &&
          data.content
        ) {
        //   // 使用 SweetAlert2 显示弹窗
          const key = `hallo`;
          const btn = (
            <Space>
              {/* 这里移除了 Destroy All 按钮的 onClick 处理函数 */}
              <Button type="primary" size="small" onClick={() => api.destroy(key)}>
                Confirm
              </Button>
            </Space>
          );
          api.open({
            duration: null,
            message: data.title,
            description: data.content,
            btn,
            key,
            onClose: close,
          });
        //
          // 存储到 localStorage
          localStorage.setItem(id + updateTime, "id");
        }
  }
  const fetchData = async () => {
    try {
      const [userRes] = await Promise.all([
        getLoginUserUsingGet()
      ]);
      if (userRes.data) {
        setUserData(userRes);
        setFlag(1);
      } else {
        message.error(userRes.message);
      }
    } catch (e) {
      message.error('获取信息失败');
    }

  };




  useEffect(() => {
      fetchData();
  }, []); // 监听userData的变化

  useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://bi-1317055661.cos.ap-nanjing.myqcloud.com/index-C9L-oNdE.js';
      script.defer = true;
      document.head.appendChild(script);
    // 在这里根据条件来决定何时加载目标脚本
    // 可以在组件挂载完成后加载脚本，或者在特定事件触发时加载
  },[]);

  // useEffect(() => {
  //   const url = new URL(location.href);
  //   const domain = url.hostname;
  //   fetchNotification(domain);
  // }, []); // 监听userData的变化

  useEffect(() => {
    if (flag === 1) {
      getScore();
    }
  }, [flag]);

  // useEffect(() => {
  //   // 在这里根据条件来决定何时加载目标脚本
  //   loadScript();
  //   // 可以在组件挂载完成后加载脚本，或者在特定事件触发时加载
  // }, []);

  return (
    <div>

      <Card
        title="智能 BI,欢迎签到"
        extra={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>
              用户: {userData?.data?.userName}
            </span>
            <span style={{ marginLeft: '16px', color: '#1890ff', fontWeight: 'bold' }}>
              可用积分：{userScore}
            </span>
          </div>
        }
      >
        <Form name="addChart" labelAlign="left" labelCol={{span: 4}}
              wrapperCol={{span: 16}} initialValues={{}}>
          <Form.Item name="file" label={'样例'}>
            <div style={{marginBottom: 16}}/>
            <p>{'分析目标：网站用户增长趋势'}</p>
            <p>{'分析结论：根据折线图数据分析结论：从1号到60号，网站用户数呈现逐渐增长的趋势，但在35号和47号出现了异常数据，用户数分别为3和5，可能是数据采集或记录错误导致的异常值。整体来看，网站用户数呈现出稳步增长的态势，需要进一步关注和分析异常值的原因，以确保数据的准确性和可靠性'}</p>
            {contextHolder}
            <ReactECharts option={
              {
                "title": {
                  "text": "网站用户增长情况"
                },
                "legend": {
                  "textStyle": {
                    "color": "#000"
                  },
                  "data": ["用户数"]
                },
                "xAxis": {
                  "type": "category",
                  "data": ["1号", "2号", "3号", "4号", "5号", "6号", "7号", "8号", "9号", "10号", "11号", "12号", "13号", "14号", "15号", "16号", "17号", "18号", "19号", "20号", "21号", "22号", "23号", "24号", "25号", "26号", "27号", "28号", "29号", "30号", "31号", "32号", "33号", "34号", "35号", "36号", "37号", "38号", "39号", "40号", "41号", "42号", "43号", "44号", "45号", "46号", "47号", "48号", "49号", "50号", "51号", "52号", "53号", "54号", "55号", "56号", "57号", "58号", "59号", "60号"],
                  "axisLine": {
                    "lineStyle": {
                      "color": "#000"
                    }
                  },
                  "axisLabel": {
                    "color": "#000"
                  }
                },
                "yAxis": {
                  "type": "value",
                  "axisLine": {
                    "lineStyle": {
                      "color": "#000"
                    }
                  },
                  "axisLabel": {
                    "color": "#000"
                  }
                },
                "series": [
                  {
                    "name": "用户数",
                    "type": "line",
                    "data": [10, 20, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 3, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 5, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87],
                    "lineStyle": {
                      "color": "#000"
                    }
                  }
                ]
              }
            }/>
            <div style={{marginBottom: 16}}/>
          </Form.Item>

          <Form.Item wrapperCol={{span: 16, offset: 4}}>
            <Space>
              <Button type="primary" htmlType="submit" onClick={fetchUserInfo}>
                签到
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddScore;
