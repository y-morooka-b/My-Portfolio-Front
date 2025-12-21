import React, {useState, useEffect} from 'react';
import {useAtom} from 'jotai';
import {create_hash} from "../libraries/hash_library";
import {get_categories} from "../libraries/transceiver/get_categories";
import {
    get_income_and_expenditure,
    ResponseGetIncomeAndExpenditure
} from "../libraries/transceiver/get_income_and_expenditure";
import {set_income_and_expenditure} from "../libraries/transceiver/set_income_and_expenditure";
import '../components_css/RevenueAndExpenseManagement.css';
import {get_income_and_expenditure_matrix_set} from "../libraries/transceiver/get_income_and_expenditure_matrixSet";
import {DATE_FORMAT_LOCALE, DATE_FORMAT_OPTIONS, INCOME_AND_EXPENDITURE} from "../FixedValue";
import MonthsCalendar from "./sub_components/MonthsCalendar";
import {
    categoryResponseAtom,
    setMatrixSetListAtom,
    targetDateAtom
} from "../jotai_atom/RevenueAndExpenseManagement_Atom";

interface TotalIncomeExpenditure {
    totalIncome: number,
    totalExpenditure: number,
}


/**
 * 収支管理のためのコンポーネント
 *
 * 機能:
 * - 選択した月の収支データを表示
 * - フォームから新しい収支記録を追加可能
 * - 支出と収入のカテゴリ管理をサポート
 *
 * 状態:
 * - `responseGetIncomeAndExpenditure` 現在の月の収支データを管理
 * - `categoryResponse` カテゴリ一覧を含むレスポンスを保持
 * - `targetDate` ヘッダーに表示される選択中の日付を表す
 *
 * エフェクト:
 * - 初期化時に、カテゴリと現在の年月の収支データを取得
 *
 * メソッド:
 * - `income_and_expenditure_registration`: 収支登録フォームのデータを処理し、
 *   バックエンドに送信する処理を行います
 *
 * レイアウト:
 * - 収支のカレンダービューを含む
 * - 日付、金額、場所、カテゴリ、コメントなどのデータを収集するためのフォームがあり、
 *   新しいエントリの登録が可能
 */
const RevenueAndExpenseManagement = () => {
    const [setMatrixSetList] = useAtom(setMatrixSetListAtom);
    const [targetDate, setTargetDate] = useAtom(targetDateAtom);
    const [categoryResponse, setCategoryResponse] = useAtom(categoryResponseAtom);

    const [responseGetIncomeAndExpenditure, setResponseGetIncomeAndExpenditure] = useState<ResponseGetIncomeAndExpenditure>();
    const [totalIncomeExpenditure, setTotalIncomeExpenditure] = useState<TotalIncomeExpenditure>({totalIncome: 0, totalExpenditure: 0});

    useEffect(() => {
        let now = new Date();
        setTargetDate(now);

        get_categories(setCategoryResponse);
        get_income_and_expenditure(setResponseGetIncomeAndExpenditure, now.getFullYear(), now.getMonth() + 1)
            .then(() => {
                let totalIncome = 0;
                let totalExpenditure = 0;
                responseGetIncomeAndExpenditure?.matrix_set_list.forEach(matrix_set => {
                    totalIncome += matrix_set.income;
                    totalExpenditure += matrix_set.expenditure;
                });
                setTotalIncomeExpenditure({totalIncome, totalExpenditure});
            });
    }, []);

    const income_and_expenditure_registration = (formData: FormData) => {
        let date = formData.get('date');
        let amount = formData.get('amount');
        let place = formData.get('place');
        let category_id = formData.get('category_id');
        let comment = formData.get('comment');

        set_income_and_expenditure(
            String(date),
            Number(amount),
            String(place),
            Number(category_id),
            String(comment),
        ).then(() => {
            console.log(date);
            if (Object.keys(setMatrixSetList).length !== 0) {
                let tmp = new Date(date as string);
                get_income_and_expenditure_matrix_set(tmp.getFullYear(), tmp.getMonth() + 1, tmp.getDay(), setMatrixSetList[date as string]);
            }
        });
    };

    return (
        <>
            <h2>収支管理</h2>
            <br/>
            <h3>{Intl.DateTimeFormat(DATE_FORMAT_LOCALE, DATE_FORMAT_OPTIONS).format(targetDate)}</h3>
            <table>
                <thead>
                <tr>
                    <th>
                        合計収入
                    </th>
                    <th>
                        合計支出
                    </th>
                    <th>
                        合計±
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{totalIncomeExpenditure.totalIncome}</td>
                    <td>{totalIncomeExpenditure.totalExpenditure}</td>
                    <td>{totalIncomeExpenditure.totalIncome - totalIncomeExpenditure.totalExpenditure}</td>
                </tr>
                </tbody>
            </table>
            <br/>
            <div className="container-fluid RevenueAndExpenseManagement-container">
                <div className="row">
                    <div className="col">
                        <h4>収支表</h4>
                        {
                            responseGetIncomeAndExpenditure &&
                            <MonthsCalendar responseGetIncomeAndExpenditure={responseGetIncomeAndExpenditure}/>
                        }
                    </div>
                    <div className="col-3">
                        <h4>収支追加</h4>
                        <form action={income_and_expenditure_registration}>
                            <table>
                                <tbody>
                                <tr>
                                    <th>日付</th>
                                    <td><input type="date" name="date"/></td>
                                </tr>
                                <tr>
                                    <th>金額</th>
                                    <td><input type="number" name="amount"/></td>
                                </tr>
                                <tr>
                                    <th>購入・収入場所</th>
                                    <td><input type="text" name="place"/></td>
                                </tr>
                                <tr>
                                    <th>カテゴリ</th>
                                    <td>
                                        <select name="category_id">
                                            <option value="">&nbsp;--選択してください--&nbsp;</option>
                                            {
                                                categoryResponse?.categories.map(
                                                    category => {
                                                        const hash = create_hash(category.id + category.name + category.type);
                                                        return <option key={`CategoryList-${hash}`}
                                                                       value={category.id}>{`${category.name} : ${INCOME_AND_EXPENDITURE[category.type]}`}</option>
                                                    })
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>コメント</th>
                                    <td><textarea name="comment" defaultValue={``}/></td>
                                </tr>
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={2} align={"right"}>
                                        <input id="add-income_and_expenditure-foot" type={"submit"}/>
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RevenueAndExpenseManagement;
