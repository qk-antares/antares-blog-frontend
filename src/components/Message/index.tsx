import {Badge, Dropdown, MenuProps, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {BellOutlined, InfoCircleOutlined, LikeOutlined, MailOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {getNoticeCount} from "@/services/message/api";
import {history, useModel} from "@@/exports";


const Message: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [count, setCount] = useState<Message.NotificationCount>()
  const [total, setTotal] = useState(0);

  //获取消息信息
  useEffect(()=>{
    getNoticeCount().then(res => {
      if(res.code === 200){
        setCount(res.data);
        setTotal(res.data.likeCount + res.data.commentCount + res.data.msgCount + res.data.noticeCount);
      }
    })
  }, [])

  const goNotification = (type: string) => {
    if(currentUser){
      history.push(`/notification?type=${type}`);
    } else {
      message.info('请先登录');
    }
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <>
          <a onClick={()=>goNotification('like')}>收到的赞</a>
          <Badge style={{padding: '0 4px'}} count={count?.likeCount} offset={[5,-4]}></Badge>
        </>
      ),
      icon: <LikeOutlined />
    },
    {
      key: '2',
      label: (
        <>
          <a onClick={()=>goNotification('comment')}>回复我的</a>
          <Badge style={{padding: '0 4px'}} count={count?.commentCount} offset={[5,-4]}></Badge>
        </>
      ),
      icon: <UnorderedListOutlined />
    },
    {
      key: '3',
      label: (
        <>
          <a onClick={()=>goNotification('chat')}>我的消息</a>
          <Badge style={{padding: '0 4px'}} count={count?.msgCount} offset={[5,-4]}></Badge>
        </>
      ),
      icon: <MailOutlined />
    },
    {
      key: '4',
      label: (
        <>
          <a onClick={()=>goNotification('notice')}>系统消息</a>
          <Badge style={{padding: '0 4px'}} count={count?.noticeCount} offset={[5,-4]}></Badge>
        </>
      ),
      icon: <InfoCircleOutlined />
    },
  ];

  return (
    <Dropdown placement='bottom' menu={{items}}>
      <a onClick={e => e.preventDefault()} style={{marginTop: 2}}>
        <Badge style={{padding: '0 4px'}} count={total}>
          <BellOutlined style={{fontSize: 20, color: '#FA541C'}}/>
        </Badge>
      </a>
    </Dropdown>
  );
};
export default Message;
