import {axiosInstance} from "../axios_instance"

/**
 * 収支表の行削除
 * @param id
 */
export const del_income_and_expenditure = async (id: number) => {
    await axiosInstance.post('del_income_and_expenditure', {id: id})
        .then(res => console.log(res))
        .catch(err => console.log(err));
}
