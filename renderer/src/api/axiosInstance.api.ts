import { IApiResponse } from "@/models/shared/IApiResponse";
import { getAuthUser, removeAuthUser } from "@/services/AuthenticationService";
import { logout } from "@/store/authSlice";
import store from "@/store/store";
import axios, { AxiosError, AxiosResponse } from "axios";

const { NEXT_PUBLIC_COFFEELAND_API_ENDPOINT } = process.env;
const axiosApiInstance = axios.create();
axiosApiInstance.defaults.baseURL = NEXT_PUBLIC_COFFEELAND_API_ENDPOINT;


const axiosDefaultHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

// Append Token
axiosApiInstance.interceptors.request.use(
  async config => {
    const token = getAuthUser()?.token || "";
    config.headers = axiosDefaultHeaders(token);

    return config;
  },
  error => {
    console.log(`Request Interceptor: ${error}`);
    Promise.reject(error);
  }
);

axiosApiInstance.interceptors.response.use(
  response => {
    const responseData = response.data as IApiResponse;
    console.log(response);
    return response;
  },
  (err) => {
    const error = err as AxiosError;
    const originalRequest: any = error.config;

    if (error.response?.status !== 401) {
      const { data } = (error.response as AxiosResponse<IApiResponse>) || {};
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      removeAuthUser();
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
