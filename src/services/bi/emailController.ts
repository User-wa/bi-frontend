// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getEmail POST /api/email */
export async function getEmailUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEmailUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/email', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** sendEmail GET /api/email/send */
export async function sendEmailUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sendEmailUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/email/send', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
