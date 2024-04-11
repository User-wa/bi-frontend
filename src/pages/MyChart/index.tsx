import {deleteChartUsingPOST, listMyChartByPageUsingPOST} from '@/services/yubi/chartController';

import { useModel } from '@@/exports';
import {Avatar, Card, List, message, Result} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import Search from "antd/es/input/Search";


import {QuestionCircleOutlined} from '@ant-design/icons';
import {Button, Popconfirm} from 'antd';

/**
 * 我的图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach(data => {
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.getChart ?? '{}');
              chartOption.title = undefined;
              data.getChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败，' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search placeholder="请输入图表名称" enterButton loading={loading} onSearch={(value) => {
          // 设置搜索条件
          setSearchParams({
            ...initSearchParams,
            name: value,
          })
        }}/>
      </div>
      <div className="margin-16" />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <>
                {
                  item.status === 'wait' && <>
                    <Result
                      status="warning"
                      title="待生成"
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                    />
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status="info"
                      title="图表生成中"
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === 'succeed' && <>
                    <div style={{ marginBottom: 16 }} />
                    <p>{'分析目标：' + item.target}</p>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={item.getChart && JSON.parse(item.getChart)} />
                    <p>{'结论：' + item.getResult}</p>
                  </>
                }
                {
                  item.status === 'failed' && <>
                    <Result
                      status="error"
                      title="图表生成失败"
                      subTitle={item.execMessage}
                    />
                  </>
                }
              </>
              <Popconfirm
                title="删除图表"
                description="确定要删除吗?"
                onConfirm={() => {
                  const deleteRequest = {
                    id: item.id ?? -1
                  };
                  deleteChartUsingPOST(deleteRequest);
                  loadData();
                  message.success('删除成功!')
                  loadData();
                }}
                icon={<QuestionCircleOutlined style={{color: 'pink'}}/>}
              >
                <Button danger>删除</Button>
              </Popconfirm>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
