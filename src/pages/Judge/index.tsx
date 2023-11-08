import React from "react";
import {Card, Skeleton} from "antd";
import {history} from '@umijs/max';
import {JUDGE_PATH} from "@/utils/constants";

const Judge: React.FC = ()=>{
  history.push(JUDGE_PATH);

  return <Card style={{width: 1180, margin: '0 auto'}}>
    <Skeleton paragraph={{rows: 10}}/>
  </Card>
}

export default Judge
