import React, {useEffect, useRef, useState} from "react";
import {Button, Checkbox, Col, Divider, Form, Input, message, Modal, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import './StarModal.less'
import {createStarBook, getStarBooks, starBlog} from "@/services/star/api";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {StringUtils} from "@/utils";

type StarModalProps = {
  articleId: number;
  visible: boolean;
  onCancel: ()=>void;
  onOver: (type: number)=>void;
}

const StarModal: React.FC<StarModalProps> = ({articleId, visible, onCancel, onOver}) => {
  const [buttonVisible, setButtonVisible] = useState(true);
  const [starBookName, setStarBookName] = useState('');
  const inputRef = useRef(null);
  const [starBookBools, setStarBookBools] = useState<Star.StarBookBool[]>([]);
  const [selectIds, setSelectIds] = useState<number[]>([]);
  const [idsStr, setIdsStr] = useState<string>('');

  //查询该用户的所有收藏夹信息
  useEffect(() => {
    getStarBooks(articleId).then(res => {
      if(res.code === 200){
        setStarBookBools(res.data);
        const ids = res.data.filter((starBookBool: Star.StarBookBool) => starBookBool.isContain)
          .map((starBookBool: Star.StarBookBool) => starBookBool.id);
        setIdsStr(ids.toString());
        setSelectIds([...ids]);
      }
    });
    setButtonVisible(true);
  },[])

  useEffect(()=>{
    if(!buttonVisible){
      // @ts-ignore
      inputRef.current?.focus();
    }
  }, [buttonVisible])

  const addToStarBook = () => {
    starBlog(articleId, selectIds).then(res => {
      if(res.code === 200){
        switch (res.data){
          case 0: message.success('取消收藏成功！');break;
          case 1: message.success('更改收藏成功！');break;
          case 2: message.success('收藏成功！');break;
        }
        onOver(res.data);
      }
    })
  }

  const handleInputConfirm = (event: any) => {
    event.stopPropagation();
    if(StringUtils.isNotEmpty(starBookName)){
      createStarBook(starBookName).then(res => {
        if(res.code === 200){
          message.success('新建收藏夹' + starBookName + '成功');
          setStarBookBools([...starBookBools, {id: res.data, name: starBookName, count: 0, isContain: false}])
        }
      })
      setStarBookName('');
      setButtonVisible(true);
    }
  }

  const itemStyle = useEmotionCss(() => {
    return {
      marginBottom: 0,
      paddingBottom: 20,
      ':hover': {
        cursor: 'pointer',
        'span': {
          color: '#FA541C',
          transition: 'color 0.3s'
        },
        '.ant-checkbox .ant-checkbox-inner': {
          border: '1px solid #FA541C',
          transition: 'border 0.3s'
        }
      }
    }
  })

  return (
    <Modal
      width={420} footer={null} open={visible}
      title={<div style={{fontWeight: 600,fontSize: 16, textAlign: 'center'}}>添加到收藏夹</div>}
      centered={true} onCancel={()=>onCancel?.()}
    >
      <Divider style={{margin: '10px 0'}}></Divider>

      <div
        style={{height: '300px', overflow: 'scroll'}}
        onClick={()=>{setButtonVisible(true)}}
      >
        <Form style={{margin: '0 20px 0 30px'}}>
          {starBookBools.map(starBookBool => (
            <Form.Item className={itemStyle} key={starBookBool.id} wrapperCol={{ offset: 1, span: 23 }}>
              <Checkbox style={{width: '100%'}} defaultChecked={starBookBool.isContain} onChange={(e)=>{
                if(e.target.checked){
                  setSelectIds([...selectIds, starBookBool.id])
                } else {
                  setSelectIds(selectIds.filter(id => id !== starBookBool.id))
                }
              }}>
                <>
                  {starBookBool.name}
                  <span style={{position: 'absolute', right: 0}}>{starBookBool.count}/1000</span>
                </>
              </Checkbox>
            </Form.Item>
          ))}
        </Form>

        {buttonVisible ?
          <Button onClick={(event)=>{
            event.stopPropagation();
            setButtonVisible(false)}
          } icon={<PlusOutlined/>} style={{width: '86%', marginLeft: '7%'}}>新建收藏夹
          </Button> :
          <Row style={{width: '86%', marginLeft: '7%'}}>
            <Col flex='auto'>
              <Input
                ref={inputRef} type="text" style={{borderRadius: '6px 0 0 6px'}}
                value={starBookName}
                onClick={(event)=>event.stopPropagation()}
                onChange={(e: any)=>{setStarBookName(e.target.value)}}
                onPressEnter={handleInputConfirm}
              />
            </Col>
            <Col flex='48px' style={{marginLeft: '-1px'}}>
              <Button
                onClick={(event)=>handleInputConfirm(event)}
                style={{borderRadius: '0 6px 6px 0'}}>新建
              </Button>
            </Col>
          </Row>
        }
      </div>

      <div onClick={()=>setButtonVisible(true)}>
        <Button
          disabled={selectIds.sort().toString() === idsStr}
          onClick={addToStarBook} type='primary'
          style={{marginLeft: '30%', width: '40%',marginTop: '20px',}}>确定
        </Button>
      </div>
    </Modal>
  )
}
export default StarModal;
