/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AppService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getApp({
    appId,
  }: {
    appId: string,
  }): CancelablePromise<{
    id: string;
    name?: string;
    tintColor: string;
    icon: string;
    orgId: string;
    datasets: Array<{
      id: string;
      name?: string;
      views: Array<{
        id: string;
        type: 'sheet';
        name?: string;
      }>;
    }>;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/apps/{appId}',
      path: {
        'appId': appId,
      },
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public deleteApp({
    appId,
  }: {
    appId: string,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/apps/{appId}',
      path: {
        'appId': appId,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateApp({
    appId,
    requestBody,
  }: {
    appId: string,
    requestBody: {
      name?: string;
      tintColor?: '#ccc' | 'blue' | 'green' | '#FF8787' | '#2C2E33' | '#CC5DE8' | '#845EF7' | '#5C7CFA' | '#339AF0' | '#22B8CF' | '#087F5B' | '#E67700' | '#D9480F';
      icon?: 'borderBottom' | 'alignCenter' | 'calibrate' | 'editFade' | 'feed' | 'formatSeparator' | 'magnet' | 'overflow' | 'today';
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/apps/{appId}',
      path: {
        'appId': appId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public listAppPeople({
    appId,
  }: {
    appId: string,
  }): CancelablePromise<Array<{
    orgId: string;
    appId: string;
    status: number;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    role: {
      id: string;
      name: string;
    };
  }>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/apps/{appId}/people',
      path: {
        'appId': appId,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public addAppPeople({
    appId,
    requestBody,
  }: {
    appId: string,
    requestBody: {
      userId: string;
      roleId: string;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/apps/{appId}/people',
      path: {
        'appId': appId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Created
   * @throws ApiError
   */
  public createDataset({
    appId,
  }: {
    appId: string,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/apps/{appId}/datasets',
      path: {
        'appId': appId,
      },
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public listAppRole({
    appId,
  }: {
    appId: string,
  }): CancelablePromise<Array<{
    id: string;
    name: string;
    description?: string;
  }>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/apps/{appId}/roles',
      path: {
        'appId': appId,
      },
    });
  }

}
