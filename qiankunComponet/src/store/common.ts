import { makeAutoObservable } from 'mobx';

interface MedBillProps {
  idSrv?: string;
  idMedord?: string;
  idVismed?: string;
  [key: string]: any;
}
interface CommonStore {
  common: [];
  route: string | null;
  medBillProps: MedBillProps | null;
  qiankunProps: any;
  changeMedBillProps: (params: MedBillProps | null) => void;
  changeQiankunProps: (params: any) => void;
  changeMedBillPath: (params: null | string) => void;
}

const store: CommonStore = {
  common: [],
  route: null,
  medBillProps: null,
  qiankunProps: null,
  changeMedBillProps: function (medBillProps) {
    this.medBillProps = medBillProps;
  },
  changeQiankunProps: function (qiankunProps: any) {
    this.qiankunProps = { ...qiankunProps };
  },
  changeMedBillPath: function (route) {
    this.route = route;
  },
};

const commonStore = makeAutoObservable(store);
export default commonStore;
