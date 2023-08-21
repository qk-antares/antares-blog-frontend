import type {FC} from 'react';
import React, {useEffect, useState} from 'react';
import {Form, Input, message, Modal, Popover, Progress} from 'antd';
import type {Store} from 'antd/es/form/interface';
import {Divider} from "antd/lib";
import {updatePwd} from "@/services/user/api";

type PasswordModalProps = {
  visible: boolean;
  onCancel: ()=>void;
}

const FormItem = Form.Item;

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

const PasswordModal: FC<PasswordModalProps> = ({visible, onCancel}) => {
  const [modalVisible, setModalVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const onFinish = (values: Store) => {
    console.log(values);
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  const checkOldPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      return promise.reject('请输入原始密码!');
    }
    //有值的情况
    if (value.length < 6) {
      return promise.reject('密码至少为6个字符！');
    }
    return promise.resolve();
  }

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
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
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

  const updatePassword = async () => {
    const oldPassword = form.getFieldValue('oldPassword');
    const password = form.getFieldValue('password');
    const confirm = form.getFieldValue('confirm');
    if (oldPassword.length >= 6 && password.length >= 6 && password === confirm) {
      const params = {
        originalPwd: oldPassword,
        newPwd: password
      }
      const res = await updatePwd(params);
      if(res.code === 200){
        message.success('修改密码成功！');
        onCancel?.();
      }
    }
  }

  return (
    <Modal open={visible} title='修改密码' centered={true} okText='提交' onCancel={()=>onCancel?.()} onOk={updatePassword}>
      <Divider/>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="oldPassword"
          label='原始密码：'
          rules={[{validator: checkOldPassword}]}
          required={true}
        >
          <Input type='password' placeholder="请输入原始密码" />
        </FormItem>
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
            <FormItem
              name="password"
              label='新密码：'
              rules={[{validator: checkPassword}]}
              required={true}
            >
              <Input type="password" placeholder="至少6位密码，区分大小写" />
            </FormItem>
          </Popover>
          <FormItem
            name="confirm"
            label='确认密码'
            rules={[{validator: checkConfirm}]}
            required={true}
          >
            <Input type="password" placeholder="确认密码" />
          </FormItem>
        </Form>
    </Modal>

  );
};
export default PasswordModal;
