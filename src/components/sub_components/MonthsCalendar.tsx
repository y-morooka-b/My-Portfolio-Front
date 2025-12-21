import {JSX} from "react";
import {ResponseGetIncomeAndExpenditure} from "../../libraries/transceiver/get_income_and_expenditure";
import {create_hash} from "../../libraries/hash_library";
import RevenueAndExpenseMatrix from "./RevenueAndExpenseMatrix";

/**
 * カレンダーに表示された月の収支データを表示するコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {ResponseGetIncomeAndExpenditure} props.responseGetIncomeAndExpenditure - カレンダー表示用の収支データを含むレスポンス
 *
 * @returns {JSX.Element} 月ごとの収支カレンダーを表示するテーブル要素
 */
const MonthsCalendar = ({responseGetIncomeAndExpenditure}: {
    responseGetIncomeAndExpenditure: ResponseGetIncomeAndExpenditure,
}): JSX.Element => {
    return (
        <table>
            <thead>
            <tr>
                <th>日</th>
                <th>曜日</th>
                <th>収支</th>
            </tr>
            </thead>
            <tbody>
            {responseGetIncomeAndExpenditure.matrix_set_list.map(matrix_set => {
                let hash = create_hash(matrix_set.day + matrix_set.weekday);
                return (
                    <tr key={`MonthCalendar-${hash}`}>
                        <td>{matrix_set.day}</td>
                        <td>{matrix_set.weekday}</td>
                        <td>
                            {
                                matrix_set.matrix.length === 0 ?
                                    <span>なし</span> :
                                    <RevenueAndExpenseMatrix matrix_set={matrix_set}/>
                            }
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default MonthsCalendar;
