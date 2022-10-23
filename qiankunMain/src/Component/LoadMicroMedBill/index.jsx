import { loadMicroApp, prefetchApps } from 'qiankun';
import { memo, useEffect, useState } from 'react';

let localMicroApps = window.localStorage.getItem('localMicroApps');
let host = window.location.host;
let localMicroAppsPath = localMicroApps ? localMicroApps : `//${host}/static/hihis-fe-medBill/index.html`;
/**
 * 预加载医疗单
 */
prefetchApps([
  {
    name: 'hihis-fe-medBill',
    entry: localMicroAppsPath,
  },
]);

const LoadMicroMedBill = ({ id, props, onRef, ...other }) => {
  const [getProps, setGetProps] = useState(null);
  useEffect(function () {
    let app = loadMicroApp({
      name: id,
      entry: localMicroAppsPath,
      container: `#${id}`,
      props: {
        registerGetProps: (fn) => {
          // console.log('getProps fn ',fn)
          setGetProps({ fn: fn });
        },
        onRef: (state) => {
          // console.log(state);
          if (state.type === 'INSTANCE') {
            if (onRef) {
              onRef(state?.payload);
            }
          }
        },
      },
    });
    return () => {
      app.unmount();
    };
  }, [id,onRef]);

  useEffect(() => {
    if (getProps && props && typeof getProps.fn === 'function') {
      getProps.fn(props);
    }
  }, [props, getProps]);

  return <div {...other} id={`${id}`} />;
};

const LoadMicroMedBillCheckPath = (props) => {
  return <LoadMicroMedBill {...props} />;
};
export { localMicroApps };
export default memo(LoadMicroMedBillCheckPath);
