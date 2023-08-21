import {Card, Divider, Form, Input, message, Modal, Radio, Tabs, Tag, Upload, UploadFile, UploadProps} from 'antd';
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import TextArea from "antd/es/input/TextArea";
import {CheckOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {RcFile} from "antd/es/upload";
import {policy} from "@/services/third-party/api";
// @ts-ignore
import {v4 as UUID} from "uuid"
import FormItem from "antd/es/form/FormItem";
import {
  addAArticleTag,
  createDraft,
  getArticleBasicById,
  getArticleCategories,
  updateBasicById
} from "@/services/article/api";
import {StringUtils} from "@/utils";
import {history, useModel} from "@@/exports";
import TabPane = Tabs.TabPane;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

//图片的预览
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export type ArticleData = {
  title?: string;
  summary?: string;
  tags?: Article.ArticleTag[],
  isTop?: string;
  closeComment?: string;
  thumbnails?: string[],
  createTime?: any
}

//校验
const checkSummary = (_: any, value: string) => {
  const promise = Promise;
  // 没有值的情况
  if (!value) {
    return promise.reject('文章摘要必须填写!');
  }
  //有值的情况
  if (value.length < 50 || value.length > 250) {
    return promise.reject('文章摘要的长度不符合要求！');
  }
  return promise.resolve();
}

type Step1Props = {
  articleId?: number;
  ref?: any;
}

const Step1: React.FC<Step1Props> = forwardRef(({articleId}, ref) => {
  const { initialState } = useModel('@@initialState');
  const [currentUser] = useState(initialState?.currentUser);

  const [form] = Form.useForm();

  const [selectedTags, setSelectedTags] = useState<Article.ArticleTag[]>([]);
  const [selectedIds, setSelectedIds] = useState<(number | undefined)[]>([]);
  const [visible,setVisible] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentTab, setCurrentTab] = useState('0');
  const [allCategory, setAllCategory] = useState<Article.ArticleTagCategory[]>([])
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [editingTab, setEditingTab] = useState(0);
  const inputRef = useRef(null);
  const [tagInputValue, setTagInputValue] = useState('');

  //初始化获取所有ArticleCategory，如果传来了一个articleId，还要根据articleId查询文章信息
  useEffect(() => {
    getArticleCategories().then((res) => {
      if(res.code === 200){
        setAllCategory(res.data);
        setCurrentTab(res.data[0].id);
      }
    })
    if(articleId){
      //查询文章信息
      getArticleBasicById(articleId).then(res => {
        form.setFieldValue("title", res.data.title)
        form.setFieldValue("summary", res.data.summary)
        form.setFieldValue("isTop", res.data.isTop)
        form.setFieldValue("closeComment", res.data.closeComment)

        setSelectedTags(res.data.tags);
        setFileList(res.data.thumbnails
          .filter((thumbnail: string) => StringUtils.isNotEmpty(thumbnail))
          .map((thumbnail: string) => {
          return {
            uid: thumbnail,
            name: thumbnail,
            url: thumbnail
          }
        }))
      })
    }
  },[])

  //计算属性根据selectedTags获取ids
  useEffect(()=>{
    setSelectedIds(selectedTags.length > 0 ? selectedTags.map(tag => tag.id) : []);
  }, [selectedTags])

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    //真实的地址是`http://image.antares.cool/${file.response.key}`
    setFileList(newFileList);
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  const props: UploadProps = {
    accept: "image/png, image/jpeg",
    action: "http://upload.qiniup.com",
    listType: "picture-card",
    fileList,
    onPreview: handlePreview,
    onChange: handleChange,
    data: async (file) => {
      let ext = file.name.substring(file.name.lastIndexOf('.'));
      let res = await policy();
      return {
        token: res.data.token,
        key: res.data.dir + '/' + UUID() + ext,
      }
    },
  };

  const handleTagClose = (removeTag: Article.ArticleTag) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== removeTag.id))
  }

  //选择标签切换tab
  const changeTab = (activeKey: string) => {
    setCurrentTab(activeKey);
  }

  const addTagToArticle = (tag: Article.ArticleTag) => {
    if(selectedIds && selectedIds.length && selectedIds.length >= 10){
      message.error('每篇文章至多选择10个标签');
    } else {
      setSelectedTags([...selectedTags, tag] );
    }
  }

  const handleInputChange = (e: any) => {
    setTagInputValue(e.target.value);
  }

  const handleTagInputConfirm = async (index: number) => {
    //当输入标签的长度不符合规范
    if(tagInputValue.length > 16){
      message.error('标签最长16个字');
      return;
    }
    //当输入的标签值不为空才进行添加
    if(StringUtils.isNotEmpty(tagInputValue) && currentUser){
      const param: Article.ArticleTagAddRequest = {
        parentId: Number(currentTab),
        name: tagInputValue
      }
      const res = await addAArticleTag(param);
      //添加标签成功
      if(res.code === 200){
        message.success('添加自定义标签成功');
        allCategory[index].tags.push(res.data);
        setAllCategory([...allCategory]);
      }
    }
    setTagInputVisible(false);
    setTagInputValue('');
  }

  const showTagInput = (tabKey: number) => {
    setTagInputVisible(true);
    setEditingTab(tabKey);
  }

  //暴露的方法
  useImperativeHandle(ref, () => ({
    createArticle: () => {
      if(!currentUser){
        message.error('请先登录');
        return;
      }
      //首先进行参数的校验
      form.validateFields()
        .then(async (values) => {
          //首先向服务器发送请求建立文章
          const params: Article.ArticleCreate = {
            ...values,
            tags: selectedIds,
            thumbnails: fileList.map(file => `http://image.antares.cool/${file.response.key}`)
          }
          const res = await createDraft(params)
          if(res.code === 200){
            message.success('创建成功！');
            //跳转至编辑界面
            history.push(`/note/edit/${res.data}`);
          }
        }).catch((err)=>{
        console.log(err);
      })
    },

    updateSettings: () => {
      if(!currentUser){
        message.error('请先登录');
        return;
      }
      if(!articleId) {
        return;
      }
      //首先进行参数的校验
      form.validateFields()
        .then(async (values) => {
          //首先向服务器发送请求建立文章
          const params: Article.ArticleBasicUpdate = {
            ...values,
            tags: selectedIds,
            thumbnails: fileList.map(file => file.url || `http://image.antares.cool/${file.response.key}`)
          }
          const res = await updateBasicById(articleId, params);
          if(res.code === 200){
            message.success('更新成功！');
          }
        }).catch((err)=>{
        console.log(err);
      })
    }
  }));

  return (
    <Card bordered={true} style={{borderRadius: 8,}}>
      <div>
        <Form
          form={form}
          initialValues={{ 'isTop': '0', 'closeComment': '0'}}
          {...layout}
        >
          <FormItem label="文章标题" name='title' rules={[{required: true, message: '文章标题必须填写！'}]}>
            <Input placeholder="给你的文章起一个清晰明了的标题"/>
          </FormItem>


          <FormItem label="文章摘要" name='summary' rules={[{validator: checkSummary}]} required={true}>
            <TextArea placeholder='请输入文章摘要，50~250字之间' rows={3}/>
          </FormItem>

          <FormItem label='标签'>
            <div>
              {selectedTags.length > 0 && selectedTags.map(tag => <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>)}
              <Tag onClick={()=>{setVisible(true)}} style={{background: '#fff', borderStyle: 'dashed'}}>
                <EditOutlined />编辑
              </Tag>
            </div>
          </FormItem>

          <FormItem name='isTop' label="置顶">
            <Radio.Group>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem name='closeComment' label="关闭评论">
            <Radio.Group>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem label="缩略图">
            <Upload {...props}>
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </FormItem>
        </Form>
      </div>

      <Modal
        centered={true}
        open={visible}
        title={<div style={{fontWeight: 600,fontSize: 16, textAlign: 'center'}}>添加标签</div>}
        onCancel={()=>setVisible(false)}
        onOk={()=>setVisible(false)}
      >
        <Divider/>
        <FormItem label='已选标签' labelCol={{span: 4}} wrapperCol={{span: 20}}>
          <div>
            <Card style={{width: 400, height: 86}} bodyStyle={{padding: 8}}>
              {selectedTags.length > 0 && selectedTags.map(tag =>
                <Tag key={tag.id} color={tag.color} closable onClose={()=>handleTagClose(tag)}>
                  {tag.name}
                </Tag>
              )}
            </Card>
          </div>
        </FormItem>
        <Tabs onChange={changeTab} activeKey={String(currentTab)} tabPosition='left'>
          {
            allCategory.map((category, index) =>
              <TabPane key={category.id} tab={category.name}>
                {category.tags.map(tag =>
                  selectedIds?.includes(tag.id) &&
                  <Tag style={{cursor: 'pointer'}} color='#f50' key={tag.id} onClick={()=>handleTagClose(tag)}>
                    {tag.name}<CheckOutlined/>
                  </Tag> ||
                  <Tag style={{cursor: 'pointer'}} key={tag.id} onClick={()=>{addTagToArticle(tag)}}>{tag.name}</Tag>
                )}
                {
                  tagInputVisible && category.id === editingTab &&
                  <Input ref={inputRef} type="text" size="small" style={{ width: 78}} value={tagInputValue}
                         onChange={handleInputChange}
                         onBlur={()=>handleTagInputConfirm(index)}
                         onPressEnter={()=>handleTagInputConfirm(index)}
                  /> ||
                  <Tag onClick={()=>showTagInput(category.id)} style={{background: '#fff', borderStyle: 'dashed'}}>
                    <PlusOutlined/>添加
                  </Tag>
                }
              </TabPane>
            )
          }
        </Tabs>
      </Modal>
    </Card>
  );
});

export default Step1;
