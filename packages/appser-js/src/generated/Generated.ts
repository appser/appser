/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AccountService } from './services/AccountService';
import { AppService } from './services/AppService';
import { AuthService } from './services/AuthService';
import { DatasetService } from './services/DatasetService';
import { InviteService } from './services/InviteService';
import { OrgService } from './services/OrgService';
import { SignupService } from './services/SignupService';
import { UserService } from './services/UserService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class Generated {

  public readonly account: AccountService;
  public readonly app: AppService;
  public readonly auth: AuthService;
  public readonly dataset: DatasetService;
  public readonly invite: InviteService;
  public readonly org: OrgService;
  public readonly signup: SignupService;
  public readonly user: UserService;

  public readonly request: BaseHttpRequest;

  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? '',
      VERSION: config?.VERSION ?? '1.0.0',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });

    this.account = new AccountService(this.request);
    this.app = new AppService(this.request);
    this.auth = new AuthService(this.request);
    this.dataset = new DatasetService(this.request);
    this.invite = new InviteService(this.request);
    this.org = new OrgService(this.request);
    this.signup = new SignupService(this.request);
    this.user = new UserService(this.request);
  }
}

