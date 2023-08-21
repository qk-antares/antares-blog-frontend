import React, {createElement, useState} from "react";
import {history, useModel, useParams} from "@@/exports";
import {Avatar, Button, Col, Form, Input, message, Row} from "antd";
import {getChildrenOfRoot, publishComment} from "@/services/message/api";
import {DownOutlined, LikeFilled, LikeOutlined, UpOutlined} from "@ant-design/icons";
import moment from "moment";
import './RootComment.less'
import {Comment} from "@ant-design/compatible";

type RootCommentProps = {
  replyId: number;
  setReplyId: (newReplyId: number | undefined)=>void;
  rootComment: Message.RootComment;
}

const RootComment: React.FC<RootCommentProps> = ({replyId, setReplyId, rootComment}) => {
  const {id, content, fromUid, avatar, fromUsername, likeCount, createTime, replyCount} = rootComment;

  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const params = useParams();
  const articleId = Number(params.id);

  const [likes, setLikes] = useState(likeCount || 0);
  const [action, setAction] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [targetUid, setTargetUid] = useState<number | undefined>();
  const [targetUsername, setTargetUsername] = useState<string | undefined>();
  const [targetCommentId, setTargetCommentId] = useState<number | undefined>(-1);

  const [replies, setReplies] = useState(replyCount);
  const [isFold, setIsFold] = useState(true);
  const [childrenComments, setChildrenComments] = useState<Message.ChildrenComment[]>([]);

  const like = (targetCommentId: number | undefined) => {
    message.info('评论点赞功能待完善！');
    if(targetCommentId === id){
      setLikes(likes + 1);
      setAction('liked');
    }
  };

  //查询子评论
  const showChildrenComments = () => {
    if(!id) return;
    setIsFold(!isFold);
    if(childrenComments.length > 0 && replies === childrenComments.length) return;
    getChildrenOfRoot(id).then(res => {
      if(res.code === 200){
        setChildrenComments(res.data);
      }
    })
  }

  //在根评论下增加一条子评论
  const onFinish = () => {
    const data: Message.PostComment = {
      content: form.getFieldValue('content'),
      articleId,
      rootId: id,
      toUid: targetUid,
      toCommentId: targetCommentId
    }
    publishComment(data).then(res => {
      if(res.code === 200){
        message.info('发表成功');

        const newChildrenComment: Message.ChildrenComment = {
          id: res.data,
          articleId: data.articleId,
          rootId: id,
          content: data.content,
          fromUid: currentUser?.uid,
          avatar: currentUser?.avatar,
          fromUsername: currentUser?.username,
          toUid: targetUid,
          toUsername: targetUsername,
          toCommentId: targetCommentId,
          likeCount: 0,
          createTime: new Date(),
        };

        setChildrenComments([...childrenComments, newChildrenComment]);
        setReplies((replies || 0) + 1);
        setTargetCommentId(-1);
        setReplyId(-1);
        form.setFieldValue('content', '');
      }
    })
  }

  return (
    // 根评论
    <Comment
      actions={[
        <span style={{fontSize: 13}} key="comment-basic-like" onClick={()=>like(id)}>
          {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
          <span style={{marginLeft: 5}} className="comment-action">{likes}</span>
        </span>,
        <span
          onClick={()=>{
            if(currentUser){
              setTargetCommentId(id);
              setReplyId(id);
              setTargetUid(rootComment.fromUid);
              setTargetUsername(rootComment.fromUsername);
            } else {
              message.info('请先登录');
            }
          }}
          style={{fontSize: 13}} key="comment-basic-reply-to"
        >回复</span>,
        <>
          {currentUser?.uid === fromUid && <span style={{fontSize: 13}} key="comment-basic-delete">删除</span>}
        </>,
        <>
          {replies !== undefined && replies > 0 &&
            <span onClick={showChildrenComments} style={{fontSize: 13}} key="comment-open">
              {isFold ? <>展开{replies}条回复<DownOutlined/></> : <>折叠{replies}条回复<UpOutlined/></> }
            </span>}
        </>
      ]}
      author={<a href={`/user/${rootComment.fromUid}`}>{fromUsername}</a>}
      avatar={<Avatar onClick={()=>history.push(`/user/${rootComment.fromUid}`)} src={avatar} alt={fromUsername} />}
      content={<p style={{wordBreak:'break-all'}}>{content}</p>}
      datetime={<span>{moment(new Date(createTime).toISOString()).format('YYYY-MM-DD HH:mm')}</span>}
    >
      {/*子评论*/}
      {!isFold && childrenComments.map(child =>
        <Comment
          key={child.id}
          actions={[
            <span style={{fontSize: 13}} key="comment-basic-like" onClick={()=>like(child.id)}>
              {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
              <span style={{marginLeft: 5}} className="comment-action">{child.likeCount}</span>
            </span>,
            <span
              onClick={()=>{
                if(currentUser){
                  setReplyId(id);
                  setTargetUid(child.fromUid)
                  setTargetUsername(child.fromUsername)
                  setTargetCommentId(child.id)
                }else{
                  message.info('请先登录')
                }
              }}
              style={{fontSize: 13}} key="comment-basic-reply-to"
            >回复</span>,
            <>
              {currentUser?.uid === child?.fromUid && <span style={{fontSize: 13}} key="comment-basic-delete">删除</span>}
            </>,
          ]}
          author={
            <>
              <a href={`/user/${child.fromUid}`}>{child.fromUsername}</a>
              {
                child.toCommentId !== rootComment.id && <>
                  <b> 回复 </b>
                  <a href={`/user/${child.toUid}`}>{child.toUsername}</a>
                </>
              }
            </>
          }
          avatar={<Avatar onClick={()=>history.push(`/user/${child.fromUid}`)} src={child.avatar}/>}
          content={<p style={{wordBreak:'break-all'}}>{child.content}</p>}
          datetime={<span>{moment(new Date(child.createTime).toISOString()).format('YYYY-MM-DD HH:mm')}</span>}
        />)
      }

      {/*对根评论或者根评论下的子评论发表评论*/}
      {
        id === replyId &&
        <Row>
          <Col flex="42px">
            <Avatar src={currentUser?.avatar}/>
          </Col>
          <Col flex="auto">
            <Form
              form={form}
              name="comment"
              onFinish={onFinish}
            >
              <Row>
                <Col flex="auto">
                  <Form.Item name="content">
                    <Input.TextArea rows={2} maxLength={1000} placeholder={'回复' + (targetUsername || '层主')}/>
                  </Form.Item>
                </Col>
                <Col flex="48px">
                  <Form.Item style={{marginLeft: 12}}>
                    <Button type="primary" htmlType="submit" style={{float: 'right', height: 54}}>发布</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      }
    </Comment>
  )
}

export default RootComment;
