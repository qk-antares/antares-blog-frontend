import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history} from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {requestConfig} from './requestConfig';
import React from 'react';
import {getCurrentUser} from "@/services/user/api";
import {message} from "antd";

//这里应该设置一个黑名单，黑名单里的必须登录
const blackList: string[] = [
  '/user/settings',
  '/note/create',
  '/note/edit/*',
  '/note/settings/*',
  '/notification',
  '/updates'
]

const loginPath = '/user/login';
const registerPath = '/user/register';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: User.UserInfo;
  loading?: boolean;
  fetchUserInfo?: () => Promise<User.UserInfo | undefined>;
}> {
  //获取用户信息，这是一个异步请求(只是一个方法，不会真正执行)
  const fetchUserInfo = async () => {
    try {
      const res = await getCurrentUser();
      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const curPath = history.location.pathname;
  //只要不是登录或注册页，就要去拉取用户信息（但是为空这里也不跳转）
  if(curPath !== loginPath && curPath !== registerPath){
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  // 如果是登录页或注册页，只返回获取用户信息的方法
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 必须要求登录的页面没有登录，重定向到 login
      const flag = blackList.some((item) => {
        const regex = new RegExp('^' + item.replace('*', '.*') + '$');
        return regex.test(history.location.pathname)
      })

      if (!initialState?.currentUser && flag) {
        message.error('未登录！');
        history.push(loginPath);
      }
    },

    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/*<SettingDrawer*/}
          {/*  disableUrlParams*/}
          {/*  enableDarkTheme*/}
          {/*  settings={initialState?.settings}*/}
          {/*  onSettingChange={(settings) => {*/}
          {/*    setInitialState((preInitialState) => ({*/}
          {/*      ...preInitialState,*/}
          {/*      settings,*/}
          {/*    }));*/}
          {/*  }}*/}
          {/*/>*/}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...requestConfig,
};
