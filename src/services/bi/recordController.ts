// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addRecord POST /api/record/add */
export async function addRecordUsingPost(
  body: API.RecordAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/record/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteRecord POST /api/record/delete */
export async function deleteRecordUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/record/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listRecordByPage GET /api/record/list */
export async function listRecordByPageUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListRecordVO_>('/api/record/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** listMyRecordByPage POST /api/record/my/list/page/vo */
export async function listMyRecordByPageUsingPost(
  body: API.RecordQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageRecord_>('/api/record/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
