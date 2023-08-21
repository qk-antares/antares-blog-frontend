import {Card, List} from 'antd';
import React, {useEffect, useState} from 'react';
import UserCard from "@/pages/Home/components/UserCard";
import {getFansByUid} from "@/services/user/api";

const Fans: React.FC<{uid: number}> = ({uid}) => {
  const [loading, setLoading] = useState(true);
  const [fans, setFans] = useState<User.UserInfo[]>([]);

  useEffect(()=>{
    getFansByUid(uid).then(res => {
      if(res.code === 200){
        setFans(res.data);
        setLoading(false);
      }
    })
  }, []);

  return (<>
    <List
      loading={loading}
      grid={{ gutter: 16, column: 2 }}
      itemLayout="vertical"
      size="large"
      dataSource={fans}
      renderItem={user =>
        <Card hoverable style={{margin: '0 8px 8px 0'}}>
          <UserCard data={user} afterFollow={user =>
            setFans(fans.map(result =>
              result.uid === user.uid ? {
                ...result,
                fans: result.isFollow ? result.fans - 1 : result.fans + 1,
                isFollow: !result.isFollow,
              } : result))}
          />
        </Card>
      }
    />
  </>)
}

export default Fans;
