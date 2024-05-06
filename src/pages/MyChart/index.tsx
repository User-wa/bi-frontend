import {history, useModel} from '@@/exports';
import {Avatar, Card, List, message, Result} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, {useEffect, useState, useReducer} from 'react';
// import Search from "antd/es/input/Search";
import {deleteChartUsingPOST, listMyChartByPageUsingPOST} from '@/services/yubi/chartController';import {QuestionCircleOutlined} from '@ant-design/icons';
import {Button, Popconfirm} from 'antd';
import {addRecordUsingPost, listRecordByPageUsingGet} from "@/services/bi/recordController";
import { Select,Input } from 'antd';
const { Search } = Input;
const { Option } = Select;
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

  // 在组件中定义轮询间隔时间
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  // const [flag, setFlag] = useState<boolean>(false);
  const [content, setContent] = useState('');
  const [recordList, setRecordList] = useState([]);
  const [content2,setContent2] = useState('');

  const loadData = async (flag: boolean) => {
    if (flag) {
      setLoading(true);
    }
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      // await addRecordUsingPost()
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach(data => {
            //     if (data.status === 'failed' || data.status === 'resSend') {
            //       reSendChatGptUsingPost(data.id ?? -1);
            //       return;
            //     }
            //     try {
            //       data.getChart && JSON.parse(data.getChart)
            //     } catch (e: any) {
            //       if (data.number !== 3) {
            //         data.getChart = '{}';
            //         reSendChatGptUsingPost(data.id ?? -1);
            //         return;
            //       }
            //       data.getChart = '{}';
            //     }
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
      message.error('获取我的图表失败，');
    }
    if (flag) {
      setLoading(false);
    }
  };


  // useEffect(() => {
  //
  // }, [searchParams]);

  // function reducer(state: any) {
  //   switch (action.type) {
  //     case 'FETCH_DATA':
  //       // 在reducer中调用loadData函数
  //       loadData();
  //       return state;
  //     default:
  //       return state;
  //   }
  // };

  const listRecord = async () => {
    const response = await listRecordByPageUsingGet();
    setRecordList(response.data);
  }

  // function reducer(state: { count: number })
  // state: { count: number }
  // 表示一个对象，其中包含一个名为 count 的属性，其类型为 number
  //轮询：参考https://segmentfault.com/a/1190000041831958#item-1

  // 定义一个reducer函数，接受一个状态对象作为参数
  function reducer(state: any) {
    // setFlag(false); // 这里注释掉了设置flag为false的逻辑
    loadData(false); // 调用loadData函数并传入false作为参数
    return state; // 返回状态对象
  }

// 使用useReducer Hook，传入reducer函数和初始状态对象{}，返回状态和dispatch函数
  const [state, dispatch] = useReducer(reducer, {});

  const handleSearch = (value) => {
    setSearchParams({
      ...initSearchParams,
      name: value,
    });
    // setContent2(value);
    const recordRequest = {
      content: value,
    };
    addRecordUsingPost(recordRequest);
    listRecordByPageUsingGet().then((response) => {
      setRecordList(response.data);
    }).catch((error) => {
      console.error('Error fetching record list:', error);
    });


    // loadData(true);
  };

  const handleSearchChange = (value) => {
    setContent(value);
  };

  const handleBlur = () => {
    // 在失去焦点时调用接口进行搜索
    setSearchParams({
      ...initSearchParams,
      name: content,
    });
    // setContent2(value);
    const recordRequest = {
      content: content,
    };
    addRecordUsingPost(recordRequest);
    listRecordByPageUsingGet().then((response) => {
      setRecordList(response.data);
    }).catch((error) => {
      console.error('Error fetching record list:',error);
    });
  };

// useEffect Hook，当searchParams发生变化时执行
  useEffect(() => {
    listRecord();
    // 调用loadData函数并传入true作为参数
    loadData(true);
  }, [searchParams]);

// useEffect Hook，组件挂载时执行
  useEffect(() => {
    // 每隔5秒调用一次dispatch函数
    setInterval(() => {
      dispatch();
    }, 5000);
  }, []);

  return (
    <div className="my-chart-page">
      <div>
        <Select
          showSearch
          style={{ width:200 }}
          placeholder="请输入图表名称"
          loading={loading}

          onChange={handleSearch} // 共用的事件处理函数
          onSearch={handleSearchChange}
          onBlur={handleBlur}
          // value={content}

        >
          {recordList.map((option) => (
            <Select.Option key={option.value} value={option.value}>{option.content}</Select.Option>
          ))}

        </Select>
      </div>
      <div className="margin-16"/>
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
            <Card style={{width: '100%'}}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar}/>}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <>
                {
                  item.getChart === '{}' && item.status !== 'noSuccess' && item.status !== 'lengthMax' && <>
                    <Result
                      status="info"
                      title="AI 生成图表错误,修改中请稍后查看"
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === 'wait' && <>
                    <Result
                      status="info"
                      title="待生成"
                      subTitle={item.execMessage ?? '正在准备生成图表，请耐心等候'}
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
                  item.status === 'succeed' && item.getChart !== '{}' && <>
                    <div style={{marginBottom: 16}}/>
                    <p>{'分析目标：' + item.target}</p>
                    <p>{'分析结论：' + item.getResult}</p>
                    <ReactECharts option={item.getChart && JSON.parse(item.getChart)}/>
                    <div style={{marginBottom: 16}}/>
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
                {/*{*/}
                {/*  item.status === 'noSuccess' && item.status === 'noSuccess' && <>*/}
                {/*    <Result*/}
                {/*      status="error"*/}
                {/*      title="重试次数达上限,请重新尝试或删除"*/}
                {/*      subTitle={'重试次数达上限,请重新尝试或删除' + item.number}*/}
                {/*    />*/}
                {/*  </>*/}
                {/*}*/}
                {
                  item.status === 'lengthMax'&& <>
                    <Result
                      status="error"
                      title="数据过多请缩减后重试"
                    />
                  </>
                }
                {
                  item.status === 'resSend'&& <>
                    <Result
                      status="error"
                      title="访问ChatGPT时出现了一些问题正在重试中"
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
                  const handleDeleteAndLoadData = async () => {
                    await deleteChartUsingPOST(deleteRequest);
                    message.success('删除成功!');
                    loadData(true);
                  };
                  handleDeleteAndLoadData();
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
