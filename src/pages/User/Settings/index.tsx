import React, {useLayoutEffect, useRef, useState} from 'react';
import {Card, Menu, MenuProps} from 'antd';
import BaseView from './components/Base';
import BindingView from './components/Binding';
import SecurityView from './components/Security';
import {ContainerOutlined, DesktopOutlined, PieChartOutlined} from "@ant-design/icons";
import {useEmotionCss} from "@ant-design/use-emotion-css";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: 'group',
): MenuItem {
  return {key, icon, children, label, type} as MenuItem;
}

type SettingsStateKeys = 'base' | 'security' | 'binding';

type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Settings: React.FC = () => {
  const menuMap: Record<string, React.ReactNode> = {
    base: '基本设置',
    security: '安全设置',
    binding: '账号绑定',
    notification: '新消息通知',
  };

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });
  const dom = useRef<HTMLDivElement>();

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig({ ...initConfig, mode: mode as SettingsState['mode'] });
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  const renderChildren = () => {
    const { selectKey } = initConfig;
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView />;
      case 'binding':
        return <BindingView />;
      default:
        return null;
    }
  };

  const items: MenuItem[] = [
    getItem('基本设置', 'base', <PieChartOutlined />),
    getItem('安全设置', 'security', <DesktopOutlined />),
    getItem('账号绑定', 'binding', <ContainerOutlined />),
  ];

  const mainClass = useEmotionCss(() => {
    return {
      display: 'flex',
      width: '100%',
      height: '100%',
      paddingTop: '16px',
      paddingBottom: '16px',
      backgroundColor: 'white',
    }
  })

  const rightContent = useEmotionCss(() => {
    return {
      flex: '1',
      padding: '8px 40px',
    }
  });

  const title = useEmotionCss(() => {
    return {
      marginBottom: "12px",
      fontWeight: 500,
      fontSize: "20px",
      lineHeight: "28px"
    }
  })

  return (
    <Card style={{width: 1080, height: 480, margin: '0 auto'}}>
      <div className={mainClass}
       ref={(ref) => {
         if (ref) {
           dom.current = ref;
         }
       }}
      >
        <div>
          <Menu
            style={{width: 224, height: '100%'}}
            mode={initConfig.mode}
            selectedKeys={[initConfig.selectKey]}
            items={items}
            onClick={({ key }) => {
              setInitConfig({
                ...initConfig,
                selectKey: key as SettingsStateKeys,
              });
            }}
          />
        </div>
        <div className={rightContent}>
          <div className={title}>{menuMap[initConfig.selectKey]}</div>
          {renderChildren()}
        </div>
      </div>
    </Card>
  );
};
export default Settings;
