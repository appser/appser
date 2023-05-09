/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UserService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getUser({
    userId,
  }: {
    userId: string,
  }): CancelablePromise<{
    id: string;
    status: number;
    name: string;
    avatar?: string;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{userId}',
      path: {
        'userId': userId,
      },
    });
  }

}
