import { AxiosResponse } from 'axios';
import { IApiResponse } from 'src/models/shared/IApiResponse';
import axiosNoTokenApiInstance from 'src/api/axiosNoTokenInstance';
import { IPOSData, IUpdatePOSData } from '../models/Authentication/IPOSData';
import { IAuthResponse, ILoginUser } from '@/models/Authentication/Authentication.models';
import axiosApiInstance from './axiosInstance.api';

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, params?: any) =>
    axiosApiInstance.get(url, { params: params }).then(responseBody),
  post: (url: string, body: {}) =>
    axiosApiInstance.post(url, body).then(responseBody),
  put: (url: string, body: {}) =>
    axiosApiInstance.put(url, body).then(responseBody),
  del: (url: string) => axiosApiInstance.delete(url).then(responseBody),
};

const noTokenrequests = {
  get: (url: string, params?: any) =>
    axiosNoTokenApiInstance.get(url, { params: params }).then(responseBody),
  post: (url: string, body: {}) =>
    axiosNoTokenApiInstance.post(url, body).then(responseBody),
  put: (url: string, body: {}) =>
    axiosNoTokenApiInstance.put(url, body).then(responseBody),
  del: (url: string) => axiosNoTokenApiInstance.delete(url).then(responseBody),
};

export interface ILoginDataApiResponse extends IApiResponse {
  data: IAuthResponse;
}

export interface IPOSDataApiResponse extends IApiResponse {
  data: IPOSData;
}

export interface IUpdatePOSDataApiResponse extends IApiResponse {
  data: IUpdatePOSData;
}

const ApiService = {
  validateInvoicePoint(id: number): Promise<IPOSDataApiResponse> {
    return requests.get(`auth/validateInvoicePoint/${id}`);
  },
  updatePOSProducts(): Promise<IUpdatePOSDataApiResponse> {
    return requests.get(`auth/updateProducts`);
  },
};

const ApiNoTokenService = {
  login(body: ILoginUser): Promise<ILoginDataApiResponse> {
    return noTokenrequests.post(`auth/login`, body);
  },
};

export { ApiService, ApiNoTokenService };
