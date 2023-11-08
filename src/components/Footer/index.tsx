import {DefaultFooter} from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
import {IconFont} from "@/utils";
import {GithubOutlined} from "@ant-design/icons";

const Footer: React.FC = () => {
  const defaultMessage = '流火开发社区';
  const currentYear = new Date().getFullYear();

  if(location.pathname === '/notification'){
    return null;
  }

  return (

      <DefaultFooter
        style={{
          background: 'none',
        }}
        copyright={`${currentYear} ${defaultMessage}`}
        links={[
          {
            key: 'gitee',
            title: <span style={{margin: '0 8px'}}>
              {/*<IconFont style={{fontSize: 16}} type='icon-gitee'/>流火Antares*/}
              <GithubOutlined style={{fontSize: 18}}/> qk-antares
            </span>,
            href: 'https://github.com/qk-antares',
            blankTarget: true,
          },
          {
            key: 'beian',
            title: <span>豫ICP备2022028525号-1</span>,
            href: 'https://beian.miit.gov.cn/',
            blankTarget: true,
          },
        ]}
      />
  );
};
export default Footer;
