import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  PushpinOutlined,
  SettingOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {Avatar, Button, Card, Dropdown, Image, List, MenuProps, message, Space, Tag} from "antd";
import moment from "moment";
import React, {useState} from "react";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {history, useModel} from "@@/exports";
import {IconFont} from "@/utils";
import {deleteArticle, likeBlog, publishArticle} from "@/services/article/api";
import StarModal from "@/pages/Note/components/StarModal";

type ArticleProps = {
  data: Article.Article;
  type: string;//user是用户中心式，带有编辑按钮；normal
  updateInfo: (id:number, isLiked:boolean, likeCount:number, isStared:boolean, starCount:number)=>void;
}

const Article: React.FC<ArticleProps> = ({data, type, updateInfo}) => {
  const {id, title, summary,
    status, isTop, prime,
    viewCount , commentCount,
    createdBy, createTime, updateTime,
    thumbnails, tags, author,
    isLiked, likeCount, isStared, starCount
  } = data;
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [visible, setVisible] = useState(false);
  const [starModalVisible, setStarModalVisible] = useState(false);

  //作者执行编辑操作
  const items: MenuProps['items'] = [
    {
      key: '0',
      label: '发布',
      icon: <IconFont type="icon-fabu"/>,
      disabled: status === 1,
    },
    {
      key: '1',
      label: <a href={`/note/settings/${id}`}>配置</a>,
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: '删除',
      icon: <DeleteOutlined />
    },
  ]

  const onClick: MenuProps['onClick'] = async ({key}) => {
    //如果点击的是退出，则要请求退出
    switch (key) {
      case '0' : publishArticle(id).then(res => {
        if(res.code === 200){
          message.success('发布成功！');
          window.location.reload();
        }
      });break;
      case '3' : deleteArticle(id).then(res => {
        if(res.code === 200){
          message.success('删除成功');
          window.location.reload();
        }
      })
    }
    console.log(key);
  };

  //样式
  const listContent = useEmotionCss(()=>{
    return {
      '.ant-image':{
        borderRadius: 8,
        boxShadow: '0 0 10px rgb(0 0 0 / 20%)',
        overflow: 'hidden',
        '.ant-image-img': {
          transition: 'all 0.6s',
          cursor: 'pointer',
          ':hover': {
            transform: 'scale(1.4)',
          },
          ':hover+.ant-image-mask': {
            opacity: 1,
          }
        },
        '.ant-image-mask': {
          pointerEvents: 'none'
        }
      },
      ".description": {
        display: 'flex',
        marginTop: '12px',
        lineHeight: "22px",
        'a': {
          color: "rgba(0, 0, 0, 0.88)",
          ':hover': {
            color: '#fa541c',
            transition: 'all 0.3s'
          }
        }
      },
      ".extra": {
        marginTop: "16px",
        color: "fade(#000, 45%)",
        lineHeight: "22px",
      }
    };
  });
  const cardCss = useEmotionCss(()=>{
    return {
      margin: '8px 0',
      padding: 0,
      ':hover': {
        cursor: 'default'
      }
    }
  })
  const countCss = useEmotionCss(()=>{
    return {
      position: 'absolute',
      right: 6,
      bottom: 10,
      zIndex: 10,
      display: 'block',
      color: '#fff',
      padding: '0 4px',
      lineHeight: 'normal',
      backgroundColor: 'rgba(0,0,0,.5)',
      borderRadius: '4px'
    }
  })
  const summaryCss = useEmotionCss(()=>{
    return{
      color: '#555666',
      wordBreak: 'break-all',
      ':hover': {
        color: '#FA541C',
        transition: 'color 0.3s'
      }
    }
  })
  const avatarCss = useEmotionCss(()=>{
    return  {
      ':hover': {
        cursor: 'pointer'
      }
    }
  });
  const iconCss = useEmotionCss(()=>{
    return {
      ':hover': {
        cursor: 'pointer',
        color: '#FA541C',
        transition: 'color 0.2s'
      }
    }
  });

  //点击点赞按钮
  const likeArticle = () => {
    if(!currentUser){
      message.info('请先登录');
      return;
    }
    //todo: 后端这里最好用消息队列优化，保证点赞接口快速返回
    likeBlog(id).then(res => {
      if(res.code === 200){
        if(isLiked){
          message.success('取消点赞成功！');
          updateInfo(id, !isLiked, likeCount - 1, isStared, starCount);
        } else {
          message.success('点赞成功！');
          updateInfo(id, !isLiked, likeCount + 1, isStared, starCount);
        }
      }
    })
  }

  //点击收藏按钮
  const starArticle = () => {
    if(!currentUser){
      message.info('请先登录');
      return;
    }
    setStarModalVisible(true);
  }

  return (
    <Card hoverable={true} className={cardCss} bodyStyle={{padding: 0}}>
      <List.Item
        style={{padding: '16px 24px 12px 24px'}}
        key={id}
        actions={[
          // 不判断当前用户是否点赞或者收藏了
          <Space className={iconCss} onClick={likeArticle} key="list-vertical-like-o">
            {isLiked ? <IconFont style={{display: 'flex',alignItems: 'center',fontSize: 18, color: "red"}} type='icon-like-fill'/> :
              <IconFont style={{display: 'flex',alignItems: 'center',fontSize: 18}} type='icon-like'/>}
            {String(likeCount)}
          </Space>,
          <Space className={iconCss} onClick={starArticle} key="list-vertical-star-o">
            {isStared ? <IconFont style={{display: 'flex',alignItems: 'center',fontSize: 18, color: "red"}} type='icon-star2'/> :
              <IconFont style={{display: 'flex',alignItems: 'center',fontSize: 18}} type='icon-star'/>}
              {String(starCount)}
          </Space>,
          <Space className={iconCss} onClick={()=>history.push(`/note/${id}?open=true`)} key="list-vertical-message">
            <IconFont style={{display: 'flex',alignItems: 'center',fontSize: 18}} type='icon-comment'/>
            {String(commentCount)}
          </Space>,
        ]}
      >
        <List.Item.Meta
          title={<>
            <a href={`/note/${id}`}>{title}</a>
            {prime ===1 && <Tag style={{float: 'right'}} icon={<StarOutlined/>} color="#FA541C">精华</Tag>}
            {type === 'user' && isTop === 1 &&
              <Tag style={{float: 'right'}} icon={<PushpinOutlined/>} color="#FA541C">置顶</Tag>}
            {type === 'user' && status === 0 &&
              <Tag style={{float: 'right'}} icon={<IconFont type="icon-caogaoxiang"/>} color="rgb(22, 119, 255)">草稿</Tag>}
          </>}
          description={
            <div>
              <div>
                <Space>
                  { type === 'user' && (
                    <>
                      <div>创建于</div>
                      <div>
                        <ClockCircleOutlined />
                        <em> {moment(new Date(createTime).toISOString()).format('YYYY-MM-DD HH:mm')}</em>
                      </div>

                      <div>更新于</div>
                      <div>
                        <ClockCircleOutlined />
                        <em> {moment(new Date(updateTime).toISOString()).format('YYYY-MM-DD HH:mm')}</em>
                      </div>
                    </>) || type === 'normal' && (
                    <>
                      <div>
                        <Avatar onClick={()=>history.push(`/user/${createdBy}`)}
                                className={avatarCss} src={author?.avatar} size="small"/>
                        <a href={`/user/${createdBy}`}> {author?.username} </a>
                      </div>

                      <div>发布于</div>
                      <div>
                        <ClockCircleOutlined />
                        <em> {moment(new Date(updateTime).toISOString()).format('YYYY-MM-DD HH:mm')}</em>
                      </div>
                    </>)
                  }
                  <div>
                    <EyeOutlined /> {viewCount}
                  </div>
                </Space>
              </div>
              {
                tags &&
                <div>
                  文章标签：
                  {tags.length > 0 ? tags.map(tag =>
                  <Tag
                    onClick={()=>history.push(`/search?type=blog&tags=${tag.name}`)}
                    className={avatarCss} key={tag.id} color={tag.color}>{tag.name}
                  </Tag>) : '无'}
                </div>
              }
            </div>
          }
        />

        <div className={listContent}>
          <div className='description'>
            <div style={{ flexGrow: 1, paddingRight: '12px'}}>
              <a href={`/note/${id}`} className={summaryCss}>{summary}</a>
            </div>
            {thumbnails && thumbnails.length > 0 &&
              <div style={{position: 'sticky', top: 0}}>
                <Image
                  preview={{ visible: false }}
                  style={{borderRadius: 8, width: 200, height: 120, objectFit: 'cover'}}
                  src={thumbnails[0]}
                  onClick={() => setVisible(true)}
                />
                <span className={countCss}>{thumbnails.length}</span>
                <div style={{ display: 'none' }}>
                  <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
                    {thumbnails.map((thumbnail, index) => <Image key={index} src={thumbnail}/>)}
                  </Image.PreviewGroup>
                </div>
              </div>
            }
          </div>

          {
            type === 'user' && currentUser?.uid === createdBy &&
            <div className='extra' style={{float: 'right'}}>
              <Button onClick={()=>{
                history.push(`/note/edit/${id}`);
              }} size='small' style={{borderRadius: '6px 0 0 6px'}} icon={<EditOutlined/>}>编辑</Button>
              <Dropdown menu={{ items, onClick }} placement="bottom">
                <Button size='small' style={{borderRadius: '0 6px 6px 0',margin: '0 16px 0 -1px'}} icon={<EllipsisOutlined />}></Button>
              </Dropdown>
            </div>
          }
        </div>
      </List.Item>

      {/*收藏Modal*/}
      {
        starModalVisible &&
        <StarModal
          articleId={id}
          visible={true}
          onCancel={()=>setStarModalVisible(false)}
          onOver={(type)=>{
            setStarModalVisible(false);
            switch (type){
              case 0: updateInfo(id, isLiked, likeCount, false, starCount - 1);break;
              case 2: updateInfo(id, isLiked, likeCount, true, starCount + 1);break;
            }
          }}
        />
      }

    </Card>
  )
}

export default Article;
