import {ReloadOutlined} from "@ant-design/icons";
import {history} from '@umijs/max';
import {Avatar, Badge, Card, List, message, Popover, Statistic, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {follow, getRecommendUsers, refreshRecommendUsers} from "@/services/user/api";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {useModel} from "@@/exports";
import {IconFont} from "@/utils";
import UserCard from "@/pages/Home/components/UserCard";

const RecommendUsers: React.FC = () => {
  const [recommendUsers, setRecommendUsers] = useState<User.RecommendUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  useEffect(()=>{
    //获取推荐用户
    getRecommendUsers().then(res => {
      if(res.code === 200){
        setRecommendUsers(res.data);
        setUsersLoading(false);
      }
    })
  }, [])

  const listItemCss = useEmotionCss(()=>{
    return {
      ':hover': {
        backgroundColor: '#fafbfc'
      }
    }
  })

  const refreshCss = useEmotionCss(() => {
    return {
      fontSize: 16,
      color: 'rgba(0, 0, 0, 0.45)',
      fontWeight: 800,
      ':hover': {
        color: '#FA541C',
        cursor: 'pointer',
        transition: 'color 0.3s'
      }
    }
  })

  const refreshRecommend = () => {
    setUsersLoading(true);
    refreshRecommendUsers().then(res => {
      if(res.code === 200){
        setRecommendUsers(res.data);
        setUsersLoading(false);
      }
    })
  }

  const avatarCss = useEmotionCss(()=>{
    return {
      ':hover': {
        cursor: 'pointer',
      }
    }
  })

  return (
    <Card
      bodyStyle={{padding: 0}}
      title='推荐用户'
      extra={<ReloadOutlined onClick={refreshRecommend} className={refreshCss}/>}
    >
      <List
        style={{margin: '8px 0'}}
        loading={usersLoading}
        itemLayout="horizontal"
        dataSource={recommendUsers}
        renderItem={(recommendUser) => (
          <List.Item className={listItemCss}>
            <Popover content={
              <UserCard
                data={recommendUser.userInfo}
                afterFollow={(user) => {
                  setRecommendUsers(recommendUsers.map(recommendUser =>
                    recommendUser.userInfo.uid === user.uid ? {
                      ...recommendUser,
                      userInfo: {
                        ...recommendUser.userInfo,
                        fans: recommendUser.userInfo.isFollow ? recommendUser.userInfo.fans - 1 : recommendUser.userInfo.fans + 1,
                        isFollow: !recommendUser.userInfo.isFollow,
                      }
                    }
                    : recommendUser))
                  }
                }
              />}
            >
              <div className='pageHeaderContent'>
                <div style={{marginLeft: 16}}>
                  {
                    recommendUser.userInfo.isFollow ?
                    <Badge size='small' offset={[-4,35]} count={<IconFont type='icon-checked'/>}>
                      <Avatar
                        onClick={()=>history.push(`/user/${recommendUser.userInfo.uid}`)}
                        className={avatarCss} size="large" src={recommendUser.userInfo.avatar}
                      />
                    </Badge> :
                    <Avatar
                      onClick={()=>history.push(`/user/${recommendUser.userInfo.uid}`)}
                      className={avatarCss} size="large" src={recommendUser.userInfo.avatar}
                    />
                  }
                </div>
                <div className='content'>
                  <div>
                    <a href={`/user/${recommendUser.userInfo.uid}`}>{recommendUser.userInfo.username}</a>
                  </div>
                  <div className='tags'>
                    {
                      recommendUser.userInfo.tags.length > 0 ?
                      recommendUser.userInfo.tags.map(tag =>
                        <Tag
                          onClick={()=>history.push(`/search?type=user&tags=${tag.name}`)}
                          className={avatarCss} key={tag.id} color={tag.color} style={{marginBottom: 6}}
                        >
                          {tag.name}
                        </Tag>) : <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>暂未选择标签</span>
                    }
                  </div>
                </div>
              </div>
            </Popover>
            {
              currentUser && recommendUser.score > 0.5 &&
              <div style={{float: 'right', width: '60px', marginRight: 16}}>
                <Statistic
                  title="相似度"
                  value={recommendUser.score}
                  precision={1}
                  valueStyle={{ color: '#3f8600', fontSize: 14 }}
                  suffix="%"
                />
              </div>
            }
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecommendUsers;
