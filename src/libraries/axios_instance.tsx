import axios from 'axios';
import type { InternalAxiosRequestConfig } from "axios";

/** @var AxiosInstance axiosの拡張  */
export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/household_budget/", // ベースURLを設定
    withCredentials: true
});

// リクエストインターセプターを追加
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);
