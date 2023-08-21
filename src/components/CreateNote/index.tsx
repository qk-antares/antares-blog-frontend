import {Dropdown, MenuProps, message} from 'antd';
import React from 'react';
import {FileTextOutlined, PlusCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {history, useModel} from "@@/exports";

const CreateNote: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={()=>{
          if(currentUser){
            history.push("/note/create");
          } else {
            message.info('请先登录')
          }
        }}>
          写笔记
        </a>
      ),
      icon: <FileTextOutlined />,
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={()=>message.info('功能待完善')}>
          去提问
        </a>
      ),
      icon: <QuestionCircleOutlined />,
    },
  ];

  return (
    <Dropdown menu={{items}} placement="bottom">
      <a onClick={e => e.preventDefault()}>
          <PlusCircleOutlined style={{fontSize: 20,color: '#FA541C',marginTop: 18}}/>
      </a>
    </Dropdown>
  );
};
export default CreateNote;
