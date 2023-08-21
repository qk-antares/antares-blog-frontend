import {Avatar, Badge, Button, List, Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import {listLikeNotificationByPage} from "@/services/message/api";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {history} from "@@/core/history";
import moment from "moment";

const LikeList: React.FC<{likeCount: number}> = ({likeCount}) => {
  const [likes, setLikes] = useState<Message.LikeNotification[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(()=>{
    const params: Message.PageQuery = {
      pageNum,
      pageSize: 10
    }
    listLikeNotificationByPage(params).then(res => {
      if(res.code === 200){
        setLikes([...likes, ...res.data.records]);
        setTotal(res.data.total);
        setLoading(false);
      }
    })
  }, [pageNum]);

  const loadMore = <>
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      {
        likes.length < total ?
        <Button onClick={()=>setPageNum(pageNum+1)}>加载更多</Button> :
        <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>没有更多了~</span>
      }
    </div>
  </>

  const avatarCss = useEmotionCss(()=>{
    return {
      ':hover': {
        cursor: 'pointer',
      }
    }
  })

  const descriptionCss = useEmotionCss(()=>{
    return {
      marginTop: 4,
      backgroundColor: 'rgb(245,245,245)',
      color: "#2f3034",
      padding: '4px 8px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 13,
      ':hover': {
        color: '#FA541C',
        cursor: 'pointer',
        transition: 'color 0.3s'
      }
    }
  })

  return (
    <div style={{height: '100%', overflow: 'auto'}}>
      {
        loading ?
        <List
          style={{padding: 16}}
          itemLayout="horizontal"
          dataSource={new Array(10).fill(0)}
          renderItem={()=><List.Item><Skeleton avatar paragraph={{ rows: 1 }} /></List.Item>}
        /> :
        <List
          style={{padding: 16}}
          itemLayout="horizontal"
          dataSource={likes}
          loadMore={loadMore}
          renderItem={(like, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={ index < likeCount ?
                  <Badge dot offset={[-5,5]}>
                    <Avatar
                      onClick={()=>history.push(`/user/${like.fromUid}`)}
                      className={avatarCss}
                      src={like.avatar}
                      size='large'/>
                  </Badge> :
                  <Avatar
                    onClick={()=>history.push(`/user/${like.fromUid}`)}
                    className={avatarCss}
                    src={like.avatar}
                    size='large'
                  />
                }
                description={<>
                  <div>
                    <a href={`/user/${like.fromUid}`}>{like.fromUsername}</a> 赞了你的文章
                    <span style={{float: 'right'}}>
                      {moment(new Date(like.createTime).toISOString()).format('YYYY年MM月DD日 HH:mm')}
                    </span>
                  </div>
                  <div onClick={()=>history.push(`/note/${like.articleId}`)} className={descriptionCss}>
                    <b>{like.title}</b> {like.summary}
                  </div>
                </>}
              />
            </List.Item>
          )}
        />
      }
    </div>
  );
};

export default LikeList;
