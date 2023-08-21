import {Card, Col, message, Row, Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import Articles from "@/pages/User/Center/components/Articles";
import {history, useParams} from "@@/exports";
import {getUserByUid} from "@/services/user/api";
import UserCard from "@/pages/Home/components/UserCard";
import Stars from "@/pages/User/Center/components/Stars";
import Follows from "@/pages/User/Center/components/Follows";
import Fans from "@/pages/User/Center/components/Fans";

const operationTabList = [
  {
    key: 'articles',
    tab: (
      <span>文章</span>
    ),
  },
  {
    key: 'stars',
    tab: (
      <span>收藏</span>
    ),
  },
  {
    key: 'follows',
    tab: (
      <span>关注</span>
    ),
  },
  {
    key: 'fans',
    tab: (
      <span>粉丝</span>
    ),
  },
];

const Center: React.FC = () => {
  const params = useParams();
  const [targetUser, setTargetUser] = useState<User.UserInfo>();
  const [tabKey, setTabKey] = useState<string>('articles');

  //获取用户信息
  useEffect(() => {
    async function fetchUserInfo(){
      if(!params.uid || !Number(params.uid) || Number(params.uid) < 1){
        message.error('用户不存在！');
        history.push('/');
        return ;
      }
      return await getUserByUid(Number(params.uid));
    }
    fetchUserInfo().then((res) => {
      if(res && res.code === 200){
        setTargetUser(res.data);
      }
    })
  },[])

  // 渲染tab切换
  const renderChildrenByTabKey = (tabValue: string) => {
    if(!targetUser){
      return <Skeleton/>
    }

    if (tabValue === 'articles') {
      return <Articles targetUser={targetUser}/>;
    } else if (tabValue === 'stars') {
      return <Stars uid={targetUser?.uid}/>;
    } else if (tabValue === 'follows') {
      return <Follows uid={targetUser?.uid}/>;
    } else if (tabValue === 'fans') {
      return <Fans uid={targetUser?.uid}/>;
    }

    return null;
  };

  return (
    <Row style={{width: 1180, margin: '0 auto'}}>
      <Col span={17} style={{paddingRight: 8}}>
        <Card
          bordered={false}
          tabList={operationTabList}
          activeTabKey={tabKey}
          onTabChange={(_tabKey: string) => {
            setTabKey(_tabKey);
          }}
        >
          {renderChildrenByTabKey(tabKey)}
        </Card>
      </Col>

      <Col span={7}>
        {targetUser && <Card bodyStyle={{padding: '12px 20px'}} style={{marginBottom: 8}}>
          {targetUser && <UserCard data={targetUser} afterFollow={() => {
            setTargetUser({
              ...targetUser,
              fans: targetUser.isFollow ? targetUser.fans - 1 : targetUser.fans + 1,
              isFollow: !targetUser.isFollow
            })
          }}/>}
        </Card>}
      </Col>
    </Row>
  );
};
export default Center;
