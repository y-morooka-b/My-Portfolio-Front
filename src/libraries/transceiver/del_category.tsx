import {axiosInstance} from '../axios_instance'

/**
 * category の削除
 * @param id
 */
export async function del_category(id: number): Promise<void> {
    await axiosInstance.post('del_category', {'id': id})
        .then(red => {
            console.log(red.data);
        })
        .catch((error) => {
            console.log(error);
        });
}
