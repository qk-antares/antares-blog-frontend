import {Button, Card, Descriptions, message, Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import {useParams} from 'umi'
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import {getArticleBasicById, getArticleContentById, publishArticle, updateContentById} from "@/services/article/api";
import {history, useModel} from "@@/exports";
import {ApartmentOutlined} from "@ant-design/icons";

const editorId = 'my-editor';

const EditNote: React.FC = () => {
  const params = useParams();
  const articleId = Number(params.id);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [loading, setLoading] = useState(true);
  const [articleContent, setArticleContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [status, setStatus] = useState(0);

  //首先查询当前用户是不是文章作者，是的话返回标题和摘要，然后再根据id查询文章内容；否的话进行跳转
  useEffect(() => {
    //1.检查是否登录了
    if(!currentUser){
      message.error('请先登录');
      history.push('/user/login?redirect=' + encodeURIComponent(window.location.href));
      return;
    }

    //2.获取文章基本信息
    getArticleBasicById(articleId).then(res => {
      if(res.code === 200){
        if(currentUser?.uid === res.data.createdBy){
          setTitle(res.data.title);
          setSummary(res.data.summary);
          setStatus(res.data.status);
          setLoading(false);
          //3.获取文章content
          return getArticleContentById(articleId);
        } else {
          message.error('你无权编辑本文章！');
          history.push('/');
        }
      } else {
        //文章不存在
        history.push('/');
      }
    }).then(res => {
      if(res && res.code === 200){
        setArticleContent(res.data.content);
      }
    })
  },[])

  const saveContent = async () => {
    const res = await updateContentById(Number(params.id), {content: articleContent});
    if(res.code === 200){
      message.success('保存成功！');
    }
  }
  const publish = async () => {
    const res = await publishArticle(Number(params.id), {content: articleContent});
    if(res.code === 200){
      message.success('发布成功！');
      setStatus(1);
    }
  }

  return (
    <Card
      style={{width: 1180, margin: '0 auto'}}
      title={loading ?
        <Skeleton paragraph={false}/> :
        <>
          编辑文章 / <a href={`/note/${articleId}`}> {title}</a>
        </>
        }
      loading={loading}>

      <Card
        style={{borderRadius: 0, marginBottom: 16, borderLeft: '4px solid rgb(194,194,194)', backgroundColor: 'rgb(250, 250,250)'}}
        bodyStyle={{padding: '4px 8px'}}
      >
        <div style={{margin: '4px'}}>
          <Descriptions column={1} style={{}}>
            <Descriptions.Item
              label={<p style={{margin: 0}}><ApartmentOutlined style={{marginRight: 8}}/>摘要</p>}
              style={{paddingBottom: 0}}
            >
              {summary}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>

      {!loading &&
        <MdEditor
          style={{height: 600}}
          modelValue={articleContent}
          editorId={editorId}
          toolbarsExclude={['save','htmlPreview','github']}
          onChange={(content) => {setArticleContent(content)}}
        />}
      <div style={{marginTop: 16, float: 'right'}}>
        {status !== 1 && <Button onClick={publish}>发布</Button>}
        <Button style={{marginLeft: 16}} type='primary' onClick={saveContent}>保存</Button>
      </div>
    </Card>
  );
};

export default EditNote;
