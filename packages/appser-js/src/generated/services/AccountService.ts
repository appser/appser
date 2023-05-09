/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AccountService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getAccount(): CancelablePromise<{
    id: string;
    status: number;
    name: string;
    avatar?: string;
    settings?: {
      timezone: string;
      firstDayOfWeek: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/account',
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateAccountProfile({
    requestBody,
  }: {
    requestBody: {
      name?: string;
      avatar?: string;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/account/profile',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateAccountSettings({
    requestBody,
  }: {
    requestBody: {
      timezone: string;
      firstDayOfWeek: number;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/account/settings',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public changeAccountPassword({
    requestBody,
  }: {
    requestBody: {
      oldPwd: string;
      newPwd: string;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/account/password',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public listAccountPolicy(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/account/policies',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public listAccountOrg(): CancelablePromise<Array<{
    id: string;
    status: number;
    name: string;
  }>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/account/orgs',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public createOrg({
    requestBody,
  }: {
    requestBody: {
      name: string;
    },
  }): CancelablePromise<{
    id: string;
    name: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/account/orgs',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
