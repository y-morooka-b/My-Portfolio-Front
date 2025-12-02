import {axiosInstance} from '../axios_instance'

/**
 * category の更新
 * @param id
 * @param name
 * @param type
 */
export async function update_category(id: number, name: string, type: number): Promise<void> {
    await axiosInstance.post('update_category', {'id': id,'name': name, 'type': type})
        .then(red => {
            console.log(red.data);
        })
        .catch((error) => {
            console.log(error);
        });
}
