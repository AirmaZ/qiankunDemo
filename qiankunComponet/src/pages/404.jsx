import React from 'react';
import { Alert } from 'antd';

function NotFindPage({ location }) {
  return (
    <div>
      <Alert message="未找到医疗单" description={`该服务项目未找到匹配的医疗单！\n 医疗单路径：${location.pathname}`} type="error" showIcon />
    </div>
  );
}

export default NotFindPage;
