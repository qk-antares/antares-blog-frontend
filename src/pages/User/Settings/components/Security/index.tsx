import React, {useEffect, useState} from 'react';
import {List, message} from 'antd';
import PhoneModal from "@/pages/User/Settings/components/Security/components/PhoneModal";
import EmailModal from "@/pages/User/Settings/components/Security/components/EmailModal";
import {useModel} from "@@/exports";
import PasswordModal from "@/pages/User/Settings/components/Security/components/PasswordModal";
import passwordModal from "@/pages/User/Settings/components/Security/components/PasswordModal";

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: <span className="strong">强</span>,
  medium: <span className="medium">中</span>,
  weak: <span className="weak">弱 Weak</span>,
};

const SecurityView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [currentUser, setCurrentUser] = useState(initialState?.currentUser);

  const [passwordModal, setPasswordModal] = useState(false);
  const [phoneModal, setPhoneModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);

  const [showPhone, setShowPhone] = useState(()=>{
    if(!currentUser?.phone){
      return '暂未绑定手机';
    }
    return `已绑定手机：${currentUser.phone.substring(0,3)}****${currentUser.phone.substring(7,11)}`;
  });

  const [showEmail, setShowEmail] = useState(()=>{
    if(!currentUser?.email){
      return '暂未绑定邮箱';
    }
    let index = currentUser.email.indexOf('@');
    if(index <= 6) return currentUser.email;
    return `已绑定邮箱：${currentUser.email.substring(0,3)}***${currentUser.email.substring(index-3)}`;
  });

  useEffect(()=>{
    if(!currentUser?.phone){
      setShowPhone('暂未绑定手机');
    } else {
      setShowPhone(`已绑定手机：${currentUser.phone.substring(0,3)}****${currentUser.phone.substring(7,11)}`);
    }
    if(!currentUser?.email){
      setShowEmail('暂未绑定邮箱');
    } else {
      let index = currentUser.email.indexOf('@');
      if(index <= 6){
        setShowEmail(currentUser.email)
      }else {
        setShowEmail(`已绑定邮箱：${currentUser.email.substring(0,3)}***${currentUser.email.substring(index-3)}`);
      }
    }
  }, [currentUser])


  const getData = () => [
    {
      title: '帐号密码',
      description: (
        <>
          当前密码强度：
          {passwordStrength.strong}
        </>
      ),
      actions: [<a key="Modify" onClick={()=>{
        setPasswordModal(true);}}>
        修改</a>],
    },
    {
      title: '绑定手机',
      description: showPhone,
      actions: [<a key="Modify" onClick={()=>{
        setPhoneModal(true);}}>
        {currentUser?.phone ? '修改' : '绑定'}</a>],
    },
    {
      title: '绑定邮箱',
      description: showEmail,
      actions: [<a key="Modify" onClick={()=>{
        setEmailModal(true);}}>
        {currentUser?.email ? '修改' : '绑定'}</a>],
    },
  ];

  const data = getData();

  return (
    <>
      {
        currentUser &&
        <>
          <List<Unpacked<typeof data>>
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item actions={item.actions}>
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />

          <PhoneModal
            visible={phoneModal}
            onCancel={()=>setPhoneModal(false)}
            onOk={(newPhone)=>{setCurrentUser({...currentUser, phone: newPhone})}}/>
          <EmailModal
            visible={emailModal}
            onCancel={()=>setEmailModal(false)}
            onOk={(newEmail)=>{setCurrentUser({...currentUser, email: newEmail})}}
          />
          <PasswordModal
            visible={passwordModal}
            onCancel={()=>setPasswordModal(false)}
          />
        </>
      }
    </>
  );
};

export default SecurityView;
