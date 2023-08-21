import {Avatar, Badge, Button, Col, List, Row, Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import {listCommentNotificationByPage} from "@/services/message/api";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {history} from "@@/core/history";
import moment from "moment";
import {StringUtils} from "@/utils";
import './comment.less'

const CommentList: React.FC<{commentCount: number}> = ({commentCount}) => {
  const [comments, setComments] = useState<Message.CommentNotification[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(()=>{
    const params: Message.PageQuery = {
      pageNum,
      pageSize: 10
    }
    listCommentNotificationByPage(params).then(res => {
      if(res.code === 200){
        setComments([...comments, ...res.data.records]);
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
        comments.length < total ?
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

  const commentCss = useEmotionCss(()=>{
    return {
      marginTop: 4,
      backgroundColor: 'rgb(245,245,245)',
      padding: '4px 8px',
      borderRadius: 4,
      ':hover': {
        cursor: 'pointer'
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
          dataSource={comments}
          loadMore={loadMore}
          renderItem={(comment, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={ index < commentCount ?
                  <Badge dot offset={[-5,5]}>
                    <Avatar
                      onClick={()=>history.push(`/user/${comment.fromUid}`)}
                      className={avatarCss}
                      src={comment.avatar}
                      size='large'/>
                  </Badge> :
                  <Avatar
                    onClick={()=>history.push(`/user/${comment.fromUid}`)}
                    className={avatarCss}
                    src={comment.avatar}
                    size='large'
                  />
                }
                description={<Row>
                  <Col flex='auto'>
                    <div>
                      <a href={`/user/${comment.fromUid}`}>{comment.fromUsername}</a>
                      <span style={{float: 'right'}}>
                      {moment(new Date(comment.createTime).toISOString()).format('YYYY年MM月DD日 HH:mm')}
                    </span>
                    </div>
                    <div style={{color: 'rgb(100, 100, 102)'}}>
                      回复我：{comment.content}
                    </div>
                    {
                      StringUtils.isNotEmpty(comment.fromContent) &&
                      <div onClick={()=>history.push(`/note/${comment.articleId}?open=true`)} className={commentCss}>
                        <span style={{color: 'rgb(120, 120, 120)'}}>我的评论：</span>{comment.fromContent}
                      </div>
                    }
                  </Col>
                  <Col flex='120px'>
                    <div onClick={()=>history.push(`/note/${comment.articleId}`)} className='text-box'>
                      <b>{comment.title}</b> {comment.summary}
                    </div>
                  </Col>
                </Row>}
              />
            </List.Item>
          )}
        />
      }
    </div>


  );
};

export default CommentList;
