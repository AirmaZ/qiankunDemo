//ts-nocheck
import React, { useEffect, useState } from 'react';
import { Form, Checkbox, Row, Col, DatePicker } from 'antd';
import { Limitp } from '@/conf';
import { getSysParams, getDics } from './api';
import { Label } from '@/component';
import moment from 'moment';
import styles from './index.less';

/**医疗单编码 sdSrvformCd
 * 医疗就诊流程 sdVistpCd
 * 勾选事件的回调 onChange
 * 预开回显参数 commonValue(只有保存的标志为true才需要传)
 */
export interface commonBoxProps {
  sdSrvformCd: string; // 用来查询是哪个医疗单调用的
  sdVistpCd: string; //只有门诊流程才展示预开
  onChange: (value: any) => any; //返回勾选详情及其表单对应的值 例如是否勾选预开false 预开时间 xxx(时间戳)
  commonValue?: {
    //回显参数
    fgPreview?: boolean; //是否勾选预开
    preOpenTime?: any; //预开时间(时间戳)
  };
}

const MedBillCommonBox: React.FC<commonBoxProps> = (props) => {
  const { onChange, sdSrvformCd, sdVistpCd } = props;
  const [form] = Form.useForm();
  const [preOpenVisible, setPreOpenVisible] = useState(false); //是否支持预开
  // const [diseaseVisible, setDiseaseVisible] = useState(true);//是否支持规病
  const [isOpen, setIsOpen] = useState(false); //是否勾选预开
  const [lastTime, setLastTime] = useState(''); //最晚缴费时间
  const [efftiveDay, setEffectiveDay] = useState(0); //结算有效天数
  const disabledDate = (current: any) => {
    //预开不可选择的时间
    return current && current < moment().endOf('day');
  };

  const init = async () => {
    /**判断医疗单是否支持预开*/
    if (sdVistpCd === '111') {
      const dic = await getDics({ dictIds: ['hi.his.srvform'] });
      const srvList = dic['hi.his.srvform'];
      const srvForm = srvList.find((it: { cd: string }) => it.cd === sdSrvformCd);
      debugger;
      if (srvForm?.ctr10 && srvForm?.ctr10 === '1') {
        debugger;
        //该医疗单支持预开 获取结算有效天数
        setPreOpenVisible(true);
        const params = {
          codes: [
            {
              code: 'mzgl_jsyxts', // 结算有效天数
              limit: Limitp.sy,
            },
          ],
          functionCd: '15', //门诊管理cd
        };
        const data = await getSysParams(params);
        setEffectiveDay(Number(data.mzgl_jsyxts));
      }
    }
  };

  /**计算最晚缴费时间*/
  const calcTime = (time: any, check: boolean) => {
    const newTime = moment(time)
      .add(efftiveDay + 1, 'days')
      .format('YYYY-MM-DD HH:mm:ss');
    setLastTime(newTime);
    const obj = {
      fgPreview: check ? '1' : '0',
      preOpenTime: moment(time).valueOf(),
    };
    onChange && onChange(obj ?? null);
  };
  /**预开事件*/
  const checkPreOpen = (check: boolean) => {
    setIsOpen(check);
    if (check) {
      const time = moment().startOf('day').add(1, 'days');
      form.setFieldsValue({ time });
      calcTime(time, check);
    }
  };

  useEffect(() => {
    init().catch((err) => {
      console.log(err);
    });
  }, []);
  useEffect(() => {
    const { commonValue } = props;
    if (JSON.stringify(commonValue) !== '{}') {
      if (commonValue?.preOpenTime) {
        //回显设置预开时间 计算最晚缴费时间
        calcTime(commonValue.preOpenTime, commonValue?.fgPreview || false);
        form.setFieldsValue({ time: moment(commonValue.preOpenTime, 'x') });
      }
      setIsOpen(commonValue?.fgPreview || false);
    }
  }, [JSON.stringify(props?.commonValue) !== '{}']);
  return (
    <div className={styles['common-box']}>
      <div className={styles['mb']}>
        <Checkbox>规病</Checkbox>
        {preOpenVisible && (
          <Checkbox checked={isOpen} onChange={(e) => checkPreOpen(e.target.checked)}>
            预开
          </Checkbox>
        )}
      </div>
      <Form form={form}>
        {isOpen && (
          <Row gutter={10}>
            <Col style={{ marginTop: 8 }}>
              <Form.Item name="time" label={<Label style={{ width: 85 }}>预开时间</Label>} rules={[{ required: isOpen, message: '预开时间必填' }]}>
                <DatePicker
                  showTime
                  allowClear={false}
                  disabledDate={disabledDate}
                  onChange={(date) => {
                    calcTime(date, isOpen);
                  }}
                />
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: 10 }}>
              <span className={styles['tip-color']}>{`请提醒患者在预开时间${efftiveDay}天内缴费！`}</span>
              <br />
              <span className={styles['tip-color']}>{`最晚缴费时间：${lastTime}`}</span>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
};
export default MedBillCommonBox;
