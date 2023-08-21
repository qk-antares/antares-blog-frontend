import {Button, Card, Col, Row, Steps} from 'antd';
import React, {useRef} from 'react';
import Step1 from "@/pages/Note/Create/components/Step1";
import {CheckCircleOutlined, DoubleRightOutlined, FormOutlined} from "@ant-design/icons";

const CreateNote: React.FC = () => {
  const childRef = useRef(null);

  return (
    <Card title="创建文章" style={{borderRadius: 8}}>
      <Row>
        <Col span={5}>
          <Steps
            style={{maxHeight: 800,height: '100%', margin: '16px'}}
            direction="vertical"
            current={0}
            items={[
              {
                title: '填写文章信息',
                icon: <FormOutlined />,
              },
              {
                title: '去写文章',
                icon: <CheckCircleOutlined />,
              },
            ]}
          />
        </Col>
        <Col span={19}>
          <Row justify="space-around" align="middle">
            <Col span={19}>
              <Step1 ref={childRef}/>
            </Col>
            <Col span={5}>
              <Button
                style={{height: 96, marginLeft: '40%'}}
                size="large"
                icon={<DoubleRightOutlined style={{fontSize: 24}} onClick={()=> {
                  // @ts-ignore
                  childRef.current?.createArticle()
                }}/>}>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default CreateNote;
