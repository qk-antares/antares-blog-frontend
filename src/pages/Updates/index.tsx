import {Avatar, Badge, Button, Card, Col, List, message, Row} from 'antd';
import React, {useEffect, useState} from 'react';
import {getFollowsOfCurrent} from "@/services/user/api";
import {useModel} from "@@/exports";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import UserCard from "@/pages/Home/components/UserCard";
import {IconFont} from "@/utils";
import Article from "@/pages/Note/components/Article";
import {getUpdates} from "@/services/article/api";

const Updates: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const [follows, setFollows] = useState<User.Follow[]>([]);
  const [followsLoading, setFollowsLoading] = useState(true);

  const [updates, setUpdates] =  useState<Article.Article[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);

  const [translateX, setTranslateX] = useState<number>(0);
  const [maxTranslateX, setMaxTranslateX] = useState<number>(0);

  const [activeUid, setActiveUid] = useState(-1);

  const loadData = (uid: number, pageNum: number)=>{
    setUpdatesLoading(true);
    const params: Article.ArticleQuery = {uid, pageNum};
    getUpdates(params).then(res => {
      if(res.code === 200){
        if(res.data){
          setUpdates([...updates, ...res.data.records]);
          setTotal(res.data.total);
        } else {
          message.info('您未关注任何用户！');
        }
        setUpdatesLoading(false);
      }
    })
  }

  //获取所有关注用户
  useEffect(() => {
    getFollowsOfCurrent().then(res => {
      if(res.code === 200){
        setFollowsLoading(false);
        setFollows(res.data);
        setMaxTranslateX(-1 * Math.floor((res.data.length+1) / 9) * 592)
      }
    })
  }, [])

  useEffect(()=>{
    //重新加载
    loadData(activeUid, pageNum);
  }, [activeUid, pageNum])

  //加载更多按钮
  const loadMore =
    !updatesLoading && total > updates.length ? (
      <div style={{textAlign: 'center', marginTop: 8, height: 32, lineHeight: '32px', width: '100%'}}>
        <Button
          style={{width: '100%'}} onClick={()=>{
            setPageNum(pageNum+1);
            // loadData(activeUid, pageNum+1);
          }}>
          加载更多
        </Button>
      </div>
    ) : null;

  //一些css
  const containerCss = useEmotionCss(()=>{
    return {
      flex: 1,
      overflow: 'hidden',
      padding: '17px 10px 10px',
    }
  })

  const avatarListCss = useEmotionCss(()=>{
    return {
      transform: `translateX(${translateX}px)`,
      display: 'flex',
      transition: 'transform 0.3s'
    }
  })

  const activeCss = useEmotionCss(()=>{
    return {
      width: 68,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      margin: '0 3px',
      flexShrink: 0,
      '.username': {
        marginTop: 4,
        alignItems: 'center',
        color: '#FA541C',
        fontSize: 13,
        display: '-webkit-flex',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'break-all',
        textAlign: 'center',
        fontFamily: 'PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important',
      },
      '.avatar': {
        width: 50,
        height: 50,
        border: '#FA541C solid 1px',
      },
      ':hover': {
        '.avatar': {
          cursor: 'pointer',
        },
        '.username': {
          cursor: 'pointer',
        }
      }
    }
  })

  const followCss = useEmotionCss(() => {
    return {
      width: 68,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      margin: '0 3px',
      flexShrink: 0,
      '.username': {
        marginTop: 4,
        alignItems: 'center',
        color: '#6d757a',
        fontSize: 13,
        display: '-webkit-flex',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'break-all',
        textAlign: 'center',
        fontFamily: 'PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif!important',
      },
      '.avatar': {
        width: 50,
        height: 50,
      },
      ':hover': {
        '.avatar': {
          cursor: 'pointer',
          boxShadow: '0 0 0 1px #FA541C',
          transition: 'box-shadow 0.1s'
        },
        '.username': {
          cursor: 'pointer',
          color: '#FA541C'
        }
      }
    }
  })

  const arrowCss = useEmotionCss(()=>{
    return {
      transform: 'matrix(1,0,0,-1,0,0)',

      alignItems: 'center',
      borderRadius: 6,
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      width: 56,
      height: '100%',
      zIndex: 1,

      ':hover': {
        cursor: 'pointer',
      }
    }
  })

  return (
    <Row style={{width: 1080, margin: '0 auto'}}>
      <Col span={17} style={{paddingRight: 12}}>
        <Card loading={followsLoading} bodyStyle={{padding: 0}} style={{marginBottom: 8}}>
          {translateX < 0 &&
            <div style={{left: 0, background: 'linear-gradient(270deg,hsla(0,0%,100%,0),#fff)'}} className={arrowCss} onClick={()=>{setTranslateX(translateX+592)}}>
              <IconFont type='icon-angle-left'/>
            </div>}

          <div className={containerCss}>
            <div className={avatarListCss}>
              <div
                onClick={()=>{
                  if(activeUid !== -1) {
                    setUpdates([]);
                    setActiveUid(-1);
                  }
                }}
                className={activeUid === -1 ? activeCss : followCss}>
                <Avatar className='avatar' src='/images/updates.png'/>
                <div className='username'>全部动态</div>
              </div>
              {follows.map(follow =>
                <div
                  onClick={()=> {
                    if(activeUid !== follow.uid) {
                      setUpdates([]);
                      setActiveUid(follow.uid)
                    }
                  }}
                  key={follow.uid} className={activeUid === follow.uid ? activeCss : followCss}>
                  <Badge size="small" count={follow.unread} offset={[-6,42]}>
                    <Avatar className='avatar'  src={follow.avatar}/>
                  </Badge>
                  <div className='username'>{follow.username}</div>
                </div>
              )}
            </div>
          </div>

          {translateX > maxTranslateX &&
            <div style={{left: 'unset', right: 0, background: 'linear-gradient(90deg,hsla(0,0%,100%,0),#fff)'}} className={arrowCss} onClick={()=>{setTranslateX(translateX-592)}}>
              <IconFont type='icon-angle-right'/>
            </div>}
        </Card>

        <List
          itemLayout="vertical"
          size="large"
          loading={updatesLoading}
          loadMore={loadMore}
          dataSource={updates}
          renderItem={(update) => (
            <Article
              data={{...update}} type='normal'
              updateInfo={(id, isLiked, likeCount, isStared, starCount)=>{
                setUpdates(updates.map(tmp => tmp.id === update.id ? {...tmp, isLiked, likeCount, isStared, starCount} : tmp));
              }}
            />
          )}
        />
      </Col>
      <Col span={7}>
        <Card bodyStyle={{padding: '12px 20px'}} style={{marginBottom: 8}}>
          {currentUser && <UserCard data={currentUser}/>}
        </Card>
      </Col>
    </Row>
  );
};

export default Updates;
