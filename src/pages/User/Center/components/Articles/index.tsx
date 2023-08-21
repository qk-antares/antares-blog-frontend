import React, {useState} from 'react';
import {Card, Col, Row} from "antd";
import UserArticleCard from "@/pages/Note/components/UserArticleCard";
import {useModel} from "@@/exports";
import {useEmotionCss} from "@ant-design/use-emotion-css";

type ArticlesProps = {
  targetUser: User.UserInfo;
}

const Articles: React.FC<ArticlesProps> = ({targetUser}) => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  //用户要查看的是全部？已发布？草稿？
  const [selectType, setSelectType] = useState(1);
  const linkCss = [1,2,3].map(selected => {
    return useEmotionCss(()=>{
      if(selectType === selected){
        return {
          color: '#FA541C',
          ':hover': {
            color: '#FA541C'
          }
        }
      } else {
        return {
          color: 'rgb(34,34,34)'
        }
      }
    })
  });

  return (
      <div>
        {
          currentUser?.uid === targetUser.uid &&
          <Card bodyStyle={{padding: '4px 16px 4px 16px', backgroundColor: 'rgb(255,241,240)'}}>
            <Row>
              <Col span={4}>
                <a className={linkCss[0]} onClick={()=>setSelectType(1)}>全部</a>
              </Col>
              <Col span={4}>
                <a className={linkCss[1]} onClick={()=>setSelectType(2)}>已发布</a>
              </Col>
              <Col span={4}>
                <a className={linkCss[2]} onClick={()=>setSelectType(3)}>草稿</a>
              </Col>
              <Col span={4}>
              </Col>
            </Row>
          </Card>
        }

        <UserArticleCard selectType={selectType} uid={targetUser.uid}></UserArticleCard>
      </div>
  );
};

export default Articles;
