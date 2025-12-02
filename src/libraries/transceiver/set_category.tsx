import {axiosInstance} from '../axios_instance'

interface SetCategoryResponse {
    status: boolean;
}


/**
 * category の登録
 *
 * @param name
 * @param type
 */
export async function set_category(name: string, type: number): Promise<void>{
    await axiosInstance.post('set_category', {'name': name, 'type': type})
        .then(red => {
            console.log(red.data);
        })
        .catch((error) => {
            console.log(error);
        });
}
