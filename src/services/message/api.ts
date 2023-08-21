import {request} from "@@/exports";

//获取所有根评论
export async function getRootCommentsOfArticle(articleId: number, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/comment/${articleId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

//获取某个根评论下的所有子评论
export async function getChildrenOfRoot(rootId: number, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/comment/children/${rootId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

//发布评论
export async function publishComment(body: Message.PostComment, options?: { [key: string]: any }) {
  return request<API.R>('/blog/comment', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

//获取自己的消息通知数量
export async function getNoticeCount(options?: { [key: string]: any }) {
  return request<API.R>(`/blog/notification/count`, {
    method: 'GET',
    ...(options || {}),
  });
}

//获取点赞信息
export async function listLikeNotificationByPage(body: Message.PageQuery, options?: { [key: string]: any }) {
  return request<API.R>('/blog/notification/like', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function listCommentNotificationByPage(body: Message.PageQuery, options?: { [key: string]: any }) {
  return request<API.R>('/blog/notification/comment', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function clearNotification(param: string, options?: { [key: string]: any }) {
  return request<API.R>('/blog/notification/clear', {
    method: 'POST',
    params: {type: param},
    ...(options || {}),
  });
}

//分页获取conversation
export async function listConversationVoByPage(body: Message.PageQuery, options?: { [key: string]: any }) {
  return request<API.R>('/member/conversation/list/page/vo', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

//获取跟某个用户的conversation
export async function getConversationByTargetUid(targetUid: number, options?: { [key: string]: any }) {
  return request<API.R>(`/member/conversation/${targetUid}`, {
    method: 'GET',
    ...(options || {}),
  });
}

//分页获取消息记录
export async function listMessageVoByPage(body: Message.MessageQuery, options?: { [key: string]: any }) {
  return request<API.R>('/member/message/list/page/vo', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
