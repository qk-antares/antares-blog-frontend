const BACKEND_DOMAIN: string = "zqk.asia";
// 用于gitee登录
const CLIENT_ID: string = '0d07237d6f7dc65dc6a6c0ccc210a755c04982c2a954267541981478e27a2492';
export const BASE_URL: string = `http://blog.${BACKEND_DOMAIN}/api`;
const REDIRECT_URI: string = `${BASE_URL}/member/oauth2.0/gitee/success`;
export const JUDGE_PATH: string = `http://oj.${BACKEND_DOMAIN}`;
export const WEB_SOCKET_PATH: string = `ws://blog.${BACKEND_DOMAIN}:8666`;
export const GITEE_OAUTH_URL: string = `https://gitee.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`
