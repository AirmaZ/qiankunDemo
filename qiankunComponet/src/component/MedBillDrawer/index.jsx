import React, { useEffect, useMemo } from 'react';
import { Button, Space, Select, Spin } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import styles from './index.less';

function MedBillDrawer({ width = 860, height = 930, loading = false, title = '未知医疗单', visible, usageList, sdUsageCd, onSelect, ...props }) {
  // 必传参数：visible, onSubmit, onCancel
  function onSubmit() {
    if (props.onSubmit) {
      props.onSubmit();
    }
  }

  function onCancel() {
    if (props.onCancel) {
      props.onCancel();
    }
  }

  useEffect(() => {
    let keydownFn = (e) => {
      if (!visible) {
        return;
      }
      switch (e.code) {
        case 'Escape':
          onCancel();
          break;
        case 'F4':
          onSubmit();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', keydownFn);
    return () => {
      window.removeEventListener('keydown', keydownFn);
    };
  }, [onSubmit, onCancel, visible]);

  const usageListMemo = useMemo(
    function () {
      let result = usageList.filter((item) => item.ctr1?.includes('111') || !item.ctr1).sort((a, b) => a.cd.localeCompare(b.cd, 'zh-CN'));
      // console.log('usageList', toJS(usageList));
      return result || [];
    },
    [usageList],
  );
  return (
    <div className={styles.opdocDrawer} style={{ display: visible ? 'block' : 'none' }}>
      <div className={styles.drawerWrapper}>
        <Spin spinning={loading}>
          <div className={styles.drawerContent} style={{ width, height }}>
            <div className={styles.drawerContentHeader}>
              <Space>
                <DoubleRightOutlined className={styles.DoubleRightOutlined} onClick={onCancel} />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{title}</span>
                <Select
                  style={{ width: '120px' }}
                  value={sdUsageCd}
                  onSelect={(value) => {
                    onSelect({ sdUsageCd: value });
                  }}
                >
                  {usageListMemo?.length > 0 &&
                    usageListMemo.map((item) => {
                      return (
                        <Select.Option key={item.cd} value={item.cd}>
                          {item.na}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Space>
              <Space>
                <Button type="primary" onClick={() => onSubmit()}>
                  确认(F4)
                </Button>
                <Button onClick={() => onCancel()}>取消(Esc)</Button>
              </Space>
            </div>
            <div style={{ position: 'relative', overflow: 'auto' }}>{visible && props.children}</div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default MedBillDrawer;
