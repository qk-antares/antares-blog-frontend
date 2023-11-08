import React from 'react';
import {useModel} from "@umijs/max";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import Message from "@/components/Message";
import Trend from "@/components/Trend";
import CreateNote from "@/components/CreateNote";
import Star from "@/components/Star";
import History from "@/components/History";
import UserAvatar from "@/components/UserAvatar";
import HeaderSearch from "@/components/HeaderSearch";
import {useLocation} from "@@/exports";

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const location = useLocation();
  const pathname = location.pathname;

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      alignItems: 'center',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      padding: '0 12px',
      gap: '0px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      margin: '0px',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  if (!initialState || !initialState.settings) {
    return null;
  }

  return (
    <>
      {pathname !== '/search' && <HeaderSearch/>}
      <span className={actionClassName}>
        <UserAvatar/>
      </span>
      <span className={actionClassName}>
        <CreateNote/>
      </span>
      <span className={actionClassName}>
        <Message/>
      </span>
      <span className={actionClassName}>
        <Trend/>
      </span>
      <span className={actionClassName}>
        <Star/>
      </span>
      <span className={actionClassName} style={{marginRight: 8}}>
        <History/>
      </span>
    </>
  );
};
export default GlobalHeaderRight;

