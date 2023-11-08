import {Avatar, Dropdown, MenuProps, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";
import {useModel} from "@@/exports";
import {outLogin} from "@/services/user/api";

const UserAvatar: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [items, setItems] = useState<MenuProps['items']>([]);

  useEffect(()=>{
    if(currentUser){
      setItems([
        {
          key: '0',
          label: <a href={`/user/${currentUser.uid}`}>个人中心</a>,
          icon: <UserOutlined />,
        },
        {
          label: <a href="/user/settings">帐号设置</a>,
          key: '1',
          icon: <SettingOutlined />,
        },
        {
          type: 'divider',
        },
        {
          label: '退出',
          key: '3',
          icon: <LogoutOutlined />
        },
      ]);
    }else{
      setItems([
        {
          key: '0',
          label: <a href="/user/login">登录</a>,
          icon: <UserOutlined />,
        },
        {
          label: <a href="/user/register">注册</a>,
          key: '1',
          icon: <SettingOutlined />,
        },
      ]);
    }
  }, [currentUser])

  const onClick: MenuProps['onClick'] = async ({key}) => {
    //如果点击的是退出，则要请求退出
    if (key === '3') {
      const res = await outLogin();
      if(res.code === 200){
        message.success('退出成功');
        history.push('/note');
        location.reload();
      }
    }
  };

  return (
    <Dropdown menu={{ items, onClick }} placement="bottom">
      <a onClick={e => e.preventDefault()}>
        <Avatar
          src={<img src={currentUser?.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}/>}
          style={{verticalAlign: 'top', marginTop: 12}}
        />
      </a>
    </Dropdown>
  );
};
export default UserAvatar;
