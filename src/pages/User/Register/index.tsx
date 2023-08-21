import Footer from '@/components/Footer';
import {CaretRightOutlined, LockOutlined, MailOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Helmet} from '@umijs/max';
import {message, Popover, Progress} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useEffect, useRef, useState} from 'react';
import {getEmailCaptcha, register} from "@/services/user/api";
import {StringUtils} from "@/utils";
import {ProFormInstance} from "@ant-design/pro-form/lib";
import {LoginMessage} from "@/pages/User/Login";
import {history} from "@@/core/history";

const passwordStatusMap = {
  ok: (
    <div>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div>
      <span>强度：太短</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Register: React.FC = () => {
  const [userRegisterState, setUserRegisterState] = useState<API.R>({});

  const [modalVisible, setModalVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;

  const formRef = useRef<
    ProFormInstance<{
      email: string;
      password: string;
      confirm: string;
      captcha: string;
    }>
  >();

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const getPasswordStatus = () => {
    const value = formRef.current?.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== formRef.current?.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setModalVisible(!!value);
      return promise.reject('请输入密码!');
    }
    // 有值的情况
    if (!modalVisible) {
      setModalVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('密码至少为6个字符！');
    }
    if (value && confirmDirty) {
      formRef.current?.validateFields(['confirm']);
    }
    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = formRef.current?.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
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

  const handleSubmit = async (values: User.RegisterParams) => {
    formRef.current?.validateFieldsReturnFormatValue?.().then(async (values) => {
      const res = await register(values);
      if(res.code === 200){
        message.success('注册成功！');
        history.push('/user/login');
        return;
      }
      setUserRegisterState(res);
    });
  };

  const { msg } = userRegisterState;

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>{'注册'}- {Settings.title}</title>
      </Helmet>

      <div style={{flex: '1', padding: '32px 0',}}>
        <LoginForm<{
            email: string;
            password: string;
            confirm: string;
            captcha: string;
          }>
          formRef={formRef}
          contentStyle={{minWidth: 280, maxWidth: '75vw',}}
          logo={<img alt="logo" src="/logo.svg" />}
          title="流火开发社区" subTitle={' '}
          submitter={{ searchConfig: {submitText: '注册', resetText: '使用已有帐号登录'}}}
          onFinish={async (values) => {
            await handleSubmit(values as User.RegisterParams);
          }}
        >
          <h2>
            <span>注册</span>
            <a onClick={()=>{history.push('/user/login')}} style={{float: 'right',fontSize: 16, fontWeight: 500, marginTop: 4}}>
              使用已有帐号登录<CaretRightOutlined />
            </a>
          </h2>

          {msg && (<LoginMessage content={msg} />)}

          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <MailOutlined />,
            }}
            name="email"
            placeholder={'请输入邮箱'}
            rules={[
              {
                required: true,
                message: '邮箱是必填项！',
              },
              {
                pattern: /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/,
                message: '不合法的邮箱地址！',
              },
            ]}
          />

          <Popover
            getPopupContainer={(node) => {
              if (node && node.parentNode) {
                return node.parentNode as HTMLElement;
              }
              return node;
            }}
            content={
              modalVisible && (
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                  </div>
                </div>
              )
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            open={modalVisible}
          >
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码至少6个字符'}
              rules={[{validator: checkPassword}]}
              required={true}
            />
          </Popover>

          <ProFormText.Password
            name="confirm"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'确认密码'}
            rules={[{validator: checkConfirm}]}
            required={true}
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
            phoneName="email"
            rules={[
              {
                required: true,
                message: '验证码是必填项！',
              },
            ]}
            onGetCaptcha={async (email) => {
              if(StringUtils.isEmail(email)) {
                //首先获取手机号的校验状态，成功了才发送验证码
                const res = await getEmailCaptcha({email});
                if(res.code === 200){
                  message.success('验证码已发送！');
                  return;
                }
              }
              throw new Error("获取验证码错误")
            }}
          />
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
