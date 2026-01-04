import {axiosInstance} from '../axios_instance'
import {Dispatch, SetStateAction} from "react";

export interface MonthlySumInfo {
    category_name: string;
    category_type: number;
    total: number;
}

export interface ResponseGetMonthlyOverview {
    total_expenditure: number;
    total_income: number;
    sum_income_list: MonthlySumInfo[];
    sum_expenditure_list: MonthlySumInfo[];
}

export async function get_monthly_overview(setMonthlyOverview: Dispatch<SetStateAction<any>>) {
    axiosInstance.post<ResponseGetMonthlyOverview>('get_monthly_overview', {})
        .then(res => setMonthlyOverview(res.data))
}
