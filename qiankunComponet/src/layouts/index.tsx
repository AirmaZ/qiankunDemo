import { IRouteComponentProps, history as umiHistory } from 'umi';
import { ConfigProvider, Layout, Menu } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import styles from './index.less';
import React, { useEffect, useMemo, useState } from 'react';
import { Provider, observer } from 'mobx-react';
import type { MenuProps } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';
// @ts-ignore
import MedBillDemo from '../component/MedBillDemo';
import commonStore from '../store/common';
import routes from '../../config/routes';

const { Content, Footer, Sider } = Layout;
interface LocalLayoutProps {
  showLayout: boolean;
  pathname: string;
}
type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

function deepRoutes(routes: any): MenuItem[] | undefined {
  if (routes && routes.map) {
    return routes.map((item: any, index: number) => {
      // return getItem(<Link to={item.path}>{item.name}</Link>,index,<Icon component={item.icon}/>,deepRoutes(item.routes))
      if (item.hide) {
        return undefined;
      } else {
        return getItem(
          <div
            onClick={() => {
              item.path && umiHistory.push(item.path);
            }}
          >
            {item.name}
          </div>,
          item.path || index,
          <ContainerOutlined />,
          deepRoutes(item.routes),
        );
      }
    });
  } else {
    return undefined;
  }
}

const LocalLayout: React.FC<LocalLayoutProps> = ({ children, showLayout, pathname }) => {
  const [collapsed, setCollapsed] = useState(false);
  const Items = useMemo(() => {
    return deepRoutes(routes[0].routes);
  }, []);
  if (showLayout) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className={styles.logo}>{collapsed ? 'MED' : 'HIHIS医疗单'}</div>
          <Menu theme="dark" mode="inline" items={Items || []} />
        </Sider>
        <Layout className="site-layout">
          {/*<Header className="site-layout-background" style={{ padding: 0 }} />*/}
          <Content style={{ margin: '0' }}>{pathname !== '/home' ? <MedBillDemo>{children}</MedBillDemo> : children}</Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  } else {
    return <>{children}</>;
  }
};

// eslint-disable-next-line
function BaseLayout({ children, location, route, history, match }: IRouteComponentProps) {
  let newChildren = children;

  //这段是记录最后一次的路由信息，用于本地开发的时候，刷新页面memory history路由信息丢失的问题
  useEffect(() => {
    // console.log('umiHistory',umiHistory);
    const handle = umiHistory.listen((a: any) => {
      if (a.pathname && !commonStore.qiankunProps) {
        window.localStorage.setItem('lastPathname', a.pathname);
      }
    });
    const lastPathname = window.localStorage.getItem('lastPathname');
    if (!commonStore.qiankunProps && lastPathname) {
      commonStore.changeMedBillPath(lastPathname);
    }
    return () => {
      handle && handle();
    };
  }, []);

  //检测到如果medBillPath有值，那么就作为memoryHistory的路径推入。用于基座应用加载到制定的医疗单
  useEffect(
    function () {
      if (commonStore.route && commonStore.route !== history.location.pathname) {
        let pathname = `/${commonStore.route}`;
        if (commonStore.route.startsWith('/')) {
          pathname = commonStore.route;
        }
        history.push(pathname);
      }
    },
    [commonStore.route],
  );
  if (commonStore.qiankunProps && !commonStore.medBillProps) {
    return null;
  }
  if (commonStore.qiankunProps) {
    const key = `${commonStore?.medBillProps?.idSrv}_${commonStore?.medBillProps?.idMedord}`;
    console.log('医疗单 commonStore.route', commonStore.route);
    newChildren = React.cloneElement(children, {
      ...children.props,
      ...commonStore.medBillProps,
      key: key,
      onRef: (instance: any) => {
        if (commonStore.qiankunProps?.onRef) {
          commonStore.qiankunProps?.onRef({ type: 'INSTANCE', payload: instance });
        }
      },
    });
  }
  return (
    <ConfigProvider locale={zhCN}>
      <Provider commonStore={commonStore} >
        <div className={styles.layout}>
          <LocalLayout showLayout={!commonStore.qiankunProps} pathname={history.location.pathname}>
            {newChildren}
          </LocalLayout>
        </div>
      </Provider>
    </ConfigProvider>
  );
}
export default observer(BaseLayout);
