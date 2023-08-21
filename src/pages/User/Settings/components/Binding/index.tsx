import { AlipayOutlined, DingdingOutlined, TaobaoOutlined } from '@ant-design/icons';
import {List, message} from 'antd';
import React, { Fragment } from 'react';
import {IconFont} from "@/utils";

const BindingView: React.FC = () => {
  const getData = () => [
    {
      title: '绑定码云',
      description: '当前未绑定码云账号',
      actions: [<a onClick={()=>message.info('功能待完善')} key="Bind">绑定</a>],
      avatar: <IconFont style={{fontSize: 36}} type='icon-gitee'/>,
    },
  ];

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              description={<>
                <div style={{fontWeight: 800, color: 'black'}}>{item.title}</div>
                <div>{item.description}</div>
              </>}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default BindingView;
