import {Avatar, Divider, List, message, Popover, Skeleton} from 'antd';
import React, {useState} from 'react';
import {AppstoreOutlined} from "@ant-design/icons";
import Article from "@/pages/Note/components/Article";
import {getUpdates} from "@/services/article/api";
import InfiniteScroll from "react-infinite-scroll-component";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import './index.less'
import {history} from "@@/core/history";
import {useModel} from "@@/exports";

const Trend: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [loaded, setLoaded] = useState(false);
  const [updates, setUpdates] =  useState<Article.Article[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const loadData = (pageNum: number)=>{
    setLoading(true);
    const params: Article.ArticleQuery = {uid: -1, pageNum};
    getUpdates(params).then(res => {
      if(res.code === 200){
        if(res.data){
          setUpdates([...updates, ...res.data.records]);
          setTotal(res.data.total);
        } else {
          message.info('您未关注任何用户！');
        }
        setLoading(false);
        setLoaded(true);
      }
    })
  }

  const loadMoreData = () => {
    if (loading) {return;}
    loadData(pageNum);
    setPageNum(pageNum + 1);
  };

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

  return (
    <Popover
      overlayInnerStyle={{padding: 0}}
      onOpenChange={(open)=>{
        if(currentUser && open && !loaded) {
          loadData(pageNum);
          setPageNum(pageNum + 1);
        }
      }}
      placement="bottomRight"
      title={<div style={{padding: '8px 0 0 16px'}}>动态</div>}
      content={
        <div id="scrollableDiv" style={{width: 400, maxHeight: 480, overflow: 'scroll'}}>
          <Divider style={{margin: 0}}/>
          {
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
            currentUser && loaded &&
            <InfiniteScroll
              dataLength={updates.length}
              next={loadMoreData}
              hasMore={updates.length < total}
              loader={<Skeleton style={{padding: '8px 16px'}} avatar paragraph={{ rows: 1 }} active />}
              endMessage={<Divider plain>没有更多了~</Divider>}
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={updates}
                renderItem={(update) => (
                  <List.Item style={{padding: '8px 16px'}} className={listItemCss} key={update.id}>
                    <List.Item.Meta
                      avatar={<Avatar
                        onClick={()=>history.push(`/user/${update.author.uid}`)}
                        src={update.author.avatar}
                      />}
                      description={<>
                        <div style={{margin: '4px 0 6px 0'}}>
                          <a className={titleCss} href={`/note/${update.id}`}>{update.title}</a>
                        </div>
                        <div onClick={()=>history.push(`/note/${update.id}`)} className='text-box'>
                          {update.summary}
                        </div>
                      </>}
                    />
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          }
          {
            currentUser && !loaded &&
            <List
              itemLayout="horizontal"
              dataSource={new Array(5).fill(0)}
              renderItem={()=><List.Item style={{padding: '8px 16px'}}>
                <Skeleton active avatar paragraph={{ rows: 1 }} />
              </List.Item>}
            />
          }
        </div>
      }
      arrow={{pointAtCenter: true}}
    >
      <a onClick={e => e.preventDefault()}>
        <AppstoreOutlined style={{fontSize: 20, color: '#FA541C'}}/>
      </a>
    </Popover>
  );
};
export default Trend;
