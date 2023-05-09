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
    fields: Record<string, (({
      type: 'numId';
      options?: {
        dynamicDefault?: 'snowflakeId';
      };
    } | {
      type: 'checkbox';
      options?: any;
    } | {
      type: 'date';
      options?: {
        dynamicDefault?: 'now';
        calendar?: 'gregory' | 'chinese' | 'hebrew' | 'islamic' | 'coptic' | 'indian' | 'ethiopic' | 'iso8601' | 'japanese' | 'persian';
        dateStyle?: 'full' | 'long' | 'medium' | 'short';
        timeStyle?: 'full' | 'long' | 'medium' | 'short';
      };
    } | {
      type: 'email';
      options?: any;
    } | {
      type: 'multipleSelect';
      options: {
        items: Array<{
          id?: number;
          name: string;
        }>;
      };
    } | {
      type: 'number';
      options: {
        precision?: number;
        allowNegative?: boolean;
      };
    } | {
      type: 'simpleText';
      options?: any;
    } | {
      type: 'singleSelect';
      options: {
        items: Array<{
          id?: number;
          name: string;
        }>;
      };
    } | {
      type: 'url';
      options?: any;
    }) & {
      name?: string;
      title?: string;
      required?: boolean;
      locked?: boolean;
      deletedAt?: string;
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
  public addField({
    datasetId,
    requestBody,
  }: {
    datasetId: string,
    requestBody: (({
      type: 'numId';
      options?: {
        dynamicDefault?: 'snowflakeId';
      };
    } | {
      type: 'checkbox';
      options?: any;
    } | {
      type: 'date';
      options?: {
        dynamicDefault?: 'now';
        calendar?: 'gregory' | 'chinese' | 'hebrew' | 'islamic' | 'coptic' | 'indian' | 'ethiopic' | 'iso8601' | 'japanese' | 'persian';
        dateStyle?: 'full' | 'long' | 'medium' | 'short';
        timeStyle?: 'full' | 'long' | 'medium' | 'short';
      };
    } | {
      type: 'email';
      options?: any;
    } | {
      type: 'multipleSelect';
      options: {
        items: Array<{
          id?: number;
          name: string;
        }>;
      };
    } | {
      type: 'number';
      options: {
        precision?: number;
        allowNegative?: boolean;
      };
    } | {
      type: 'simpleText';
      options?: any;
    } | {
      type: 'singleSelect';
      options: {
        items: Array<{
          id?: number;
          name: string;
        }>;
      };
    } | {
      type: 'url';
      options?: any;
    }) & {
      title?: string;
      appendViewId?: string;
    }),
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/datasets/{datasetId}/fields',
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
  public deleteField({
    datasetId,
    fieldName,
  }: {
    datasetId: string,
    fieldName: string,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/datasets/{datasetId}/fields/{fieldName}',
      path: {
        'datasetId': datasetId,
        'fieldName': fieldName,
      },
    });
  }

  /**
   * @returns void
   * @throws ApiError
   */
  public updateField({
    datasetId,
    fieldName,
    requestBody,
  }: {
    datasetId: string,
    fieldName: string,
    requestBody: (({
      type: 'numId';
      options?: {
        dynamicDefault?: 'snowflakeId';
      };
    } | {
      type: 'checkbox';
      options?: any;
    } | {
      type: 'date';
      options?: {
        dynamicDefault?: 'now';
        calendar?: 'gregory' | 'chinese' | 'hebrew' | 'islamic' | 'coptic' | 'indian' | 'ethiopic' | 'iso8601' | 'japanese' | 'persian';
        dateStyle?: 'full' | 'long' | 'medium' | 'short';
        timeStyle?: 'full' | 'long' | 'medium' | 'short';
      };
    } | {
      type: 'email';
      options?: any;
    } | {
      type: 'multipleSelect';
      options: {
        items: Array<{
          id?: number;
          name: string;
        }>;
      };
    } | {
      type: 'number';
      options: {
        precision?: number;
        allowNegative?: boolean;
      };
    } | {
      type: 'simpleText';
      options?: any;
    } | {
      type: 'singleSelect';
      options: {
        items: Array<{
          id?: number;
          name: string;
        }>;
      };
    } | {
      type: 'url';
      options?: any;
    }) & {
      title?: string;
    }),
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/datasets/{datasetId}/fields/{fieldName}',
      path: {
        'datasetId': datasetId,
        'fieldName': fieldName,
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
    type: 'sheet';
    field: Record<string, {
      width?: number;
      selected?: boolean;
    }>;
    fields: Array<string>;
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
    stickyField: number;
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
      field?: Record<string, {
        width?: number;
        selected?: boolean;
      }>;
      fields?: Array<string>;
      stickyField?: number;
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
    requestBody: ((string | number | boolean | 'null' | null) | Record<string, ((string | number | boolean | 'null' | null) | Record<string, any>)>),
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
      sorts?: Array<string>;
      selects?: Array<string>;
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
    requestBody: ((string | number | boolean | 'null' | null) | Record<string, ((string | number | boolean | 'null' | null) | Record<string, any>)>),
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
