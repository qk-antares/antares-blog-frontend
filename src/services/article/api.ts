import {request} from "@@/exports";

// 获取所有的文章标签（分类）
export async function getArticleCategories(options?: { [key: string]: any }) {
  return request<API.R>('/blog/article/tags', {
    method: 'GET',
    ...(options || {}),
  });
}

// 添加一个文章标签
export async function addAArticleTag(body: Article.ArticleTagAddRequest, options?: { [key: string]: any }) {
  return request<API.R>('/blog/article/tags', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

//创建草稿
export async function createDraft(body: Article.ArticleCreate, options?: { [key: string]: any }) {
  return request<API.R>('/blog/article', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

//根据文章Id获取文章基本信息（用于修改文章配置）
export async function getArticleBasicById(id: number, options?: { [key: string]: any }) {
  return request<API.R>(`/ngx/blog/article/${id}/basic`, {
    method: 'GET',
    ...(options || {}),
  });
}

//根据文章Id获取文章内容（用于编辑文章内容）
export async function getArticleContentById(id: number, options?: { [key: string]: any }) {
  return request<API.R>(`/ngx/blog/article/${id}/content`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 根据文章Id获取文章Detail
export async function getArticleById(id: number, options?: { [key: string]: any }) {
  return request<API.R>(`/ngx/blog/article/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

//点赞或取消点赞文章
export async function likeBlog(id: number, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/article/${id}/like`, {
    method: 'POST',
    ...(options || {}),
  });
}

//根据文章Id更新文章内容
export async function updateContentById(id: number, articleContent: {content: string}, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/article/${id}/content`, {
    method: 'PUT',
    data: articleContent,
    ...(options || {}),
  });
}

//根据文章Id更新文章基本信息
export async function updateBasicById(id: number, body: Article.ArticleCreate, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/article/${id}/basic`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

//发布文章（相当于保存+修改status）
export async function publishArticle(id: number, articleContent?: {content: string}, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/article/${id}/publish`, {
    method: 'PUT',
    data: articleContent,
    ...(options || {}),
  });
}

//删除文章
export async function deleteArticle(id: number, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/article/${id}/remove`, {
    method: 'DELETE',
    ...(options || {}),
  });
}


//根据Uid获取该用户的所有文章（如果不是当前用户，只获取发布的文章）
export async function getArticlesByUid(body: Article.ArticleQuery, options?: { [key: string]: any }) {
  return request<API.R>(`/blog/user/article`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

//分页获取文章（用在主页）
export async function listArticleVoByPage(body: Article.ArticleQuery, options?: { [key: string]: any }){
  return request<API.R>(`/blog/list/page/vo`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function getHot(options?: { [key: string]: any }) {
  return request<API.R>('/blog/article/hot', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getGlobalTop(options?: { [key: string]: any }) {
  return request<API.R>('/blog/article/global/top', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getUpdates(body: Article.ArticleQuery, options?: { [key: string]: any }) {
  return request<API.R>('/blog/article/follow/updates', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

