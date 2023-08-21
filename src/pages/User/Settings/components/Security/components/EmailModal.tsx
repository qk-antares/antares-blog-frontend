import React, {useRef} from "react";
import {message, Modal} from "antd";
import {ProFormCaptcha, ProFormText} from "@ant-design/pro-components";
import {LockOutlined, MailOutlined} from "@ant-design/icons";
import {StringUtils} from "@/utils";
import {bindEmail, getEmailCaptcha} from "@/services/user/api";
import {Divider} from "antd/lib";
import {ProForm, ProFormInstance} from "@ant-design/pro-form/lib";
import {useModel} from "@@/exports";

type EmailModalProps = {
  visible: boolean;
  onCancel: ()=>void;
  onOk: (newEmail: string)=>void;
}

const EmailModal: React.FC<EmailModalProps> = ({visible, onCancel, onOk}) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const formRef = useRef<
    ProFormInstance<{
      email: string;
      captcha: string;
    }>
  >();

  const updateEmail = () => {
    formRef.current?.validateFieldsReturnFormatValue?.().then(async (values) => {
      const res = await bindEmail(values);
      if(res.code === 200){
        message.success('绑定成功！');
        if(initialState && initialState.currentUser){
          setInitialState({...initialState, currentUser: {...initialState.currentUser, email: values.email}});
        }
        onOk?.(values.email);
        onCancel?.();
      }
    });
  }

  return (
    <Modal open={visible} title='绑定邮箱' centered={true} okText='提交' onCancel={()=>onCancel?.()} onOk={updateEmail}>
      <Divider/>
      <ProForm<{
        email: string;
        captcha: string;
      }>
        submitter={false}
        formRef={formRef}
        autoFocusFirstInput
      >
        <ProFormText
          fieldProps={{
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
        <ProFormCaptcha
          fieldProps={{
            prefix: <LockOutlined />,
          }}
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
      </ProForm>
    </Modal>
  )
}
export default EmailModal;
