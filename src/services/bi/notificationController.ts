// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addNotification POST /api/notification/add */
export async function addNotificationUsingPost(
  body: API.NotificationAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/notification/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteNotification POST /api/notification/delete */
export async function deleteNotificationUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/notification/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getNotificationVO GET /api/notification/get/vo */
export async function getNotificationVoUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotificationVOUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseNotificationVO_>('/api/notification/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listNotificationByPage POST /api/notification/list/page/vo */
export async function listNotificationByPageUsingPost(
  body: API.NotificationQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageNotification_>('/api/notification/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyNotificationByPage POST /api/notification/my/list/page/vo */
export async function listMyNotificationByPageUsingPost(
  body: API.NotificationQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageNotification_>('/api/notification/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateNotification POST /api/notification/update */
export async function updateNotificationUsingPost(
  body: API.NotificationUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/notification/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
