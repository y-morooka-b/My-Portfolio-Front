import {Dispatch, SetStateAction} from "react";
import {axiosInstance} from '../axios_instance'

/**
 * category の登録
 * @param setCategoryResponse
 */
export async function set_category(name: string, type: number) {
    axiosInstance.post('set_category', {'name': name, 'type': type})
        .then(red => {
            console.log(red.data);
        })
        .catch((error) => {
            console.log(error);
        });
}
