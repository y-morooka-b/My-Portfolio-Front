import {axiosInstance} from '../axios_instance'
import {IncomeAndExpenditureMatrixSet} from "./get_income_and_expenditure";
import {Dispatch, SetStateAction} from "react";

export interface ResponseGetIncomeAndExpenditureMatrixSet {
    matrix_set: IncomeAndExpenditureMatrixSet;
}

/**
 * 1日分のmatrix setを取得する
 * @param year
 * @param month
 * @param day
 * @param setMatrixSet
 */
export function get_income_and_expenditure_matrix_set(year: number, month: number, day: number, setMatrixSet: Dispatch<SetStateAction<IncomeAndExpenditureMatrixSet>>) {
    axiosInstance.post<ResponseGetIncomeAndExpenditureMatrixSet>('get_income_and_expenditure_matrix_set', {
        'year': year,
        'month': month,
        'day': day,
    })
        .then(res => {
            setMatrixSet(res.data.matrix_set);
        })
}