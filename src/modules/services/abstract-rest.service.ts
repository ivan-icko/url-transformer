import { HttpStatus } from '@nestjs/common';
import { LoggerService } from '../../common/modules/logger/logger.service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { clone } from '../../common/utils/object.util';
import { GENERIC_REST_EXCEPTION } from '../../common/constants/error-codes';
import { RestServiceException } from '../../common/exceptions/rest-service.exception';
import { GET, POST, SERVICES_CONFIG } from '../../common/constants/general';

export abstract class AbstractRestService {
  protected svcName: string;
  private readonly noLogLiteral =
    'RESPONSE: Not logged. Check service configuration';

  protected constructor(
    protected readonly httpService: HttpService,
    protected readonly logger: LoggerService,
    protected readonly configService: ConfigService,
  ) {}

  /**
   *
   * @param svcUrl
   * @param method
   * @param body
   * @param perRequestAxios
   * @param errorCode
   */
  protected async execute(
    svcUrl: string,
    method = GET,
    body: any = {},
    perRequestAxios: AxiosRequestConfig = {},
    errorCode = '',
  ): Promise<any> {
    switch (method) {
      case GET:
        return this.get(svcUrl, perRequestAxios, errorCode);
      case POST:
        return this.post(svcUrl, body, perRequestAxios, errorCode);
      default:
        return this.get(svcUrl, perRequestAxios, errorCode);
    }
  }

  protected getConfig(): any {
    return this.configService.get(SERVICES_CONFIG)[this.svcName];
  }

  /**
   *
   * @param svcUrl
   * @param perRequestAxios
   */
  private prepareData(
    svcUrl: string,
    perRequestAxios: AxiosRequestConfig = {},
  ) {
    const cfg = this.getConfig();
    const { axiosConfig, endpoint } = cfg;
    const apiUrl = `${endpoint}${svcUrl}`;
    const fullAxiosConfig: AxiosRequestConfig = clone(
      axiosConfig,
      perRequestAxios,
    );
    if (cfg.proxy?.port > 0) {
      fullAxiosConfig.proxy = cfg.proxy;
    }
    return {
      apiUrl,
      fullAxiosConfig,
      cfg,
    };
  }

  /**
   *
   * @param svcUrl
   * @param perRequestAxios
   * @param errorCode
   */
  protected async get<T = any>(
    svcUrl: string,
    perRequestAxios: AxiosRequestConfig = {},
    errorCode = '',
  ): Promise<AxiosResponse<T>> {
    const { apiUrl, fullAxiosConfig, cfg } = this.prepareData(
      svcUrl,
      perRequestAxios,
    );

    this.logger.info(
      `${this.constructor.name} | SERVICE_NAME:${this.svcName} | METHOD:GET | ` +
        `URL:${apiUrl} | AXIOS_HEADERS:${JSON.stringify(
          fullAxiosConfig?.headers,
        )}`,
    );

    const now = Date.now();
    return firstValueFrom(
      this.httpService.get<T>(apiUrl, fullAxiosConfig).pipe(
        catchError((error) => {
          return this.handleError(error, errorCode);
        }),
        tap((response) => {
          this.logger.info(
            `${this.constructor.name}, SERVICE_NAME:${
              this.svcName
            }, METHOD:GET, URL:${apiUrl}, DURATION: ${Date.now() - now}ms`,
            this.formatLog(response, cfg),
          );
        }),
      ),
    );
  }

  /**
   *
   * @param svcUrl
   * @param data
   * @param perRequestAxios
   * @param errorCode
   */
  protected async post<T = any>(
    svcUrl: string,
    data: any = {},
    perRequestAxios: AxiosRequestConfig = {},
    errorCode = '',
  ): Promise<AxiosResponse<T>> {
    const { apiUrl, fullAxiosConfig, cfg } = this.prepareData(
      svcUrl,
      perRequestAxios,
    );
    this.logger.info(
      `${this.constructor.name} | SERVICE_NAME:${
        this.svcName
      } | METHOD:POST | URL:${apiUrl} | DATA:${JSON.stringify(data)} | ` +
        `AXIOS_HEADERS:${JSON.stringify(fullAxiosConfig?.headers)}`,
    );
    const now = Date.now();
    return firstValueFrom(
      this.httpService.post(apiUrl, data, fullAxiosConfig).pipe(
        catchError((error) => {
          return this.handleError(error, errorCode);
        }),
        tap((response) =>
          this.logger.info(
            `${this.constructor.name}, SERVICE_NAME:${
              this.svcName
            }, METHOD:POST, URL:${apiUrl}, DURATION: ${Date.now() - now}ms`,
            this.formatLog(response, cfg),
          ),
        ),
      ),
    );
  }
  /**
   *
   * @param error
   * @param errorCode
   */
  private handleError(error: any, errorCode: string) {
    this.logger.error(
      `${this.constructor.name}, SERVICE_NAME:${this.svcName}, ERROR:${
        error.message
      }, ERROR_DATA:${JSON.stringify(error.response?.data)}`,
    );
    return throwError(
      () =>
        new RestServiceException(
          `Error calling ${this.constructor.name} API`,
          errorCode || GENERIC_REST_EXCEPTION,
          '',
          error.response?.data,
          `Error calling ${this.constructor.name} API`,
          error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
        ),
    );
  }

  private formatLog(response: any, cfg: any): object {
    const serviceResponse = cfg.disableBodyOutput
      ? this.noLogLiteral
      : response.data;
    return { serviceResponse };
  }
}
