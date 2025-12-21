import {JSX, useState} from "react";

import {IncomeAndExpenditureMatrixSet} from "../../libraries/transceiver/get_income_and_expenditure";
import { ChildeContext } from "../RevenueAndExpenseManagement";
import {create_hash} from "../../libraries/hash_library";
import RevenueAndExpenseRow from "./RevenueAndExpenseRow";

/**
 * 収支の詳細マトリックスを表示するコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {IncomeAndExpenditureMatrixSet} props.matrix_set - 収支データとマトリックス詳細を含むデータセット
 *
 * @returns {JSX.Element} 収支明細マトリックスを表示するJSXコンポーネント
 */


/**
 * 収支の詳細マトリックスを表示するコンポーネント
 *
 * @param {Object} props - コンポーネントに渡されるプロパティ
 * @param {IncomeAndExpenditureMatrixSet} props.matrix_set - 収支データとマトリックス詳細を含むデータセット
 *
 * @returns {JSX.Element} 収支明細マトリックスを表示するJSXコンポーネント
 */
const RevenueAndExpenseMatrix = ({matrix_set}: {
    matrix_set: IncomeAndExpenditureMatrixSet,
}): JSX.Element => {

    const [matrixSet, setMatrixSet] = useState(matrix_set);

    return (
        <ChildeContext.Provider value={{setMatrixSet}}>
            <details>
                <summary className='RevenueAndExpenseMatrix-details-summary'>
                <span className="container RevenueAndExpenseMatrix-details-summary-title">
                    <span className="row align-items-start">
                        <span className="col-2"><strong>詳細</strong></span>
                        <span className="col">収入<span
                            className="RevenueAndExpenseMatrix-details-summary-amount income-summary-amount">{matrixSet.income}</span>円</span>
                        <span className="col">支出<span
                            className="RevenueAndExpenseMatrix-details-summary-amount expenditure-summary-amount">{matrixSet.expenditure}</span>円</span>
                        <span className="col">±<span
                            className="RevenueAndExpenseMatrix-details-summary-amount">{matrixSet.income - matrixSet.expenditure}</span>円</span>
                    </span>
                </span>
                </summary>
                <br/>

                <div className="container">
                <span className="row RevenueAndExpenseMatrix-details-head">
                    <span className="col-2 RevenueAndExpenseMatrix-details-head-text">カテゴリ</span>
                    <span className="col RevenueAndExpenseMatrix-details-head-text">購入・収入場所</span>
                    <span className="col-3 RevenueAndExpenseMatrix-details-head-text">金額</span>
                    <span className="col RevenueAndExpenseMatrix-details-head-text">コメント</span>
                    <span className="col-1"></span>
                </span>
                    {
                        matrixSet.matrix.map(row => {
                            let hash = create_hash(row.id + row.date);
                            return <RevenueAndExpenseRow key={`RevenueAndExpenseMatrix-${hash}`} row={row}
                                                         day={matrixSet.day}/>
                        })
                    }
                </div>
            </details>
        </ChildeContext.Provider>
    );
}

export default RevenueAndExpenseMatrix;
