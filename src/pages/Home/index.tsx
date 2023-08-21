import {Button, Card, Col, List, Row, Skeleton, Space} from 'antd';
import React, {useEffect, useState} from 'react';
import Article from "@/pages/Note/components/Article";
import {listArticleVoByPage} from "@/services/article/api";
import {useLocation, useNavigate} from "@@/exports";
import RecommendUsers from "@/pages/Home/components/RecommendUsers";
import GlobalTop from "@/pages/Home/components/GlobalTop";
import {IconFont} from "@/utils";
import Hots from "@/pages/Home/components/Hots";
import './index.less'

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const [type, setType] = useState(()=>{
    return urlSearchParams.get('type') || 'latest';
  });
  const [pageNum, setPageNum] = useState(()=> {
    return Number(urlSearchParams.get('pageNum')) || 1;
  });
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article.Article[]>([])
  const [total, setTotal] = useState(0);

  //监听路径参数变化，拿到路径上的参数进行请求，然后向后端发起请求
  useEffect(()=>{
    let params: Article.ArticleQuery = {};
    const pageNum = Number(urlSearchParams.get('pageNum')) || 1;
    switch (urlSearchParams.get('type') || 'latest'){
      case 'latest': params = {
        pageNum,
        sortField: 'update_time',
      };break;
      case 'score': params = {
        pageNum,
        sortField: 'score',
      };break;
      case 'prime': params = {
        pageNum,
        sortField: 'update_time',
        prime: true
      };break;
    }

    //分页获取文章
    listArticleVoByPage(params).then(res => {
      if(res.code === 200){
        setLoading(false);
        setArticles(res.data.records);
        setTotal(res.data.total);
      }
    })
  }, [location.search])


  const changeChoice = (newType: string) => {
    setPageNum(1);
    setType(newType);
    setLoading(true);
    navigate({
      search: `?${new URLSearchParams({type: newType, pageNum: '1'}).toString()}`
    });
  }

  return (
    <Row style={{width: 1180, margin: '0 auto'}}>
      <Col span={17} style={{paddingRight: 8}}>
        <Card bodyStyle={{padding: '12px 20px'}} style={{marginBottom: 8}}>
          <Space>
            <Button
              size='small'
              onClick={()=>changeChoice('latest')}
              type={type === 'latest' ? 'primary' : 'default'}
            >
              最新
            </Button>
            <Button
              size='small'
              onClick={()=>changeChoice('score')}
              type={type === 'score' ? 'primary' : 'default'}
            >
              <span><IconFont style={{fontSize: 16}} type='icon-huo-copy-copy'/> 热门</span>
            </Button>
            <Button
              size='small'
              onClick={()=>changeChoice('prime')}
              type={type === 'prime' ? 'primary' : 'default'}
            >
              <span><IconFont style={{fontSize: 16}} type='icon-zuanshix'/> 精华</span>
            </Button>
          </Space>
        </Card>
        <GlobalTop/>

        {
          loading ?
          <>
            <Card style={{marginBottom: 8}}>
              <Skeleton avatar paragraph={{ rows: 4 }} />
            </Card>
            <Card style={{marginBottom: 8}}>
              <Skeleton avatar paragraph={{ rows: 4 }} />
            </Card>
            <Card style={{marginBottom: 8}}>
              <Skeleton avatar paragraph={{ rows: 4 }} />
            </Card>
          </> :
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              current: Number(urlSearchParams.get('pageNum')) || 1,
              onChange: (page) => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
                setLoading(true);
                setPageNum(page);
                navigate({
                  search: `?${new URLSearchParams({type, pageNum: page.toString()}).toString()}`
                })
              },
              showSizeChanger: false,
              showQuickJumper: true,
              pageSize: 10,
              total
            }}
            dataSource={articles}
            renderItem={(article) => (
              <Article
                data={{...article}} type='normal'
                updateInfo={(id, isLiked, likeCount, isStared, starCount)=>{
                  setArticles(articles.map(tmp => tmp.id === id ? {...tmp, isLiked, likeCount, isStared, starCount} : tmp));
                }
              }/>
            )}
          />
        }
      </Col>
      <Col span={7}>
        <Hots/>
        <RecommendUsers/>
      </Col>
    </Row>
  );
};

export default Home;
