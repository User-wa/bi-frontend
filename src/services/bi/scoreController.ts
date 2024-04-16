// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addScore POST /api/user/score/add */
export async function addScoreUsingPost(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/user/score/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** findScore POST /api/user/score/find */
export async function findScoreUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/user/score/find', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** useScore POST /api/user/score/use */
export async function useScoreUsingPost(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/user/score/use', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
