import commonStore from '@/store/common';
let disposer: any = null;

export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {
    console.log('医疗单 bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props: any) {
    /*获取医疗单的props*/
    disposer = props.registerGetProps(function (medBillData: any) {
      if (medBillData) {
        console.log('微应用获取props', medBillData);
        //这里必须要先切换路由，再设置值，否则会有医疗单数据和医疗单路由对不上的问题
        if (medBillData.route) {
          commonStore.changeMedBillPath(medBillData.route);
        }
        commonStore.changeMedBillProps({ ...medBillData });
      }
    });
    /*获取医疗单的props*/
    // const medBillData = props?.getMedBillData();
    // console.log('----->',medBillData);
    // if(medBillData){
    //   commonStore.changeMedBillProps(medBillData)
    // }

    /*获取qiankun的props*/
    console.log('获取qiankun的props');
    commonStore.changeQiankunProps(props);
    /*获取qiankun的props*/

    // props.onGlobalStateChange((state:any, prev:any) => {
    //   // state: 变更后的状态; prev 变更前的状态
    //   console.log(state, prev);
    // });
    props.onRef?.({
      type: 'MESSAGE',
      payload: '医疗单加载完毕！',
    });
    console.log('医疗单 mount', props);
  },
  // 应用卸载之后触发
  async unmount(props: any) {
    //注销registerGetProps
    if (disposer) {
      disposer();
    }
    console.log('医疗单 unmount', props);
    commonStore.changeMedBillProps(null);
  },
};
