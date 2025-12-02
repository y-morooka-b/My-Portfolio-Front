import {Dispatch, SetStateAction } from "react";
import {axiosInstance} from '../axios_instance'

/**
 * category データ
 */
export interface Categories{
    id:number;
    name:string;
    type:number;
}

/**
 * get_categories からのレスポンス
 */
export interface GetCategoryResponse{
    categories:Categories[];
}

/**
 * category の一覧取得
 * @param setCategoryResponse
 */
export async function get_categories(setCategoryResponse: Dispatch<SetStateAction<GetCategoryResponse | undefined>>) {
    axiosInstance.post<GetCategoryResponse>('get_categories', {})
        .then(red => {
            console.log(red.data);
            setCategoryResponse(red.data);
        })
        .catch((error) => {
            console.log(error);
            setCategoryResponse(undefined);
        });
}
