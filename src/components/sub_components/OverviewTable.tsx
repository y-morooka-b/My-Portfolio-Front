import {MonthlySumInfo} from "../../libraries/transceiver/get_monthly_overview";
import {BACKGROUND_COLOR_LIST, INCOME_AND_EXPENDITURE} from "../../FixedValue";
import '../../components_css/OverviewTable.css';

const OverviewTable = ({sum_income_list, sum_expenditure_list}: {
    sum_income_list: MonthlySumInfo[],
    sum_expenditure_list: MonthlySumInfo[]
}) => {
    let total_income_and_expenditure = 0;

    return (
        <table>
            <thead>
            <tr>
                <th className="OverviewTable-header">カテゴリ名</th>
                <th className="OverviewTable-header">収支</th>
                <th className="OverviewTable-header">金額</th>
            </tr>
            </thead>
            <tbody>
            {
                sum_income_list.map(monthly_sum_info => {
                    total_income_and_expenditure += monthly_sum_info.total;
                    return (
                        <tr className={BACKGROUND_COLOR_LIST[monthly_sum_info.category_type]}>
                            <td>{monthly_sum_info.category_name}</td>
                            <td>{INCOME_AND_EXPENDITURE[monthly_sum_info.category_type]}</td>
                            <td className="OverviewTable-amount">{monthly_sum_info.total}円</td>
                        </tr>
                    );
                })
            }
            {
                sum_expenditure_list.map(monthly_sum_info => {
                    total_income_and_expenditure -= monthly_sum_info.total;
                    return (
                        <tr className={BACKGROUND_COLOR_LIST[monthly_sum_info.category_type]}>
                            <td>{monthly_sum_info.category_name}</td>
                            <td>{INCOME_AND_EXPENDITURE[monthly_sum_info.category_type]}</td>
                            <td className="OverviewTable-amount">- {monthly_sum_info.total}円</td>
                        </tr>
                    );
                })
            }
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={2}>合計(±)</td>
                    <td className="OverviewTable-amount">{total_income_and_expenditure}円</td>
                </tr>
            </tfoot>
        </table>
    );
}

export default OverviewTable;
