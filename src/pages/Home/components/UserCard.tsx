import {useModel} from '@umijs/max';
import {Avatar, Button, Divider, message, Space, Statistic, Tag, Tooltip} from 'antd';
import React from 'react';
import {CheckOutlined, MailOutlined} from "@ant-design/icons";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {history} from "@@/core/history";
import "./style.less"
import {follow} from "@/services/user/api";

type UserCardProps = {
  data: User.UserInfo;
  afterFollow?: (user: User.UserInfo) => void;
}

const UserCard: React.FC<UserCardProps> = ({data, afterFollow}) => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const verifyUserStatus = () => {
    if(currentUser){
      return true;
    } else {
      message.info('请先登录');
      return false;
    }
  }

  const doFollow = (user: User.UserInfo) => {
    if(verifyUserStatus()){
      follow(user.uid).then(res => {
        if (res.code === 200) {
          if (data.isFollow) {
            message.success('取关成功！');
          } else {
            message.success('关注成功！');
          }
          afterFollow?.(user);
        }
      })
    }
  }

  const goChat = (uid: number) => {
    if(verifyUserStatus()){
      history.push(`/notification?type=chat&targetUid=${uid}`);
    }
  }

  //一些css
  const statisticCss = useEmotionCss(()=>{
    return {
      ':hover': {
        cursor: 'pointer',
      },
      '.ant-statistic-title': {
        fontSize: 12,
        marginBottom: 0,
      }
    }
  })
  const avatarCss = useEmotionCss(()=>{
    return {
      ':hover': {
        cursor: 'pointer',
      }
    }
  })

  const signatureCss = useEmotionCss(()=>{
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxHeight: '3em',
      lineHeight: '1.5em',
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.45)'
    }
  })

  return (
    <>
      <div className='pageHeaderContent'>
        <div>
          <Avatar
            onClick={()=>history.push(`/user/${data.uid}`)}
            style={{width: 60, height: 60}} className={avatarCss} src={data.avatar}
          />
        </div>
        <div className='content'>
          <div>
            <a href={`/user/${data.uid}`}>{data.username}</a>
            <Tooltip color='green' overlayStyle={{fontSize: 12}} title={data.signature}>
              <div className={signatureCss}>
                {data.signature}
              </div>
            </Tooltip>
          </div>
          <Space size='large' style={{marginTop: 3}}>
            <Statistic className={statisticCss} valueStyle={{ color: '#3f8600', fontSize: 12 }} title="关注" value={data.follow} />
            <Statistic className={statisticCss} valueStyle={{ color: '#3f8600', fontSize: 12 }} title="粉丝" value={data.fans} />
            <Statistic className={statisticCss} valueStyle={{ color: '#3f8600', fontSize: 12 }} title="投稿" value={data.topic} />
          </Space>
          {
            (!currentUser || currentUser.uid !== data.uid) &&
            <div style={{marginTop: 5}}>
              <Space>
                {data.isFollow ?
                  <Button
                    icon={<CheckOutlined />}
                    type='primary'
                    onClick={()=>doFollow(data)}
                    style={{width: 100}}>已关注
                  </Button> :
                  <Button
                    onClick={()=>doFollow(data)}
                    style={{width: 100}}>关注
                  </Button>
                }
                <Button
                  onClick={()=>goChat(data.uid)}
                  type='primary' icon={<MailOutlined />} style={{width: 100}}>
                  发消息
                </Button>
              </Space>
            </div>
          }
        </div>
      </div>

      <Divider/>

      <div style={{maxWidth: 300}}>
        <span style={{color: 'rgba(0, 0, 0, 0.6)'}}>
          标签：
        </span>
        {
          data.tags.length > 0 ?
          data.tags.map(tag =>
            <Tag
              onClick={()=>history.push(`/search?type=user&tags=${tag.name}`)}
              className={avatarCss} key={tag.id} color={tag.color} style={{marginBottom: 6}}>
              {tag.name}
            </Tag>) : <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>暂未选择标签</span>
        }
      </div>
    </>
  );
};

export default UserCard;
