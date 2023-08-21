import {Card, List, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {getGlobalTop, getHot} from "@/services/article/api";
import {history} from "@@/core/history";
import {IconFont} from "@/utils";

const Hots: React.FC = () => {
  const [hots, setHots] = useState<Article.Article[]>([]);
  const [hotsLoading, setHotsLoading] = useState(true);

  useEffect(()=>{
    //获取全局置顶文章
    getHot().then(res => {
      if(res.code === 200){
        setHots(res.data);
        setHotsLoading(false);
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

  const topIcons = [
    <IconFont key='1' type='icon-daochu1024-26'/>,
    <IconFont key='2' type='icon-daochu1024-27'/>,
    <IconFont key='3' type='icon-daochu1024-28'/>,
    <IconFont key='4' type='icon-4_round_solid'/>,
    <IconFont key='5' type='icon-5_round_solid'/>,
    <IconFont key='6' type='icon-6_round_solid'/>,
    <IconFont key='7' type='icon-7_round_solid'/>,
    <IconFont key='8' type='icon-8_round_solid'/>,
  ]

  return (
    <Card bodyStyle={{padding: '0 0 5px 0'}} style={{marginBottom: 8}} title='热门文章'>
      <List
        loading={hotsLoading}
        size="small"
        dataSource={hots}
        renderItem={(article, index) => <>
          <List.Item
            style={{padding: '2px 10px'}} className={listItemCss}
            onClick={()=>history.push(`/note/${article.id}`)}
          >
            <div style={{display: 'flex',width: '100%',alignItems: 'center'}}>
              <span style={{fontSize: 24,marginRight: 4}}>
                {topIcons[index]}
              </span>
              <span style={{fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: "#2f3034"}}>
                <b>{article.title}</b> {article.summary}
              </span>
            </div>
          </List.Item>
        </>}
      />
    </Card>
  );
};

export default Hots;
