import {Button, Col, List, message, Row, Select, Tabs, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import Article from "@/pages/Note/components/Article";
import {CheckOutlined, RiseOutlined, TagsOutlined} from "@ant-design/icons";
import {getArticleCategories} from "@/services/article/api";
import TabPane = Tabs.TabPane;

type BlogListProps = {
  loading: boolean;
  dataList: Article.Article[];
  changePage: (pageNum: number)=>void;
  pageNum: number;
  total: number,
  updateArticle: (id: number, isLiked:boolean, likeCount:number, isStared:boolean, starCount:number)=>void;
  selectedTags: string[];
  changeTags: (selectedTags: string[])=>void;
}

const BlogList: React.FC<BlogListProps> = ({loading, dataList, changePage, pageNum, total, updateArticle, selectedTags, changeTags}) => {
  const [currentTab, setCurrentTab] = useState('0');
  const [allCategory, setAllCategory] = useState<Article.ArticleTagCategory[]>([])
  const [options, setOptions] = useState<any[]>([]);

  //初始化获取标签信息
  useEffect(() => {
    getArticleCategories().then((res) => {
      if(res.code === 200){
        setAllCategory(res.data);
        setCurrentTab(res.data[0].id);
        // setTagsLoading(false);
        let tmp: any[] = [];
        res.data.forEach((category: Article.ArticleTagCategory) => {
          category.tags.forEach(tag => tmp.push({value: tag.name}));
        });
        setOptions(tmp);
      }
    })
  },[])

  const handleTagClose = (removeTag: string) => {
    changeTags(selectedTags.filter(tag => tag !== removeTag));
  }

  const addTagToParam = (tag: string) => {
    if(selectedTags && selectedTags.length && selectedTags.length >= 10){
      message.error('至多选择10个标签');
    } else {
      changeTags([...selectedTags, tag]);
    }
  }

  return (<>
    <Row justify="space-around" align="middle" style={{marginBottom: 8}}>
      <Col flex='80px'>
        <div style={{fontSize: 14}}>
          <TagsOutlined/>
          <span style={{marginLeft: 8}}>标签</span>
        </div>
      </Col>
      <Col flex='auto'>
        <Select
          mode="multiple"
          showSearch={false}
          value={selectedTags}
          style={{width: '100%'}}
          options={options}
          dropdownStyle={{padding: 12}}
          tagRender={(tag)=>{
            return (
              <Tag closable={true} onClose={()=>{handleTagClose(tag.value)}} style={{ marginRight: 3 }}>
                {tag.value}
              </Tag>
            )
          }}
          dropdownRender={()=>
            <Tabs
              tabPosition='left'
              onChange={(activeKey)=>setCurrentTab(activeKey)}
              activeKey={String(currentTab)}
            >
              {
                allCategory.map((category) =>
                  <TabPane key={category.id} tab={category.name}>
                    {category.tags.map(tag =>
                      selectedTags?.includes(tag.name) ?
                        <Tag
                          style={{cursor: 'pointer'}}
                          color='#f50' key={tag.id}
                          onClick={()=>handleTagClose(tag.name)}
                        >
                          {tag.name}<CheckOutlined/>
                        </Tag> :
                        <Tag
                          style={{cursor: 'pointer'}}
                          key={tag.id}
                          onClick={()=>{addTagToParam(tag.name)}}
                        >
                          {tag.name}
                        </Tag>
                    )}
                  </TabPane>
                )
              }
            </Tabs>
          }
        />
      </Col>
    </Row>

    <Row justify="space-around" align="middle" style={{marginBottom: 8}}>
      <Col flex='80px'>
        <div style={{fontSize: 14}}>
          <RiseOutlined/>
          <span style={{marginLeft: 8}}>排序</span>
        </div>
      </Col>
      <Col flex='auto'>
        <Button onClick={()=>message.info('功能待完善')} style={{borderRadius: '6px 0 0 6px'}}>综合</Button>
        <Button onClick={()=>message.info('功能待完善')} style={{borderRadius: 0}}>最新</Button>
        <Button onClick={()=>message.info('功能待完善')} style={{borderRadius: '0 6px 6px 0'}}>最热</Button>
      </Col>
    </Row>

    <List
      loading={loading}
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          changePage(page);
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        },
        showSizeChanger: false,
        showQuickJumper: true,
        current: pageNum,
        pageSize: 10,
        total,
      }}
      dataSource={dataList}
      renderItem={(item) => (
        <Article
          data={item} type='normal'
          updateInfo={(id, isLiked, likeCount, isStared, starCount)=>{
            updateArticle(id, isLiked, likeCount, isStared, starCount);
          }}
        />
      )}
    />
  </>);
}

export default BlogList;
