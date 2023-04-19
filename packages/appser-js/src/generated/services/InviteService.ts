/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class InviteService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getInvitation({
    invitationToken,
  }: {
    invitationToken: string,
  }): CancelablePromise<{
    inviter: {
      id: string;
      name: string;
      avatar?: string;
    };
    currentUser?: {
      id?: string;
      name: string;
      avatar?: string;
    };
    org?: {
      id?: string;
      name: string;
    } | null;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/invitation',
      query: {
        'invitationToken': invitationToken,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public acceptInvitation({
    requestBody,
  }: {
    requestBody: {
      invitationToken: string;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/invite/accept',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
