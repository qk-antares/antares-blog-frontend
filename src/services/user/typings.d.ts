declare namespace User {
  type LoginParams = {
    account: string;//用户的邮箱或手机号
    password: string;
  };

  type RegisterParams = {
    password: string;
    email: string;
    captcha: string;
  }

  type PhoneLoginParams = {
    phone: string;
    captcha: string;
  }

  type PhoneCaptchaParams = {
    phone: string;
  };

  type EmailCaptchaParams = {
    email: string;
  };

  type UpdateBasicParams = {
    uid: number,
    username: string,
    signature: string,
    avatar: string,
    tags: (number|undefined)[]
  }

  type UpdatePwdParams = {
    originalPwd: string;
    newPwd: string;
  }

  type BindPhoneParams = {
    phone: string;
    captcha: string;
  }

  type BindEmailParams = {
    email: string;
    captcha: string;
  }

  type UserInfo = {
    uid: number;
    username: string;
    userRole: string;
    tags: User.UserTag[];
    signature: string;
    email: string;
    phone: string;
    sex: number;
    avatar: string;
    follow: number;
    fans: number;
    topic: number;
    isFollow: boolean;
  };

  type Follow = {
    uid: number;
    username: string;
    avatar: string;
    unread: number;
  }

  type RecommendUser = {
    userInfo: UserInfo;
    score: number;
  }

  type UserTagAddRequest = {
    parentId: number;
    name: string;
  }

  type UserTag = {
    id: number;
    parentId: number;
    name: string;
    color: string;
  }

  type UserTagCategory = {
    id: number;
    name: string;
    tags: UserTag[];
  }

  type UsernameAndAvatar = {
    uid: number;
    username: string;
    avatar: string;
  }
}
