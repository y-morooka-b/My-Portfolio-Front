import {axiosInstance} from "../axios_instance"

/**
 * 収支表の行更新
 *
 * @param id
 * @param date
 * @param amount
 * @param place
 * @param category_id
 * @param comment
 */
export const update_income_and_expenditure = async (
    id: number,
    date: string,
    amount: number,
    place: string,
    category_id: number,
    comment: string
) => {
    await axiosInstance
        .post(
            'update_income_and_expenditure',
            {
                id: id,
                date: date,
                amount: amount,
                place: place,
                category_id: category_id,
                comment: comment
            }
        )
        .then(res => console.log(res))
        .catch(err => console.error(err));
}
