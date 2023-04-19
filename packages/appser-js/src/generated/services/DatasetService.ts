/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DatasetService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getDataset({
    datasetId,
  }: {
    datasetId: string,
  }): CancelablePromise<{
    id: string;
    appId: string;
    name?: string;
    pos?: number;
    column: Record<string, (({
      field: 'checkbox';
      options?: any;
    } | {
      field: 'date';
      options?: {
        dynamicDefault?: 'now';
        calendar?: 'gregory' | 'chinese' | 'hebrew' | 'islamic' | 'coptic' | 'indian' | 'ethiopic' | 'iso8601' | 'japanese' | 'persian';
        dateStyle?: 'full' | 'long' | 'medium' | 'short';
        timeStyle?: 'full' | 'long' | 'medium' | 'short';
      };
    } | {
      field: 'email';
      options?: any;
    } | {
      field: 'multipleSelect';
      options: {
        items: Array<{
          id: number;
          name: string;
        }>;
      };
    } | {
      field: 'number';
      options?: {
        precision: number;
        allowNegative: boolean;
      };
    } | {
      field: 'numId';
      options?: {
        dynamicDefault?: 'snowflakeId';
      };
    } | {
      field: 'simpleText';
      options?: {
        default?: string;
      };
    } | {
      field: 'singleSelect';
      options: {
        items: Array<{
          id: number;
          name: string;
        }>;
      };
    } | {
      field: 'url';
      options?: any;
    }) & {
      title?: string;
      isRequired?: boolean;
      isLocked?: boolean;
    })>;
    createdAt: string;
    updatedAt: string;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/datasets/{datasetId}',
      path: {
        'datasetId': datasetId,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateDataset({
    datasetId,
    requestBody,
  }: {
    datasetId: string,
    requestBody: {
      name?: string;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/datasets/{datasetId}',
      path: {
        'datasetId': datasetId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Created
   * @throws ApiError
   */
  public addColumn({
    datasetId,
    requestBody,
  }: {
    datasetId: string,
    requestBody: {
      title?: string;
      field: 'checkbox' | 'date' | 'email' | 'multipleSelect' | 'number' | 'numId' | 'richText' | 'simpleText' | 'singleSelect' | 'url';
      options?: Record<string, any>;
      currentViewId?: string;
    },
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/datasets/{datasetId}/columns',
      path: {
        'datasetId': datasetId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public deleteColumn({
    datasetId,
    columnName,
  }: {
    datasetId: string,
    columnName: string,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/datasets/{datasetId}/columns/{columnName}',
      path: {
        'datasetId': datasetId,
        'columnName': columnName,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateColumn({
    datasetId,
    columnName,
    requestBody,
  }: {
    datasetId: string,
    columnName: string,
    requestBody: {
      title?: string;
      options?: Record<string, any>;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/datasets/{datasetId}/columns/{columnName}',
      path: {
        'datasetId': datasetId,
        'columnName': columnName,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public resetColumn({
    datasetId,
    columnName,
    requestBody,
  }: {
    datasetId: string,
    columnName: string,
    requestBody: {
      title?: string;
      field?: any;
      options?: any;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/datasets/{datasetId}/columns/{columnName}',
      path: {
        'datasetId': datasetId,
        'columnName': columnName,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getView({
    datasetId,
    viewId,
  }: {
    datasetId: string,
    viewId: string,
  }): CancelablePromise<{
    id: string;
    name?: string;
    type: 'grid';
    column: Record<string, {
      width?: number;
    }>;
    sorts: Array<string>;
    filter?: {
      and?: Array<Record<string, {
        eq?: (string | number);
        neq?: (string | number);
        gt?: (string | number);
        gte?: (string | number);
        lt?: (string | number);
        lte?: (string | number);
        in?: Array<(string | number)>;
        nin?: Array<(string | number)>;
        like?: string;
        notLike?: string;
        between?: string;
        notBetween?: string;
        null?: boolean;
        notNull?: boolean;
      }>>;
      or?: Array<Record<string, {
        eq?: (string | number);
        neq?: (string | number);
        gt?: (string | number);
        gte?: (string | number);
        lt?: (string | number);
        lte?: (string | number);
        in?: Array<(string | number)>;
        nin?: Array<(string | number)>;
        like?: string;
        notLike?: string;
        between?: string;
        notBetween?: string;
        null?: boolean;
        notNull?: boolean;
      }>>;
    };
    selects: Array<string>;
    stickyColumn: number;
    appId: string;
    datasetId: string;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/datasets/{datasetId}/views/{viewId}',
      path: {
        'datasetId': datasetId,
        'viewId': viewId,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateView({
    datasetId,
    viewId,
    requestBody,
  }: {
    datasetId: string,
    viewId: string,
    requestBody: {
      name?: string;
      sorts?: Array<string>;
      filter?: {
        and?: Array<Record<string, {
          eq?: (string | number);
          neq?: (string | number);
          gt?: (string | number);
          gte?: (string | number);
          lt?: (string | number);
          lte?: (string | number);
          in?: Array<(string | number)>;
          nin?: Array<(string | number)>;
          like?: string;
          notLike?: string;
          between?: string;
          notBetween?: string;
          null?: boolean;
          notNull?: boolean;
        }>>;
        or?: Array<Record<string, {
          eq?: (string | number);
          neq?: (string | number);
          gt?: (string | number);
          gte?: (string | number);
          lt?: (string | number);
          lte?: (string | number);
          in?: Array<(string | number)>;
          nin?: Array<(string | number)>;
          like?: string;
          notLike?: string;
          between?: string;
          notBetween?: string;
          null?: boolean;
          notNull?: boolean;
        }>>;
      };
      stickyColumn?: number;
      column?: Record<string, {
        width?: number;
      }>;
    },
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/datasets/{datasetId}/views/{viewId}',
      path: {
        'datasetId': datasetId,
        'viewId': viewId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public deleteView({
    datasetId,
    viewId,
  }: {
    datasetId: string,
    viewId: string,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/datasets/{datasetId}/views/{viewId}',
      path: {
        'datasetId': datasetId,
        'viewId': viewId,
      },
    });
  }

  /**
   * @returns any Created
   * @throws ApiError
   */
  public addView({
    datasetId,
    requestBody,
  }: {
    datasetId: string,
    requestBody: {
      name?: string;
    },
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/datasets/{datasetId}/views',
      path: {
        'datasetId': datasetId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Created
   * @throws ApiError
   */
  public addRecord({
    datasetId,
    viewId,
    requestBody,
  }: {
    datasetId: string,
    viewId: string,
    requestBody: Record<string, any>,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/datasets/{datasetId}/views/{viewId}/records',
      path: {
        'datasetId': datasetId,
        'viewId': viewId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public queryRecord({
    datasetId,
    viewId,
    requestBody,
  }: {
    datasetId: string,
    viewId: string,
    requestBody: {
      filter: {
        and?: Array<Record<string, {
          eq?: (string | number);
          neq?: (string | number);
          gt?: (string | number);
          gte?: (string | number);
          lt?: (string | number);
          lte?: (string | number);
          in?: Array<(string | number)>;
          nin?: Array<(string | number)>;
          like?: string;
          notLike?: string;
          between?: string;
          notBetween?: string;
          null?: boolean;
          notNull?: boolean;
        }>>;
        or?: Array<Record<string, {
          eq?: (string | number);
          neq?: (string | number);
          gt?: (string | number);
          gte?: (string | number);
          lt?: (string | number);
          lte?: (string | number);
          in?: Array<(string | number)>;
          nin?: Array<(string | number)>;
          like?: string;
          notLike?: string;
          between?: string;
          notBetween?: string;
          null?: boolean;
          notNull?: boolean;
        }>>;
      };
      sorts?: (string | Array<string>);
      selects?: (string | Array<string>);
      pageSize?: number;
      pageToken?: number;
    },
  }): CancelablePromise<{
    records: Array<Record<string, any>>;
    pageToken?: number;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/datasets/{datasetId}/views/{viewId}/records/query',
      path: {
        'datasetId': datasetId,
        'viewId': viewId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public getRecord({
    datasetId,
    viewId,
    recordId,
  }: {
    datasetId: string,
    viewId: string,
    recordId: string,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/datasets/{datasetId}/views/{viewId}/records/{recordId}',
      path: {
        'datasetId': datasetId,
        'viewId': viewId,
        'recordId': recordId,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateRecord({
    datasetId,
    viewId,
    recordId,
    requestBody,
  }: {
    datasetId: string,
    viewId: string,
    recordId: string,
    requestBody: Record<string, any>,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/datasets/{datasetId}/views/{viewId}/records/{recordId}',
      path: {
        'datasetId': datasetId,
        'viewId': viewId,
        'recordId': recordId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * @returns any Default Response
   * @throws ApiError
   */
  public deleteRecord({
    datasetId,
    recordId,
  }: {
    datasetId: string,
    recordId: string,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/datasets/{datasetId}/records/{recordId}',
      path: {
        'datasetId': datasetId,
        'recordId': recordId,
      },
    });
  }

}
