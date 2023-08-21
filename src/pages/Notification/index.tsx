import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, message, Row} from "antd";
import Chat from "@/pages/Notification/components/Chat";
import {IconFont} from "@/utils";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import LikeList from "@/pages/Notification/components/LikeList";
import CommentList from "@/pages/Notification/components/CommentList";
import {useLocation, useNavigate} from "@@/exports";
import {clearNotification, getNoticeCount} from "@/services/message/api";

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const tabs: string[] = ['收到的赞','回复我的','我的消息','系统通知'];
  const map = new Map([
    ['like', '收到的赞'],
    ['comment', '回复我的'],
    ['chat', '我的消息'],
    ['notice', '系统通知'],
  ]);
  const [active,setActive] = useState<string>(()=>{
    return map.get(urlSearchParams.get('type') || 'like') || '回复我的';
  });
  const childRef = useRef(null);

  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(()=>{
    //获取消息信息
    getNoticeCount().then(res => {
      if(res.code === 200){
        setLikeCount(res.data.likeCount);
        setCommentCount(res.data.commentCount);
        setMsgCount(res.data.msgCount);
        setNoticeCount(res.data.noticeCount);
      }
    })
  })

  const liCss = tabs.map(tab => {
    if(tab === active){
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useEmotionCss(() => {
        return {
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          color: '#2faee3',
          fontWeight: 700,
          'a': {
            paddingLeft: 10,
            color: '#2faee3'
          }
        }
      })
    } else {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useEmotionCss(()=>{
        return {
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          color: '#6b757b',
          fontWeight: 700,
          ':hover': {
            color: '#2faee3',
          },
          'a': {
            paddingLeft: 10,
            color: '#6b757b',
            ':hover': {
              color: '#2faee3'
            }
          }
        }
      })
    }
  })

  const changeType= (type: string) => {
    setActive(map.get(type) || '收到的赞');
    //添加pageNum参数
    navigate({
      search: `?${new URLSearchParams({type}).toString()}`
    });
  }

  const doClear = ()=>{
    const typeParam = urlSearchParams.get('type') || 'like';
    clearNotification(typeParam).then(res => {
      if(res.code === 200){
        switch (typeParam){
          case 'like': setLikeCount(0);break;
          case 'comment': setCommentCount(0);break;
          case 'chat':
            setMsgCount(0);
            // @ts-ignore
            childRef.current?.clearMsg();
            break;
          case 'notice':setNoticeCount(0);break;
        }
      }
    })
  }

  return (
    <Row style={{width: 1080, margin: '0 auto'}}>
      <Col span={3}>
        <Card
          bordered={false}
          style={{height: 'calc(100vh - 83px)', background: 'rgba(255, 255, 255, 0.7)'}}
          bodyStyle={{padding: 0}}>
          <div style={{width: '100%', display: 'flex', height: 62, justifyContent: 'center', alignItems: 'center'}}>
            <IconFont type="icon-fabu" style={{marginRight: 10, fontSize: 14, fontWeight: 700}}/>
            <div style={{alignItems: 'center', color: '#333', fontSize: 14, fontWeight: 700}}>消息中心</div>
          </div>

          <ul style={{padding: '0 0 0 20px', margin: 0}}>
              <li className={liCss[0]} >
                <IconFont type='icon-dot'/>
                <a onClick={()=>changeType('like')}>收到的赞</a>
              </li>
            <li className={liCss[1]}>
              <IconFont type='icon-dot'/>
              <a onClick={()=>changeType('comment')}>回复我的</a>
            </li>
            <li className={liCss[2]}>
              <IconFont type='icon-dot'/>
              <a onClick={()=>changeType('chat')}>我的消息</a>
            </li>
            <li className={liCss[3]}>
              <IconFont type='icon-dot'/>
              <a onClick={()=>changeType('notice')}>系统通知</a>
            </li>
          </ul>
        </Card>
      </Col>
      <Col span={21} style={{paddingLeft: 8}}>
        <Card style={{marginBottom: 8}} bodyStyle={{padding: 0}}>
          <div style={{height: 42, display: 'flex', alignItems: 'center',justifyContent: 'space-between', padding: '0 16px',fontSize: 15, color: '#666'}}>
            {active}
            <div style={{float: 'right'}}>
              <Button
                disabled={!(active === '收到的赞' && likeCount > 0 ||
                active === '回复我的' && commentCount > 0 ||
                active === '我的消息' && msgCount > 0 ||
                active === '系统通知' && noticeCount > 0)}
                shape="round"
                icon={<IconFont type='icon-quanbubiaoweiyidu'/>}
                onClick={doClear}
              >
                标记为已读
              </Button>
            </div>
          </div>
        </Card>

        <Card bordered={false} style={{border: 'solid 1px #d1dbe3'}} bodyStyle={{padding: 0}}>
          <div style={{height: 'calc(100vh - 136px)'}}>
            {active === '收到的赞' && <LikeList likeCount={likeCount}/>}
            {active === '回复我的' && <CommentList commentCount={commentCount}/>}
            {active === '我的消息' && <Chat ref={childRef}/>}
            {active === '系统通知' &&
              <div style={{width: '100%', height: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{backgroundImage: 'url(./not_found.png)',
                  backgroundSize: '402px 402px',
                  marginBottom: 32,
                  width: 402,
                  height: 402}}>
                </div>
                <div style={{color:' #8896b8', fontSize: 14, lineHeight: '1.5em'}}>
                  暂时没有系统通知
                </div>
              </div>
            }
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Notification;
