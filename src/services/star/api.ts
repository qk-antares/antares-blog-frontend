import {request} from "@@/exports";

//创建收藏夹
export async function createStarBook(name: string, options?: { [key: string]: any }) {
  return request<API.R>('/blog/starBook', {
    method: 'POST',
    params: {name},
    ...(options || {}),
  });
}

//获取当前用户所有收藏夹
export async function getStarBooks(articleId: number, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/starBook/${articleId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

//获取当前用户所有收藏夹
export async function getStarBooksByUid(uid: number, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/starBook/of/${uid}`, {
    method: 'GET',
    ...(options || {}),
  });
}

//添加至收藏夹
export async function starBlog(id: number, bookIds: number[], options?: { [key: string]: any }) {
  return request<API.R>(`/blog/article/${id}/star`, {
    data: bookIds,
    method: 'POST',
    ...(options || {}),
  });
}

//分页获取收藏夹下的文章
export async function getArticlesInStarBook(body: Star.StarBookQuery, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/starBook/articles`, {
    data: body,
    method: 'POST',
    ...(options || {}),
  });
}
