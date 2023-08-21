declare namespace Search {
  type SearchRequest = {
    type: string;
    keyword: string;
    pageNum: number;
    tags?: string[];
  }

  type CnBlog = {
    title: string;
    articleUrl: string;
    summary: string;
    viewCount: string;
    likeCount: string;
    commentCount: string;
    author: string;
    authorUrl: string;
    createdTime: string;
  }

  type CsdnBlog = {
    title: string;
    articleUrl: string;
    summary: string;
    viewCount: string;
    likeCount: string;
    commentCount: string;
    author: string;
    authorUrl: string;
    createdTime: string;
    picList: string[];
  }
}
