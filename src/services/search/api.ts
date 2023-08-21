import {request} from "@@/exports";

//创建收藏夹
export async function doSearch(data: Search.SearchRequest, options?: { [key: string]: any }) {
  return request<API.R>('/search', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
