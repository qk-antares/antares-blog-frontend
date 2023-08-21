import {request} from "@@/exports";

export async function policy(options?: { [key: string]: any }) {
  return request<API.R>('/member/oss/policy', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function uploadAvatar(body: FormData, options?: { [key: string]: any }) {
  return request<any>('http://upload.qiniup.com', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
