import request from '@/utils/request';

/**
 * 获取系统参数
 */
export async function getSysParams(params: any) {
  return request({ serviceId: 'opdoc.dicRpc', serverMethod: 'getSysParams' }, params);
}
/**
 * 批量获取字典
 */
export async function getDics(params: any) {
  return request({ serviceId: 'opdoc.dicRpc', serverMethod: 'getDicts' }, params);
}
