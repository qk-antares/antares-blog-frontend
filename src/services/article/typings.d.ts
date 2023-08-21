declare namespace Article {
  type ArticleTagCategory = {
    id: number;
    name: string;
    tags: ArticleTag[];
  }

  type ArticleTagAddRequest = {
    parentId: number;
    name: string;
  }

  type ArticleTag = {
    id: number;
    parentId: number;
    name: string;
    color: string;
  }

  type ArticleCreate = {
    tags?: number[];
    title?: string;
    summary?: string;
    thumbnails?: string[] ;
    isTop?: number;
    closeComment?: number;
  }

  type ArticleBasicUpdate = {
    id: number;
    tags?: number[];
    title?: string;
    summary?: string;
    thumbnails?: string[] ;
    isTop?: number;
    closeComment?: number;
  }

  type ArticleQuery = {
    uid?: number;
    selectType?: number;
    pageNum?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    prime?: boolean;
  }

  type Article = {
    //这是后端可以传来的
    id: number

    title: string;
    summary: string;
    content: string;

    prime: number;
    isTop: number;
    isGlobalTop: number;

    status: number;

    closeComment: number;

    viewCount: number;
    starCount: number;
    likeCount: number;
    commentCount: number;

    thumbnails: string[];
    createdBy: number;
    createTime: any;
    updateTime: any;

    author: User.UsernameAndAvatar;
    tags: Article.ArticleTag[];

    isLiked: boolean;
    isStared: boolean;
  }
}
