import React, {useRef} from 'react';
import Step1 from "@/pages/Note/Create/components/Step1";
import {Button, Card} from "antd";
import {useParams} from "@@/exports";


const ArticleSettings: React.FC = () => {
  const params = useParams();
  const articleId = Number(params.id);
  const childRef = useRef(null);

  return (
    <Card style={{width: 980, margin: '0 auto'}}>
      <Step1 ref={childRef} articleId={articleId}/>
      <Button onClick={()=>{
        // @ts-ignore
        childRef.current?.updateSettings()
      }} type='primary' style={{float: 'right'}}>提交修改</Button>
    </Card>
  )
};

export default ArticleSettings;
