declare namespace Message {
  type PostComment = {
    content?: string;
    articleId?: number;
    rootId?: number;
    toUid?: number;
    toCommentId?: number;
  }

  type RootComment = {
    id?: number;
    content?: string;
    fromUid?: number;
    avatar?: string;
    fromUsername?: string;
    likeCount?: number
    createTime?: any;
    replyCount?: number;
  }

  type ChildrenComment = {
    id?: number;
    articleId?: number;
    rootId?: number;
    content?: string;
    fromUid?: number;
    avatar?: string;
    fromUsername?: string;
    toUid?: number;
    toUsername?: string;
    toCommentId?: number;
    likeCount?: number
    createTime?: any;
  }

  type NotificationCount = {
    likeCount: number;
    commentCount: number;
    msgCount: number;
    noticeCount: number;
  }

  type PageQuery = {
    pageNum: number;
    pageSize: number;
  }

  type LikeNotification = {
    id: number;
    fromUid: number;
    fromUsername: string;
    avatar: string;
    title: string;
    summary: string;
    articleId: number;
    createTime: any;
  }

  type CommentNotification = {
    id: number;
    fromUid: number;
    avatar: string;
    fromUsername: string;
    fromContent: string;
    content: string;
    articleId: number;
    title: string;
    summary: string;
    createTime: any;
  }

  type Conversation = {
    id: number;
    fromUid: number;
    fromUsername: string;
    avatar: string;
    unread: number;
    lastMessage: string;
    updateTime: any;
  }

  type MessageSend = {
    id?: number;
    conversationId: number;
    type: number;
    fromUid: number;
    toUid?: number;
    toGroupId?: number;
    content: string;
    createTime?: any;
  }

  type MessageQuery = {
    pageNum: number;
    pageSize: number;
    conversationId: number;
  }

  type MessageVo = {
    id?: number;
    conversationId: number;
    fromUid: number;
    fromUsername: string;
    avatar: string;
    content: string;
    createTime: any;
  }

  type Command = {
    code?: number;
    uid?: number;
    conversationId?: number;
    chatMessage?: MessageSend;
  }
}
