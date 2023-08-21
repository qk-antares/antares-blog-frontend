import {Avatar, Button, Col, Divider, Drawer, DrawerProps, Form, Input, message, Row} from "antd";
import React, {useEffect, useState} from "react";
import {history, useModel, useParams} from "@@/exports";
import {getRootCommentsOfArticle, publishComment} from "@/services/message/api";
import RootComment from "@/pages/Note/components/RootComment";


type CommentDrawerProps = {
  open: boolean;
  onClose: ()=>void;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({open, onClose}) => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const params = useParams();
  const articleId = Number(params.id);
  const [placement] = useState<DrawerProps['placement']>('right');
  const [form] = Form.useForm();
  const [rootComments, setRootComments] = useState<Message.RootComment[]>([]);
  const [replyId, setReplyId] = useState(-1);

  //首先获取根评论信息
  useEffect(() => {
    getRootCommentsOfArticle(articleId).then(res => {
      if(res.code === 200){
        setRootComments(res.data);
      }
    })
  },[])

  const onFinish = () => {
    const data = {
      content: form.getFieldValue('content'),
      articleId,
      rootId: -1
    }
    publishComment(data).then(res => {
      if(res.code === 200){
        message.info('发布成功');
        const newRootComment: Message.RootComment = {
          id: res.data,
          content: data.content,
          fromUid: currentUser?.uid,
          avatar: currentUser?.avatar,
          fromUsername: currentUser?.username,
          likeCount: 0,
          createTime: new Date(),
          replyCount: 0
        };
        setRootComments([...rootComments, newRootComment]);
      }
    })
  }

  return (
    <Drawer
      title="评论"
      placement={placement}
      width={500}
      onClose={onClose}
      open={open}
    >
      {
        <Row>
          <Col flex="42px">
            <Avatar src={currentUser?.avatar || '/images/avatar.png'}/>
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
                    {
                      currentUser ?
                      <Input.TextArea rows={3} maxLength={1000} placeholder="与其赞同别人的话，不如自己畅所欲言"/> :
                      <div
                        style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 76, cursor: 'pointer', borderRadius: 6, color: '#9499A0', backgroundColor: '#f1f2f3'}}
                        onClick={()=>history.push('/user/login')}
                      >
                        <span>请先</span>
                        <Button type='primary' style={{margin: '0 4px'}} size='small'>登录</Button>
                        <span>后发表评论 (・ω・)</span>
                      </div>
                    }
                  </Form.Item>
                </Col>

                <Col flex="48px">
                  <Form.Item style={{marginLeft: 12}} >
                    <Button disabled={!currentUser} type="primary" htmlType="submit" style={{float: 'right', height: 76}}>发布</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      }
      <Divider style={{margin: '12px 0'}}/>
      <div style={{height: '80vh',overflow: 'auto'}}>
        {rootComments.map(rootComment =>
          <RootComment
            key={rootComment.id}
            replyId={replyId}
            setReplyId={(newReplyId)=>setReplyId(newReplyId || -1)}
            rootComment={rootComment}
          />)}
      </div>
    </Drawer>

  );
};

export default CommentDrawer;
