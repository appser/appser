/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SignupService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public signupByEmail({
    requestBody,
  }: {
    requestBody: {
      invitationToken?: string | null;
      email: string;
      password: string;
      name: string;
    },
  }): CancelablePromise<{
    id: string;
    name?: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/signup/email',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
