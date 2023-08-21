import {Card, List, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {getGlobalTop} from "@/services/article/api";
import {history} from "@@/core/history";

const GlobalTop: React.FC = () => {
  const [globalTops, setGlobalTops] = useState<Article.Article[]>([]);
  const [topsLoading, setTopsLoading] = useState(true);

  useEffect(()=>{
    //获取全局置顶文章
    getGlobalTop().then(res => {
      if(res.code === 200){
        setGlobalTops(res.data);
        setTopsLoading(false);
      }
    })
  }, [])

  const listItemCss = useEmotionCss(() => {
    return {
      ':hover': {
        background: '#F8F9FA',
        cursor: 'pointer'
      }
    }
  })

  return (
    <Card bodyStyle={{padding: '5px 0'}} style={{marginBottom: 8}}>
      <List
        loading={topsLoading}
        dataSource={globalTops}
        renderItem={(article) => (
          <List.Item style={{padding: '10px 20px'}} className={listItemCss}
                     onClick={()=>history.push(`/note/${article.id}`)}>
            <div style={{display: 'flex',width: '100%'}}>
              <Tag color="volcano" style={{color: '#FA541C'}}>置顶</Tag>
              <span style={{fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: "#2f3034"}}>
                <b>{article.title}</b> {article.summary}
              </span>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default GlobalTop;
