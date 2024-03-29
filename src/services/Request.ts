import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Platform } from "react-native";
import { getEnvironment } from "../utils/environment";

/**
 * Base on Axios network request.
 *
 */

const TIMEOUT = 10000;
const NETWORK_ERROR = "network error";

class Request {
  private static instance?: Request;

  public service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      timeout: TIMEOUT,
      headers: {
        "User-Agent": Platform.OS,
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip",
      },
    });

    // Custom request interceptor
    this.service.interceptors.request.use(
      async (request: any) => {
        // Custom headers here
        const interceptRequest = await this.settingHeaders(request);
        const envUrls = getEnvironment();
        const isParticularUrl: boolean = request.url.includes(
          envUrls.exampleUrl
        );

        if (isParticularUrl) {
          // Set headers
        } else {
          // Set headers
        }

        return interceptRequest;
      },
      (err: any) => {
        console.warn(err);
        return Promise.reject(err);
      }
    );

    // Custom response interceptor
    this.service.interceptors.response.use(
      (response: any) => {
        // eslint-disable-next-line no-console
        console.log("✅ ", response.config.url, "\n", response);
        // clears the custom timeout if the request completes
        clearTimeout(this.requestTimeoutId);
        return response;
      },
      (err: any) => {
        // if the API call was cancelled due to a timeout, err will not have a config object
        // it will also not have a response object, but that will not cause the console.log to fail
        if (err.config) {
          // eslint-disable-next-line no-console
          console.log("❌ ", err.config.url, err.config, err.response);
        }
        const message = err.message.toLowerCase() as string;
        // Clears the custom timeout if a the Request did not fail due to a timeout
        if (!message.includes("timeout")) {
          clearTimeout(this.requestTimeoutId);
        }
        if (!err.response && message.includes(NETWORK_ERROR)) {
          // The site can't be reached, server IP address could not be found.
          console.warn("IP address could not be found");
        } else if (!err.response && message.includes("timeout")) {
          // Network request timeout
          console.warn("network request timeout");
        } else if (message.includes(NETWORK_ERROR)) {
          // Network error
          console.warn(NETWORK_ERROR);
        } else if (err.response.status === 500) {
          // Request failed with status code 500, Internal Server Error
        } else if (err.response.status === 415) {
          // Request failed with status code 415, Unsupported Media Type
        } else if (err.response.status === 409) {
          // Request failed with status code 409, Conflict
        } else if (err.response.status === 404) {
          // Request failed with status code 404, Not Found
        } else if (err.response.status === 403) {
          // Request failed with status code 403, Forbidden
        } else if (err.response.status === 401) {
          // Request failed with status code 401, Unauthorized
          console.warn(err.response.data.reason);
        } else if (err.response.status === 400) {
          // Request failed with status code 400, Bad Request
        }
        return Promise.reject(err);
      }
    );
  }

  stringContains = (string: string, pattern: string) =>
    string.indexOf(pattern) !== -1;

  settingHeaders = async (request: any) => request;

  static getInstance() {
    if (!Request.instance) {
      Request.instance = new Request();
    }
    return Request.instance;
  }

  private requestTimeoutId = setTimeout(() => {});

  // Creates a CancelToken for the Request
  getCancelToken = (options?: AxiosRequestConfig) => {
    const axiosCancelToken = axios.CancelToken.source();
    const timeoutInterval: number = options?.timeout
      ? options.timeout
      : TIMEOUT;

    this.requestTimeoutId = setTimeout(() => {
      console.warn("service call cancelled");
      axiosCancelToken.cancel("timeout");
    }, timeoutInterval);

    return axiosCancelToken.token;
  };

  /**
   *
   * @param url - Path to endpoint
   * @param data - GET Request data to be query stringified
   */
  get<T>(
    path: string,
    data?: Record<string, unknown>,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.service.get<T>(path, {
      ...options,
      params: data,
      cancelToken: this.getCancelToken(options),
    });
  }

  post<T>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.service.post<T>(path, data, {
      ...options,
      cancelToken: this.getCancelToken(options),
    });
  }

  delete<T>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.service.delete<T>(path, {
      ...options,
      params: data,
      cancelToken: this.getCancelToken(options),
    });
  }

  put<T>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.service.put<T>(path, data, {
      ...options,
      cancelToken: this.getCancelToken(options),
    });
  }

  patch<T>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.service.patch<T>(path, data, {
      ...options,
      cancelToken: this.getCancelToken(options),
    });
  }

  head<T>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.service
      .head<T>(path, {
        ...options,
        params: data,
        cancelToken: this.getCancelToken(options),
      })
      .then((response) => response)
      .catch((err) => err);
  }
}
// Makes for an easy way to mock different axios responses
export async function mockAxiosResponse<T>(
  payload: T,
  options?: Omit<AxiosResponse, "data">
): Promise<AxiosResponse<T>> {
  const config = {
    ...{
      config: {},
      status: 200,
      headers: {},
      statusText: "OK",
      request: {},
    },
    ...options,
  };
  const response = {
    data: payload,
    ...config,
  };
  return config.status < 400
    ? Promise.resolve(response)
    : Promise.reject(response);
}

export default Request.getInstance();
