import {Dispatch, SetStateAction} from "react";
import {axiosInstance} from '../axios_instance'

/**
 * 1件の収支データ
 */
export interface IncomeAndExpenditureRecord {
    id: number;
    category_id: number;
    amount: number;
    place: string;
    date: string;
    comment: string;
    log_time: string;
}

/**
 * 日ごとの収支データ
 */
export interface IncomeAndExpenditureMatrixSet {
    day: number;
    weekday: string;
    income: number;
    expenditure: number;
    matrix: IncomeAndExpenditureRecord[];
}

/**
 * get_categories からのレスポンス
 */
export interface ResponseGetIncomeAndExpenditure {
    matrix_set_list: IncomeAndExpenditureMatrixSet[];
}

/**
 * 1月の収支を取得する
 * @param setIncomeAndExpenditure
 * @param year
 * @param month
 */
export async function get_income_and_expenditure(setIncomeAndExpenditure: Dispatch<SetStateAction<any>>, year: number, month: number) {
    axiosInstance.post<ResponseGetIncomeAndExpenditure>('get_income_and_expenditure', {
        'year': year,
        'month': month
    })
        .then(res => {
            setIncomeAndExpenditure(res.data);
        })
}
