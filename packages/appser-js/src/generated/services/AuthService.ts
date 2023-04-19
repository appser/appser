/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getAuthConfig(): CancelablePromise<{
    isInitialize: boolean;
    providers: Array<string>;
    signup: 'always' | 'never' | 'onlyByInvite';
    canForgotPassword: boolean;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/auth/config',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public authByEmail({
    requestBody,
  }: {
    requestBody: {
      email: string;
      password: string;
      setCookie?: boolean;
    },
  }): CancelablePromise<{
    accessToken: string;
    userId: string;
    roleId?: string;
    expiredAt: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/email',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public authRevoke(): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/token/revoke',
    });
  }

}
