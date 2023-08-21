import {Card, List} from 'antd';
import React, {useEffect, useState} from 'react';
import UserCard from "@/pages/Home/components/UserCard";
import {getFollowsByUid} from "@/services/user/api";

const Follows: React.FC<{uid: number}> = ({uid}) => {
  const [loading, setLoading] = useState(true);
  const [follows, setFollows] = useState<User.UserInfo[]>([]);

  useEffect(()=>{
    getFollowsByUid(uid).then(res => {
      if(res.code === 200){
        setFollows(res.data);
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
      dataSource={follows}
      renderItem={user =>
        <Card hoverable style={{margin: '0 8px 8px 0'}}>
          <UserCard data={user} afterFollow={user =>
            setFollows(follows.map(result =>
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

export default Follows;
