import {request} from "@@/exports";

/** 获取当前的用户 GET */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<{
    data: User.UserInfo;
  }>('/member/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 根据UID获取用户 GET */
export async function getUserByUid(uid: number, options?: { [key: string]: any }) {
  return request<API.R>(`/member/info/${uid}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 登录接口（账号密码登录） POST */
export async function login(body: User.LoginParams, options?: { [key: string]: any }) {
  return request<API.R>('/member/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 下线接口 POST */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.R>('/member/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 注册接口（邮箱密码注册） POST */
export async function register(body: User.RegisterParams, options?: { [key: string]: any }) {
  return request<API.R>('/member/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function loginByPhone(body: User.PhoneLoginParams, options?: { [key: string]: any }) {
  return request<API.R>('/member/loginByPhone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function getPhoneCaptcha(
  params: User.PhoneCaptchaParams,
  options?: { [key: string]: any },
) {
  return request<API.R>('/member/sms/sendCode', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getEmailCaptcha(
  params: User.EmailCaptchaParams,
  options?: { [key: string]: any },
) {
  return request<API.R>('/member/email/sendCode', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getAllTags(options?: { [key: string]: any }) {
  return request<API.R>('/member/tags', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function addATag(body: User.UserTagAddRequest, options?: { [key: string]: any }) {
  return request<API.R>('/member/tags', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function updateBasic(body: User.UpdateBasicParams, options?: { [key: string]: any }) {
  return request<API.R>('/member/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updatePwd(params: User.UpdatePwdParams, options?: { [key: string]: any }) {
  return request<API.R>('/member/pwd', {
    method: 'PUT',
    data: params,
    ...(options || {}),
  });
}

export async function bindPhone(params: User.BindPhoneParams, options?: { [key: string]: any }) {
  return request<API.R>('/member/phone', {
    method: 'PUT',
    params: params,
    ...(options || {}),
  });
}

export async function bindEmail(params: User.BindEmailParams, options?: { [key: string]: any }) {
  return request<API.R>('/member/email', {
    method: 'PUT',
    params: params,
    ...(options || {}),
  });
}

/**
 * 获取推荐用户
 */
export async function getRecommendUsers(options?: { [key: string]: any }) {
  return request<API.R>('/member/recommend', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 刷新推荐用户
 */
export async function refreshRecommendUsers(options?: { [key: string]: any }) {
  return request<API.R>('/member/recommend/refresh', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 关注用户
 */
export async function follow(uid: number, options?: { [key: string]: any }) {
  return request<API.R>(`/member/follow/${uid}`, {
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 获取关注列表
 */
export async function getFollowsOfCurrent(options?: { [key: string]: any }) {
  return request<API.R>(`/member/follows/of/current`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取关注列表
 */
export async function getFollowsByUid(uid: number, options?: { [key: string]: any }) {
  return request<API.R>(`/member/follows/of/${uid}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取粉丝列表
 */
export async function getFansByUid(uid: number, options?: { [key: string]: any }) {
  return request<API.R>(`/member/fans/of/${uid}`, {
    method: 'GET',
    ...(options || {}),
  });
}
