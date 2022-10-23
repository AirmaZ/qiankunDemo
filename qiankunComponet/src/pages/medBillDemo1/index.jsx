import React, { useEffect } from 'react';
import styles from './index.less';

function MedBillDemo1(props) {
  console.log('MedBillDemo1-------->', props);
  useEffect(() => {
    if (props.onRef) {
      props.onRef({
        onSave: async () => {
          console.log('save done !');
        },
      });
    }
  }, [props.onRef]);
  // useEffect(() => {
  //   props.medBillFrameFn.setLoading(true);
  //   setTimeout(() => {
  //     props.medBillFrameFn.setLoading(false);
  //     props.medBillFrameFn.setSdUsageCd('11');
  //   }, 1000);
  // }, []);
  return (
    <div className={styles.color}>
      我是MedBillDemo 1 <input />
      <div>{props?.idSrv}</div>
      <div>{props?.idMedord}</div>
    </div>
  );
}

export default MedBillDemo1;
