import Footer from '@/components/Footer';
import {LockOutlined, MobileOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Helmet, history, useModel} from '@umijs/max';
import {Alert, message, Tabs} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import {login, loginByPhone} from "@/services/user/api";
import {IconFont} from "@/utils";
import {GITEE_OAUTH_URL} from "@/utils/constants";

export const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.R>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const goAuth = async () => {
    history.push(GITEE_OAUTH_URL);
  }

  const ActionIcons = () => {
    const langClassName = useEmotionCss(() => {
      return {
        marginLeft: '8px',
        fontSize: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
      };
    });
    return (
      <>
        <IconFont onClick={goAuth} type="icon-gitee" className={langClassName}/>
        <a onClick={()=>{
          //路径跳转（如果没有redirect参数，则跳转到根目录）
          const urlParams = new URL(window.location.href).searchParams;
          const redirect = urlParams.get('redirect');
          if(redirect){
              history.push(`/user/register?redirect=${redirect}`)
          } else {
            history.push('/user/register');
          }
        }} style={{float: 'right', color: '#1677ff', cursor: 'pointer'}}>
          立即注册
        </a>
      </>
    );
  };

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const handleSubmit = async (values: User.LoginParams | User.PhoneLoginParams) => {
    try {
      let res:API.R = {};
      // 帐号密码登录
      if(type === 'account'){
        res = await login(values as User.LoginParams);
      } else if (type === 'mobile'){
        res = await loginByPhone(values as User.PhoneLoginParams);
      }
      if(res.code){
        if(res.code === 200){
          message.success('登录成功！');
          await fetchUserInfo();

          //路径跳转（如果没有redirect参数，则跳转到根目录）
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/');
          return;
        } else {
          setUserLoginState(res);
        }
      }
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };
  const { msg } = userLoginState;
  return (
    <div className={containerClassName}>
      <Helmet>
        <title>{'登录'}- {Settings.title}</title>
      </Helmet>
      <div style={{flex: '1', padding: '32px 0',}}>
        <LoginForm
          contentStyle={{minWidth: 280, maxWidth: '75vw',}}
          logo={<img alt="logo" src="/logo.svg" />}
          title="流火开发社区" subTitle={' '}
          initialValues={{autoLogin: true,}}
          actions={['其他登录方式 :', <ActionIcons key="icons" />]}
          onFinish={async (values) => {
            await handleSubmit(values as User.LoginParams);
          }}

        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
              {
                key: 'mobile',
                label: '手机号登录',
              },
            ]}
          />

          {msg && (<LoginMessage content={msg} />)}

          {type === 'account' && (
            <>
              <ProFormText
                name="account"
                fieldProps={{size: 'large', prefix: <UserOutlined />,}}
                placeholder={'邮箱或手机号'}
                rules={[
                  {
                    required: true,
                    message: '帐号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{size: 'large', prefix: <LockOutlined />,}}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}

          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="phone"
                placeholder={'请输入手机号'}
                rules={[
                  {
                    required: true,
                    message: '手机号是必填项！',
                  },
                  {
                    pattern: /^1[3|4|5|7|8][0-9]{9}/,
                    message: '不合法的手机号！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{size: 'large',}}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'秒后重新获取'}`;
                  }
                  return '获取验证码';
                }}
                name="captcha"
                phoneName="phone"
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！',
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  message.error('为防止接口被刷，验证码登录已关闭！');
                  return;
                  // if(StringUtils.isPhone(phone)) {
                  //   //首先获取手机号的校验状态，成功了才发送验证码
                  //   const res = await getPhoneCaptcha({phone});
                  //   if (res.code === 200) {
                  //     message.success('获取验证码成功！验证码为：' + res.data);
                  //     return;
                  //   }
                  // }
                  // throw new Error("获取验证码错误")
                }}
              />
            </>
          )}
          <div style={{marginBottom: 24}}>
            <ProFormCheckbox noStyle>
              自动登录
            </ProFormCheckbox>
            <a onClick={()=>{message.info('功能待完善')}} style={{float: 'right',}}>忘记密码 ?</a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
