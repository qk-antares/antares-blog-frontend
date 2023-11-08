import {Card, notification, Tabs, TabsProps} from 'antd';
import React, {useEffect, useState} from 'react';
import Search from "antd/es/input/Search";
import {useNavigate} from "umi";
import {useLocation} from "@@/exports";
import {doSearch} from "@/services/search/api";
import {StringUtils} from "@/utils";
import BlogList from "@/pages/Search/BlogList";
import UserList from "@/pages/Search/UserList";
import CsdnList from "@/pages/Search/CsdnList";
import CnBlogList from "@/pages/Search/CnBlogList";
import {FrownOutlined} from "@ant-design/icons";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const [type, setType] = useState(()=>{
    return urlSearchParams.get('type') || 'blog';
  });
  const [keyword, setKeyword] = useState(()=>{
    return urlSearchParams.get('keyword') || '';
  });
  const [pageNum, setPageNum] = useState(()=>{
    return Number(urlSearchParams.get('pageNum')) || 1;
  });
  const [tags, setTags] = useState<string[]>(()=>{
    return urlSearchParams.getAll('tags') || [];
  });

  const [blogList, setBlogList] = useState<Article.Article[]>([]);
  const [userList, setUserList] = useState<User.UserInfo[]>([]);
  const [csdnBlogList, setCsdnBlogList] = useState<Search.CsdnBlog[]>([]);
  const [cnBlogList, setCnBlogList] = useState<Search.CnBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(1);
  const [api, contextHolder] = notification.useNotification();

  const setData = (type: string, data: Article.Article[] | User.UserInfo[] | Search.CsdnBlog[] | Search.CnBlog[])=>{
    console.log(type, data)
    switch (type) {
      case 'blog': setBlogList(data as Article.Article[]);break;
      case 'user': setUserList(data as User.UserInfo[]);break;
      case 'csdn': setCsdnBlogList(data as Search.CsdnBlog[]);break;
      case 'cnblog': setCnBlogList(data as Search.CnBlog[]);break;
    }
  }

  //监听路径参数变化
  useEffect(()=>{
    const params: Search.SearchRequest = {
      type: urlSearchParams.get('type') || 'blog',
      keyword: urlSearchParams.get('keyword') || '',
      pageNum: Number(urlSearchParams.get('pageNum')) || 1,
      tags: urlSearchParams.getAll('tags') || []
    };
    setType(params.type);
    setKeyword(params.keyword);
    setPageNum(params.pageNum);
    setTags(params.tags || []);
    if(StringUtils.isNotEmpty(params.keyword) ||
      (params.type === 'blog' || params.type === 'user') && params.tags && params.tags.length > 0){
      setLoading(true);
      doSearch(params).then(res => {
        if(res.code === 200){
          const {records, total} = res.data.pageData;
          setData(params.type, records);
          setTotal(total);
          setLoading(false);
          if(records.length === 0 && params.type === 'cnblog'){
            api.open({
              message: '未查询到信息',
              description:
                '博客园做了反爬虫处理，未查询到结果大概率是后端查询的cookie过期了',
              icon: <FrownOutlined style={{ color: '#108ee9' }} />,
            });
          }
        }
      })
    }
  }, [location.search])

  function onSearch(value: string) {
    setKeyword(value);
    const params = new URLSearchParams({
      type,
      keyword: value,
      pageNum: pageNum.toString(),
    });
    tags.forEach(tag => params.append('tags', tag));
    //将搜索参数拼接到query上
    navigate({
      search: `?${params.toString()}`
    })
  }

  const appendPageNumQuery = (pageNum: number) => {
    setPageNum(pageNum);
    const params = new URLSearchParams({
      type,
      keyword,
      pageNum: pageNum.toString(),
    });
    tags.forEach(tag => params.append('tags', tag));
    //添加pageNum参数
    navigate({
      search: `?${params.toString()}`
    });
  }

  const appendTagsQuery = (selectedTags: string[]) => {
    setTags(selectedTags);
    const params = new URLSearchParams({
      type,
      keyword,
      pageNum: pageNum.toString(),
    });
    selectedTags.forEach(tag => params.append('tags', tag));
    //将搜索标签拼接到path上
    navigate({
      search: `?${params.toString()}`
    })
  }

  const onTypeChange = (key: string) => {
    setType(key);
    setTags([]);
    const params = new URLSearchParams({
      type: key,
      keyword,
    });
    //将搜索类别拼接到path上
    navigate({
      search: `?${params.toString()}`
    })
  };

  const items: TabsProps['items'] = [
    {
      key: 'blog',
      label: `博客`,
      children: <BlogList
        dataList={blogList} pageNum={pageNum} total={total} loading={loading} selectedTags={tags}
        updateArticle={(id, isLiked, likeCount, isStared, starCount)=>{
          setBlogList(blogList.map(tmp => tmp.id === id ?
            {...tmp, isLiked, likeCount, isStared, starCount} : tmp))
        }}
        changePage={(pageNum)=>appendPageNumQuery(pageNum)}
        changeTags={(selectedTags)=>appendTagsQuery(selectedTags)}
      />,
    },
    {
      key: 'user',
      label: `用户`,
      children: <UserList
        dataList={userList} pageNum={pageNum} total={total} loading={loading}  selectedTags={tags}
        afterDoFollow={user =>
          setUserList(userList.map(result =>
            result.uid === user.uid ? {
              ...result,
              fans: result.isFollow ? result.fans - 1 : result.fans + 1,
              isFollow: !result.isFollow,
            } : result))
        }
        changePage={(pageNum)=>appendPageNumQuery(pageNum)}
        changeTags={(selectedTags)=>appendTagsQuery(selectedTags)}
      />,
    },
    {
      key: 'csdn',
      label: 'CSDN',
      children: <CsdnList
        loading={loading} dataList={csdnBlogList}
        changePage={(pageNum)=>appendPageNumQuery(pageNum)}
      /> ,
    },
    {
      key: 'cnblog',
      label: '博客园',
      children: <CnBlogList
        loading={loading} dataList={cnBlogList} total={total}
        changePage={(pageNum)=>appendPageNumQuery(pageNum)}
      />,
    }
  ];

  return (
    <>
      {contextHolder}
      <div style={{margin: '19px auto 32px auto', width: '40%'}}>
        <Search
          size='large'
          defaultValue={keyword}
          onChange={(e)=>{
            setKeyword(e.target.value)
          }}
          placeholder="试试搜索"
          onSearch={onSearch}
        />
      </div>
      <Card style={{width: 980, margin: '0 auto'}}>
        <div style={{margin: '0 auto', width: '96%'}}>
          <Tabs
            defaultActiveKey={type}
            onChange={onTypeChange}
            items={items}
          />
        </div>
      </Card>
    </>
  );
};

export default SearchPage;
