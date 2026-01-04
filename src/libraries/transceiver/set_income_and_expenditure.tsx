import {axiosInstance} from '../axios_instance'

/**
 * 収支の追加
 * @param date
 * @param amount
 * @param place
 * @param category_id
 * @param comment
 */
export const set_income_and_expenditure = async (
    date: string,
    amount: number,
    place: string,
    category_id: number,
    comment: string
) => {
    await axiosInstance.post('set_income_and_expenditure', {
        'date': date,
        'amount': amount,
        'place': place,
        'category_id': category_id,
        'comment': comment
    })
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
}