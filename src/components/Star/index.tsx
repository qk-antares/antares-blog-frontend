import {Avatar, Divider, List, Popover, Skeleton, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import {StarOutlined} from "@ant-design/icons";
import Article from "@/pages/Note/components/Article";
import InfiniteScroll from "react-infinite-scroll-component";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import './index.less'
import {history} from "@@/core/history";
import {getArticlesInStarBook, getStarBooks} from "@/services/star/api";
import {StringUtils} from "@/utils";
import {useModel} from "@@/exports";

const Star: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [starBooksLoaded, setStarBooksLoaded] = useState(false);
  const [starBooks, setStarBooks] = useState<Star.StarBookBool[]>([]);
  const [active, setActive] = useState<string>('');
  const [starArticles, setStarArticles] = useState<Article.Article[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [articlesLoaded, setArticlesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = (pageNum: number)=>{
    setLoading(true);
    const params: Star.StarBookQuery = {
      bookId: Number(active),
      pageNum: pageNum,
      pageSize: 10
    }
    //分页获取某个收藏夹下的文章
    getArticlesInStarBook(params).then(res => {
      if(res.code === 200){
        if(pageNum === 1){
          setStarArticles(res.data.records);
        } else {
          setStarArticles([...starArticles, ...res.data.records]);
        }
        setTotal(res.data.total);
        setArticlesLoaded(true);
        setLoading(false);
        setPageNum(pageNum + 1);
      }
    })
  }

  const loadMoreData = () => {
    if (loading) {return;}
    loadData(pageNum);
  };

  //重置pageNum和articleLoaded状态，并加载第一页
  useEffect(()=>{
    if(StringUtils.isNotEmpty(active)){
      setPageNum(1);
      setArticlesLoaded(false);
      loadData(1);
    }
  }, [active]);

  //打开加载收藏夹
  const handleOpen = (open: boolean)=> {
    if(open && !starBooksLoaded) {
      getStarBooks(-1).then(res => {
        if(res.code === 200){
          setStarBooks(res.data);
          if(res.data.length > 0){
            setActive(res.data[0].id.toString());
          }
          setStarBooksLoaded(true);
        }
      })
    }
  }

  const titleCss = useEmotionCss(() => {
    return {
      color: "rgba(0, 0, 0, 0.88)",
      fontSize: 13.5,
      fontWeight: 'bold',
      ':hover': {
        color: '#FA541C',
        cursor: 'pointer',
        transition: 'color 0.3s'
      }
    }
  })

  const listItemCss = useEmotionCss(() => {
    return {
      ':hover': {
        background: '#F8F9FA',
        cursor: 'pointer'
      }
    }
  })

  const starCss = useEmotionCss(()=>{
    return {
      width: 500,
      maxHeight: 480,
      overflow: 'scroll',
      '.ant-tabs-left >.ant-tabs-content-holder >.ant-tabs-content>.ant-tabs-tabpane, .ant-tabs-left >div>.ant-tabs-content-holder >.ant-tabs-content>.ant-tabs-tabpane': {
        paddingLeft: 0,
      }
    }
  })

  return (
    <Popover
      // open={true}
      overlayInnerStyle={{padding: 0}}
      onOpenChange={handleOpen}
      placement="bottomRight"
      title={<div style={{padding: '8px 0 0 16px'}}>收藏夹</div>}
      content={
        <div id="scrollableDiv" className={starCss}>
          <Divider style={{margin: 0}}/>
          {
            //没登录
            !currentUser &&
            <div style={{width: '100%', height: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{backgroundImage: 'url(/images/login.png)',
                backgroundSize: '300px 300px',
                marginBottom: 32,
                width: 300,
                height: 300}}>
              </div>
            </div>
          }
          {
            currentUser && starBooksLoaded && starBooks.length > 0 &&
            <Tabs
              tabBarStyle={{paddingLeft: 0}}
              tabPosition='left'
              activeKey={active}
              onChange={(key)=>setActive(key)}
              items={starBooks.map(starBook => {
                return {
                  label: starBook.name,
                  key: starBook.id.toString(),
                  children: <div style={{maxHeight: 480, overflow: 'scroll'}}>{
                    articlesLoaded ?
                    <InfiniteScroll
                      dataLength={starArticles.length}
                      next={loadMoreData}
                      hasMore={starArticles.length < total}
                      loader={<Skeleton style={{padding: '8px 16px'}} avatar paragraph={{ rows: 1 }} active />}
                      scrollableTarget="scrollableDiv"
                    >
                      <List
                        dataSource={starArticles}
                        renderItem={article => (
                          <List.Item style={{padding: '8px 16px'}} className={listItemCss} key={article.id}>
                            <List.Item.Meta
                              avatar={<Avatar
                                onClick={()=>history.push(`/user/${article.author.uid}`)}
                                src={article.author.avatar}
                              />}
                              description={<>
                                <div style={{margin: '4px 0 6px 0'}}>
                                  <a className={titleCss} href={`/note/${article.id}`}>{article.title}</a>
                                </div>
                                <div onClick={()=>history.push(`/note/${article.id}`)} className='text-box'>
                                  {article.summary}
                                </div>
                              </>}
                            />
                          </List.Item>
                        )}
                      />
                    </InfiniteScroll> :
                    <List
                      itemLayout="horizontal"
                      dataSource={new Array(5).fill(0)}
                      renderItem={()=><List.Item style={{padding: '8px 16px'}}>
                        <Skeleton active avatar paragraph={{ rows: 1 }} />
                      </List.Item>}
                    />
                  }</div>
                }})
              }
            />
          }
          {
            currentUser && starBooksLoaded && starBooks.length === 0 &&
            <div style={{width: '100%', height: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{backgroundImage: 'url(./not_found.png)',
                backgroundSize: '402px 402px',
                marginBottom: 32,
                width: 402,
                height: 402}}>
              </div>
              <div style={{color:' #8896b8', fontSize: 14, lineHeight: '1.5em'}}>
                你还没有创建收藏夹
              </div>
            </div>
          }
          {
            currentUser && !starBooksLoaded && <Skeleton/>
          }
        </div>
      }
      arrow={{pointAtCenter: true}}
    >
      <a onClick={e => e.preventDefault()}>
          <StarOutlined style={{fontSize: 20,color: '#FA541C',marginTop: 18}}/>
      </a>
    </Popover>
  );
};
export default Star;
