import {
  ClockCircleOutlined,
  EyeOutlined,
  FrownOutlined,
  LikeOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons';
import {List, message, notification, Space} from 'antd';
import React from 'react';
import {useLocation} from "@@/exports";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

type CsdnListProps = {
  loading: boolean;
  dataList: Search.CnBlog[];
  total: number;
  changePage: (pageNum: number)=>void;
}

const CnBlogList: React.FC<CsdnListProps> = ({loading, dataList, changePage, total}) => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);

    console.log(dataList)

  return (
    <List
      loading={dataList.length !== 0 && loading}
      itemLayout="vertical"
      size="large"
      pagination={dataList.length === 0 ? undefined : {
        onChange: (page) => {
          changePage(page);
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        },
        current: Number(urlSearchParams.get('pageNum')) || 1,
        showSizeChanger: false,
        showQuickJumper: true,
        pageSize: 10,
        total: total,
      }}
      dataSource={dataList}
      renderItem={(item) => (
        <List.Item
          style={{padding: '16px 0'}}
          key={item.title}
          actions={[
            <IconText icon={EyeOutlined} text={item.viewCount} key="list-viewCount" />,
            <IconText icon={LikeOutlined} text={item.likeCount} key="list-likeCount" />,
            <IconText icon={MessageOutlined} text={item.commentCount} key="list-commentCount" />,
          ]}
        >
          <List.Item.Meta
            style={{marginBlockEnd: 0}}
            title={<a rel="noopener noreferrer" target="_blank" href={item.articleUrl} dangerouslySetInnerHTML={{ __html: item.title }}></a>}
          />

          <div className='description'>
            <div dangerouslySetInnerHTML={{ __html: item.summary }}></div>
          </div>

          <div className='extra' style={{marginTop: 16,float: 'right'}}>
            <Space key="list-extra" size='large'>
              <Space>
                <UserOutlined/>
                <a href={item.authorUrl} rel="noopener noreferrer" target="_blank" dangerouslySetInnerHTML={{ __html: item.author }}></a>
              </Space>
              <Space>
                <ClockCircleOutlined/>
                {item.createdTime}
              </Space>
            </Space>
          </div>
        </List.Item>
      )}
    />
  )
}

export default CnBlogList;
