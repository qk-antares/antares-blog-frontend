import {List} from 'antd';
import React, {useEffect, useState} from 'react';
import Article from "@/pages/Note/components/Article";
import {getArticlesByUid} from "@/services/article/api";

export type UserArticleCardProps = {
  uid: number;
  selectType: number;
}

const UserArticleCard: React.FC<UserArticleCardProps> = ({uid, selectType}) => {
  const [articles, setArticles] = useState<Article.Article[]>([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 3;
  const [total, setTotal] = useState(0);

  const fetchUserArticles = async (page: number) => {
    const res = await getArticlesByUid({uid, selectType, pageNum: page, pageSize});
    if(res.code === 200){
      setArticles(res.data.records);
      setTotal(res.data.total);
      setLoading(false);
    }
    return res;
  }

  //监听selectType
  useEffect(() => {
    fetchUserArticles(1);
  }, [selectType]);

  return (
    <List
      itemLayout="vertical"
      size="large"
      loading={loading}
      pagination={{
        onChange: (page) => {
          setLoading(true);
          fetchUserArticles(page);
        },
        pageSize,
        total
      }}
      dataSource={articles}
      renderItem={(article) => (
        <Article
          data={{...article}} type='user'
          updateInfo={(id, isLiked, likeCount, isStared, starCount)=>{
            setArticles(articles.map(tmp => tmp.id === article.id ? {...tmp, isLiked, likeCount, isStared, starCount} : tmp));
          }
          }/>

        // <Article data={{...article}} type='user'/>
      )}
    />
  );
};

export default UserArticleCard;
