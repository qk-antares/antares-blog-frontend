import {message, Popover, Space} from 'antd';
import React from 'react';
import { ClockCircleOutlined} from "@ant-design/icons";

const text = <span>浏览历史</span>;
const content = (
  <div style={{width: '100%', height: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{backgroundImage: 'url(/images/login.png)',
      backgroundSize: '300px 300px',
      marginBottom: 32,
      width: 300,
      height: 300}}>
    </div>
  </div>
);


const History: React.FC = () => {
  return (
    <Popover
      onOpenChange={(open)=>{
        if(open){
          message.info('浏览历史功能待完善！')
        }}
      }
      placement="bottomRight"
      title={text}
      content={content}
      arrow={{pointAtCenter: true}}
    >
      <a onClick={e => e.preventDefault()}>
        <Space>
          <ClockCircleOutlined style={{fontSize: 20,color: '#FA541C',marginTop: 18}}/>
        </Space>
      </a>
    </Popover>
  );
};
export default History;
