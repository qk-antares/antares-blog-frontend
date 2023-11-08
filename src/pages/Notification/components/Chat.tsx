import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import './styles.min.css'
import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  Search,
  Sidebar
} from "@chatscope/chat-ui-kit-react";
import {useLocation, useModel} from "@@/exports";
import {getConversationByTargetUid, listConversationVoByPage, listMessageVoByPage} from "@/services/message/api";
import {history} from "@umijs/max";
import {StringUtils} from "@/utils";
import {WEB_SOCKET_PATH} from "@/utils/constants";

const Chat: React.FC<{ref: any}> = forwardRef(({}, ref) => {
  const { initialState} = useModel('@@initialState');
  const currentUser= initialState?.currentUser;
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const targetUid = Number(urlSearchParams.get('targetUid'));
  const msgListRef = useRef(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [conversations, setConversations] = useState<Message.Conversation[]>([]);
  const [msgPageNum, setMsgPageNum] = useState(1);
  const [msgTotal, setMsgTotal] = useState(0);
  const [messages, setMessages] = useState<Message.MessageVo[]>([]);
  const [activeConversation, setActiveConversation] = useState<Message.Conversation>();
  const [messageInputValue, setMessageInputValue] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [initLoaded, setInitLoaded] = useState(false);
  const [value, setValue] = useState("");
  const [searchConversations, setSearchConversations] = useState<Message.Conversation[]>([]);

  //暴露的方法
  useImperativeHandle(ref, () => ({
    clearMsg: () => {
      setConversations(conversations.map(conversation => {
        return {...conversation, unread: 0}}
      ));
    }
  }));

  //首先获取所有conversation
  useEffect(()=>{
    listConversationVoByPage({pageNum: 1, pageSize: 30}).then(res => {
      if(res.code === 200) {
        const {records} = res.data;
        //没有指定私聊对象
        if(records.length > 0 && targetUid === 0){
          setConversations(records);
        }
        //指定了私聊对象
        else if(targetUid !== 0){
          const filter = records.filter((record: Message.Conversation) => record.fromUid === targetUid);
          //没跟这个人私聊过（新建conversation并将其置顶）
          if(filter.length === 0){
            getConversationByTargetUid(targetUid).then(res => {
              setConversations([res.data, ...records]);
              setActiveConversation({...res.data});
            })
          }
          //私聊过了
          else {
            setConversations(records);
            setActiveConversation({...filter[0]});
          }
        }
      }
    })

    const newSocket = new WebSocket(WEB_SOCKET_PATH);
    setSocket(newSocket);

    // 在组件卸载时关闭WebSocket连接
    return () => {
      newSocket.close();
    };
  }, [])

  useEffect(() => {
    if (socket && currentUser) {
      // 添加WebSocket事件处理程序
      socket.onopen = () => {
        console.log('WebSocket连接已建立');
        //发送建立连接的请求
        const connectCommand: Message.Command = {
          code: 10001,
          uid: currentUser.uid,
        };
        socket.send(JSON.stringify(connectCommand));
      };

      socket.onmessage = (event) => {
        const res: API.R = JSON.parse(event.data);
        if(res.code === 200 && res.data){
          const {conversationId} = res.data;
          let target: Message.Conversation | null = null;
          let others: Message.Conversation[] = [];
          //消息来自当前打开的聊天窗口
          if(activeConversation && conversationId === activeConversation.id){
            setMessages([...messages, res.data])
            for (let conversation of conversations) {
              if(conversation.id === conversationId){
                target = {...conversation, lastMessage: res.data.content};
              } else {
                others.push(conversation);
              }
            }
          }
          //消息来自其他聊天窗口（或者不属于任何一个聊天窗口）
          else {
            for (let conversation of conversations) {
              if(conversation.id === conversationId){
                target = {...conversation, unread: conversation.unread + 1, lastMessage: res.data.content};
              } else {
                others.push(conversation);
              }
            }
            if(!target){
              const {avatar, content, conversationId, fromUid, fromUsername, createTime} = res.data;
              target = {
                id: conversationId,
                fromUid,
                fromUsername,
                avatar,
                unread: 1,
                lastMessage: content,
                updateTime: createTime
              }
            }
          }
          setConversations([target as Message.Conversation, ...others]);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket连接已关闭');
      };

      socket.onerror = (error) => {
        console.error('WebSocket发生错误:', error);
      };
    }
  }, [socket, conversations]);

  useEffect(()=>{
    //获取与用户的所有聊天消息
    if(activeConversation && activeConversation.fromUid > 0){
      listMessageVoByPage({
        pageNum: msgPageNum,
        pageSize: 30,
        conversationId: activeConversation.id
      }).then(res => {
        if(res.code === 200){
          const {records, total} = res.data;
          setMessages(records);
          setMsgTotal(total);
        }
      })
    }
  }, [activeConversation]);

  //监听搜索关键词变化
  useEffect(()=>{
    if(StringUtils.isNotEmpty(value)){
      const keyword = value.trim(); // 去除搜索关键词左右的空格
      const regex = new RegExp(keyword, "i"); // 创建正则表达式对象，i 表示不区分大小写

      setSearchConversations(conversations.filter(conversation => regex.test(conversation.fromUsername)));
    }
  }, [value]);

  const sendMessage = (message: Message.MessageSend) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const command: Message.Command = {
        code: 10002,
        uid: currentUser?.uid,
        chatMessage: message
      };
      socket.send(JSON.stringify(command));
    }
  };

  const changeConversation = (newConversation: Message.Conversation) => {
    if(!activeConversation || newConversation.id !== activeConversation.id){
      setActiveConversation({...newConversation, unread: 0});
      setConversations(conversations.map(conversation =>
        conversation.id === newConversation.id ? {...newConversation, unread: 0} : conversation));
      setInitLoaded(false);
      setMsgPageNum(1);
      if (socket && socket.readyState === WebSocket.OPEN) {
        const command = {
          code: 10003,
          uid: currentUser?.uid,
          conversationId: newConversation.id
        };
        socket.send(JSON.stringify(command));
      }
    }
    // @ts-ignore
    msgListRef.current?.scrollToBottom();
  }

  const onYReachStart = () => {
    setInitLoaded(true);
    if (loadingMore) {
      return;
    }
    if(initLoaded && activeConversation && messages.length < msgTotal){
      setLoadingMore(true);
      setMsgPageNum(msgPageNum + 1);
      listMessageVoByPage({
        pageNum: msgPageNum + 1,
        pageSize: 10,
        conversationId: activeConversation.id
      }).then(res => {
        if(res.code === 200){
          const {records} = res.data;
          setMessages([...records, ...messages]);
          setLoadingMore(false);
        }
      })
    }
  };


  if(!currentUser || currentUser.uid === targetUid){
    history.push('/note');
    return <></>
  }

  // @ts-ignore
  return (
    <MainContainer responsive>
      <Sidebar position="left" scrollable={false}>
        <Search
          value={value}
          placeholder="搜索用户"
          onChange={v => setValue(v)}
          onClearClick={() => setValue("")}
        />
        <ConversationList>
          {
            StringUtils.isNotEmpty(value) ?
            searchConversations.map(conversation =>
              <Conversation
                active={activeConversation && activeConversation.id === conversation.id}
                onClick={()=>changeConversation(conversation)}
                key={conversation.id}
                name={conversation.fromUsername}
                info={conversation.lastMessage}
                unreadCnt={conversation.unread}
              >
                <Avatar src={conversation.avatar} status="available"/>
              </Conversation>) :
            conversations.map(conversation =>
              <Conversation
                active={activeConversation && activeConversation.id === conversation.id}
                onClick={()=>changeConversation(conversation)}
                key={conversation.id}
                name={conversation.fromUsername}
                info={conversation.lastMessage}
                unreadCnt={conversation.unread}
              >
                <Avatar src={conversation.avatar}/>
              </Conversation>)
          }
        </ConversationList>
      </Sidebar>

      {
        !activeConversation ?
        <div style={{width: '100%', height: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{backgroundImage: 'url(/images/empty.png)',
            backgroundSize: '402px 204px',
            marginBottom: 32,
            width: 402,
            height: 204}}>
          </div>
          <div style={{color:' #8896b8', fontSize: 14, lineHeight: '1.5em'}}>
            快找小伙伴聊天吧 ( ゜- ゜)つロ
          </div>
        </div> :
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Content userName={activeConversation.fromUsername} style={{margin: '0 auto'}}/>
          </ConversationHeader>
          <MessageList ref={msgListRef} loadingMore={loadingMore} onYReachStart={onYReachStart}>
            {
              messages.map((message, index) => {
                const flag = message.fromUid === currentUser.uid;
                return <Message key={index} model={{
                  message: message.content,
                  sender: message.fromUsername,
                  direction: flag ? "outgoing" : "incoming",
                  position: "single"
                }} avatarPosition={flag ? 'tr' : 'tl'}>
                  <Avatar style={{width: 36,minWidth: 36,height:36,minHeight: 36}} src={message.avatar} name="Zoe" />
                </Message>
              })
            }
          </MessageList>
          <MessageInput
            value={messageInputValue}
            onChange={val => setMessageInputValue(val)}
            onSend={() => {
              const msg: Message.MessageSend = {
                type: 1,
                conversationId: activeConversation?.id,
                fromUid: currentUser.uid,
                toUid: activeConversation.fromUid,
                content: messageInputValue,
                createTime: new Date()
              }
              const msgVo: Message.MessageVo = {
                conversationId: activeConversation.id,
                fromUid: currentUser.uid,
                fromUsername: currentUser.username,
                avatar: currentUser.avatar,
                content: messageInputValue,
                createTime: new Date(),
              }
              setMessages([...messages, msgVo]);
              setConversations([
                {...activeConversation, lastMessage: messageInputValue},
                ...conversations.filter(conversation =>
                  conversation.id !== activeConversation?.id)]);
              sendMessage(msg);
              setMessageInputValue("");
            }}
          />
        </ChatContainer>
      }
    </MainContainer>
  );
});

export default Chat;
