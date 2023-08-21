import {Avatar, Badge, Card, Col, Descriptions, message, Row, Space, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import {history, useLocation, useModel, useParams} from "@@/exports";
import {getArticleById, likeBlog} from "@/services/article/api";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {ApartmentOutlined, ClockCircleOutlined, EyeOutlined, LikeOutlined, StarOutlined} from "@ant-design/icons";
import {IconFont} from "@/utils";
import moment from "moment";
import CommentDrawer from "@/pages/Note/components/CommentDrawer";
import StarModal from "@/pages/Note/components/StarModal";
import UserCard from "@/pages/Home/components/UserCard";
import {getUserByUid} from "@/services/user/api";

const editorId = 'my-editor';

const Detail: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const articleId = Number(params.id);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [article, setArticle] = useState<Article.Article>();
  const [articleLoading, setArticleLoading] = useState(true);
  const [open, setOpen] = useState<boolean>(()=>{
    return Boolean(urlSearchParams.get('open')) || false;
  });
  const [starModalVisible, setStarModalVisible] = useState<boolean>(false);
  const [author, setAuthor] = useState<User.UserInfo>()

  const [state] = useState({
    text: '# heading',
    scrollElement: document.documentElement
  });

  //首先获取文章的全部信息，根据id查询文章信息
  //然后根据查到的文章信息，同步去查询作者信息和当前用户是否点赞，用户的信息其实和文章一样是热点数据，可以缓存到redis中
  useEffect(() => {
    getArticleById(articleId).then(res => {
      if(res.code === 200){
        setArticle(res.data);
        setArticleLoading(false);
        return getUserByUid(res.data.createdBy);
      } else {
        //文章不存在
        history.push('/');
      }
    }).then(res => {
      if(res?.code === 200){
        setAuthor(res.data);
      }
    })
  },[])

  const catalog = useEmotionCss(()=>{
    return {
      maxHeight: 'calc(100vh - 176px)',
      overflow: 'auto',
    }
  })

  const icon = useEmotionCss(() => {
    return {
      borderRadius: '50%',
      fontSize: '18px',
      border: '0',
      padding: '8px',
      marginBottom: 16,
      boxShadow: '0 0 8px rgb(0 0 0 / 20%)',
      transition: 'all 0.25s ease-in-out',
      ':hover': {
        boxShadow: '0 0 10px rgb(250 54 28 / 80%)',
        backgroundColor: 'rgba(0, 0, 0, 0.06)'
      }
    }
  });

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  //点击点赞按钮
  const likeArticle = () => {
    if(!currentUser){
      message.info('请先登录');
      return;
    }
    if(article){
      likeBlog(articleId).then((res)=>{
        if(res.code === 200){
          if(article?.isLiked){
            message.success('取消点赞成功！');
            setArticle({...article, isLiked: !article.isLiked, likeCount: article?.likeCount - 1});
          } else {
            message.success('点赞成功！');
            setArticle({...article, isLiked: !article.isLiked, likeCount: article?.likeCount + 1});
          }
        }
      })
    }
  }

  //点击收藏按钮
  const starArticle = () => {
    if(!currentUser){
      message.info('请先登录');
      return;
    }
    setStarModalVisible(true);
  }

  const avatarCss = useEmotionCss(()=>{
    return {
      ':hover': {
        cursor: 'pointer',
      }
    }
  })

  return (
    <Row style={{width: 1180, margin: '0 auto'}}>
      <Col span={16}>
        <Card loading={articleLoading} style={{borderRadius: 8}}>
          {article &&
            <>
              <div style={{marginBottom: 8, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h1 style={{fontSize: "28px", wordWrap: "break-word", color: "#222226", fontWeight: 600, margin: "0", wordBreak: "break-all"}}>
                  {article.title}
                </h1>
              </div>
              <Card bodyStyle={{padding: '4px 8px', backgroundColor: 'rgb(255,241,240)', color: 'rgb(153,154,170)'}}>
                <div style={{margin: '4px'}}>
                  <Space size={12}>
                    <div>
                      <Avatar className={avatarCss} src={article.author?.avatar} size="small" />
                      <a href={`/user/${article.createdBy}`}> {article.author?.username} </a>
                    </div>
                    <div>发布于</div>
                    <div>
                      <ClockCircleOutlined /> {moment(new Date(article.updateTime).toISOString()).format('YYYY-MM-DD HH:mm')}
                    </div>

                    <div>
                      <EyeOutlined /> 浏览 {article.viewCount}
                    </div>

                    <div>
                      <LikeOutlined /> 点赞 {article.likeCount}
                    </div>

                    <div>
                      <StarOutlined /> 收藏 {article.starCount}
                    </div>
                  </Space>
                </div>

                {article.tags &&
                  <div style={{margin: '4px'}}>
                    文章标签：{article.tags.length > 0 ?
                    article.tags.map(tag =>
                      <Tag onClick={()=>history.push(`/search?type=blog&tags=${tag.name}`)}
                           className={avatarCss} key={tag.id} color={tag.color}>{tag.name}</Tag>) :
                    '无'}
                  </div>
                }

              </Card>

              <Card
                style={{borderRadius: 0, marginTop: 16, borderLeft: '4px solid rgb(194,194,194)', backgroundColor: 'rgb(250, 250,250)'}}
                bodyStyle={{padding: '4px 8px'}}
              >
                <div style={{margin: '4px'}}>
                  <Descriptions column={1} style={{}}>
                    <Descriptions.Item
                      label={<p style={{margin: 0}}><ApartmentOutlined style={{marginRight: 8}}/>摘要</p>}
                      style={{paddingBottom: 0}}
                    >
                      {article.summary}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Card>

              <MdEditor previewOnly={true} modelValue={article.content || ''} editorId={editorId}/>
            </>
          }
        </Card>
      </Col>
      <Col span={7} style={{paddingLeft: '8px'}}>
        {author && <Card bodyStyle={{padding: '12px 20px'}} style={{marginBottom: 8}}>
          {<UserCard data={author} afterFollow={() => {
            setAuthor({...author,
              fans: author?.isFollow ? author.fans - 1 : author.fans + 1,
              isFollow: !author.isFollow
            })
          }}/>}
        </Card>}

        <Card loading={articleLoading} style={{position: 'sticky', top: '63px'}} hoverable={true} title='目录'>
          <div className={catalog}>
            <MdEditor.MdCatalog editorId={editorId} scrollElement={state.scrollElement}/>
          </div>
        </Card>
      </Col>

      {/*侧边点赞、收藏、评论、回到顶部*/}
      <div style={{position: 'fixed', right: '3%', bottom: '20vh', fontSize: '18px', cursor: 'pointer'}}>
        {/*点赞*/}
        <Badge count={article?.likeCount}>
          {article?.isLiked ?
            <IconFont
              onClick={likeArticle}
              className={icon}
              style={{color: "red"}}
              type='icon-like-fill'
            /> :
            <IconFont
              onClick={likeArticle}
              className={icon}
              type='icon-like'/>
          }
        </Badge>
        <br/>

        {/*收藏*/}
        <Badge count={article?.starCount}>
          {article?.isStared ?
            <IconFont
              onClick={starArticle}
              className={icon}
              style={{color: "red"}}
              type='icon-star2'
            /> :
            <IconFont
              onClick={starArticle}
              className={icon}
              type='icon-star'
            />
          }
        </Badge>
        <br/>

        <Badge count={article?.commentCount}>
          <IconFont onClick={()=>setOpen(true)} className={icon} type='icon-comment'/>
        </Badge>
        <br/>
        <IconFont onClick={toTop} className={icon} type='icon-md-rocket'/>
      </div>

      {/*收藏Modal*/}
      {/*收藏Modal*/}
      {
        starModalVisible &&
        <StarModal
          articleId={articleId}
          visible={starModalVisible}
          onCancel={()=>setStarModalVisible(false)}
          onOver={()=>{
            setStarModalVisible(false);
            if(article?.isStared){
              setArticle({...article, isStared: !article.isStared, starCount: article.starCount - 1})
            } else {
              // @ts-ignore
              setArticle({...article, isStared: !article.isStared, starCount: article.starCount + 1})
            }
          }}
        />
      }

      {/*评论*/}
      <CommentDrawer open={open} onClose={()=>setOpen(false)}/>
    </Row>
  );
};

export default Detail;
