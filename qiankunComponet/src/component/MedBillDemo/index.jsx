import React, { useState, useRef, useMemo } from 'react';
import { Button, message, Card, Input, Checkbox } from 'antd';
import MedBillDrawer from '../MedBillDrawer';

function MedBillDemo({ children }) {
  const medBillRef = useRef();
  const [checkType, setCheck] = useState(window.localStorage.getItem('checkType'));
  const [medBillMockProps, setMedBillMockProps] = useState(window.localStorage.getItem('medBillMockProps'));
  const [medBillMockProps2, setMedBillMockProps2] = useState(window.localStorage.getItem('medBillMockProps2'));
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sdUsageCd, setSdUsageCd] = useState('1');
  const [usageList] = useState([]);
  const [{ height, width }, setHeightAndWidth] = useState({
    height: window.innerHeight - 100,
    width: 800,
  });
  function onSubmit() {
    setLoading(true);
    medBillRef.current
      ?.onSave()
      .then((res) => {
        message.success(res.msg || '保存成功');
      })
      .catch((err) => {
        message.error(err.msg || '保存失败');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onChange() {
    setVisible(!visible);
  }

  const medBillProps = useMemo(() => {
    let defaultProps = {};
    try {
      if (checkType === 'medBillMockProps') {
        defaultProps = JSON.parse(medBillMockProps);
      } else {
        defaultProps = JSON.parse(medBillMockProps2);
      }
    } catch (e) {
      console.error(e);
    }
    const key = `${defaultProps?.idSrv}_${defaultProps?.idMedord}`;
    return {
      ...defaultProps,
      onRef: (instance) => {
        medBillRef.current = instance;
      },
      sdUsageCd: sdUsageCd,
      key: key,
      medBillFrameFn: {
        onClose: () => {
          setVisible(false);
        },
        setLoading,
        setHeightAndWidth,
        setSdUsageCd,
        setChangeWarning: () => {
          console.log('setChangeWarning');
        },
      },
    };
  }, [medBillMockProps, medBillMockProps2, checkType, setVisible, setLoading, setHeightAndWidth, setSdUsageCd, sdUsageCd]);
  const newChildren = useMemo(() => {
    return React.cloneElement(children, {
      ...children.props,
      ...medBillProps,
    });
  }, [children, medBillProps]);
  // const newChildren = React.cloneElement(children, {
  //       ...children.props,
  //       ...medBillProps,
  //     });
  // console.log(children);
  return (
    <div style={{ padding: '0 20px' }}>
      <Button onClick={() => onChange()}>{visible ? '隐藏' : '显示'}</Button>
      <MedBillDrawer
        usageList={usageList}
        width={width}
        height={height}
        visible={visible}
        onSubmit={() => onSubmit()}
        onCancel={() => setVisible(false)}
        loading={loading}
        sdUsageCd={sdUsageCd}
        onSelect={({ sdUsageCd }) => {
          setSdUsageCd(sdUsageCd);
        }}
      >
        {newChildren}
      </MedBillDrawer>
      <Card
        title="请填写默认的props"
        style={{ width: 300, position: 'absolute', right: 20, top: 30 }}
        extra={
          <Checkbox
            checked={checkType === 'medBillMockProps'}
            onChange={(e) => {
              if (e.target.checked) {
                window.localStorage.setItem('checkType', 'medBillMockProps');
                setCheck('medBillMockProps');
              } else {
                window.localStorage.setItem('checkType', 'medBillMockProps2');
                setCheck('medBillMockProps2');
              }
            }}
          />
        }
      >
        <Input.TextArea
          value={medBillMockProps}
          onChange={(e) => {
            setMedBillMockProps(e.target.value);
            window.localStorage.setItem('medBillMockProps', e.target.value);
          }}
          autoSize={{ minRows: 4 }}
        />
      </Card>
      <Card
        title="请填写默认的props2"
        style={{ width: 300, position: 'absolute', right: 20, top: 400 }}
        extra={
          <Checkbox
            checked={checkType === 'medBillMockProps2'}
            onChange={(e) => {
              if (e.target.checked) {
                window.localStorage.setItem('checkType', 'medBillMockProps2');
                setCheck('medBillMockProps2');
              } else {
                window.localStorage.setItem('checkType', 'medBillMockProps');
                setCheck('medBillMockProps');
              }
            }}
          />
        }
      >
        <Input.TextArea
          value={medBillMockProps2}
          onChange={(e) => {
            setMedBillMockProps2(e.target.value);
            window.localStorage.setItem('medBillMockProps2', e.target.value);
          }}
          autoSize={{ minRows: 4 }}
        />
      </Card>
    </div>
  );
}

export default MedBillDemo;
