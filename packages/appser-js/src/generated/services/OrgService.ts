/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrgService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getOrg({
    orgId,
  }: {
    orgId: string,
  }): CancelablePromise<{
    id: string;
    name: string;
    image?: string;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/orgs/{orgId}',
      path: {
        'orgId': orgId,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public deleteOrg({
    orgId,
  }: {
    orgId: string,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/orgs/{orgId}',
      path: {
        'orgId': orgId,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateOrg({
    orgId,
    requestBody,
  }: {
    orgId: string,
    requestBody: {
      name: string;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/orgs/{orgId}',
      path: {
        'orgId': orgId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public createOrgApp({
    orgId,
    requestBody,
  }: {
    orgId: string,
    requestBody: {
      name?: string;
      tintColor?: '#ccc' | 'blue' | 'green' | '#FF8787' | '#2C2E33' | '#CC5DE8' | '#845EF7' | '#5C7CFA' | '#339AF0' | '#22B8CF' | '#087F5B' | '#E67700' | '#D9480F';
      icon?: 'borderBottom' | 'alignCenter' | 'calibrate' | 'editFade' | 'feed' | 'formatSeparator' | 'magnet' | 'overflow' | 'today';
    },
  }): CancelablePromise<{
    id: string;
    orgId: string;
    name?: string;
    tintColor: string;
    icon: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orgs/{orgId}/apps',
      path: {
        'orgId': orgId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public listOrgApp({
    orgId,
  }: {
    orgId: string,
  }): CancelablePromise<Array<{
    id: string;
    orgId: string;
    name?: string;
    tintColor: string;
    icon: string;
  }>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/orgs/{orgId}/apps',
      path: {
        'orgId': orgId,
      },
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public listOrgPeople({
    orgId,
    kind,
  }: {
    orgId: string,
    kind: 'member' | 'outsideCollaborator' | 'pending' | 'failed',
  }): CancelablePromise<Array<{
    orgId: string;
    status: 'pending' | 'active' | 'failed';
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
      url: '/orgs/{orgId}/people',
      path: {
        'orgId': orgId,
      },
      query: {
        'kind': kind,
      },
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public listOrgRole({
    orgId,
  }: {
    orgId: string,
  }): CancelablePromise<Array<{
    id: string;
    name: string;
    description?: string;
  }>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/orgs/{orgId}/roles',
      path: {
        'orgId': orgId,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public changeOrgPeopleRole({
    orgId,
    userId,
    requestBody,
  }: {
    orgId: string,
    userId: string,
    requestBody: {
      roleId: string;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/orgs/{orgId}/people/{userId}/role',
      path: {
        'orgId': orgId,
        'userId': userId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public removeOrgPeople({
    orgId,
    userId,
  }: {
    orgId: string,
    userId: string,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/orgs/{orgId}/people/{userId}',
      path: {
        'orgId': orgId,
        'userId': userId,
      },
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public createOrgInvitation({
    orgId,
    requestBody,
  }: {
    orgId: string,
    requestBody: {
      roleId: string;
    },
  }): CancelablePromise<{
    invitationToken: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orgs/{orgId}/invitation',
      path: {
        'orgId': orgId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
