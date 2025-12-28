import React, {useState, useEffect} from 'react';
import {useAtom} from 'jotai';
import {create_hash, format_date} from "../libraries/hash_library";
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
    targetDateAtom, dayTotalIncomeExpenditureListAtom
} from "../jotai_atom/RevenueAndExpenseManagement_Atom";
import {Dictionary} from "../libraries/expansion_type";

export interface DayTotalIncomeExpenditure {
    dayTotalIncome: number,
    dayTotalExpenditure: number,
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
    const [categoryResponse, setCategoryResponse] = useAtom(categoryResponseAtom)
    const [totalIncomeExpenditureList, setTotalIncomeExpenditureList] = useAtom(dayTotalIncomeExpenditureListAtom);

    const [responseGetIncomeAndExpenditure, setResponseGetIncomeAndExpenditure] = useState<ResponseGetIncomeAndExpenditure>();
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenditure,setTotalExpenditure] = useState(0);

    /**
     * コンポーネント起動・更新時
     */
    useEffect(() => {
        let now = new Date();
        setTargetDate(now);

        get_categories(setCategoryResponse);
        get_income_and_expenditure(setResponseGetIncomeAndExpenditure, now.getFullYear(), now.getMonth() + 1);
    }, []);

    /**
     * 1月野収支が取れた後の処理
     */
    useEffect(() => {
        let tmp: Dictionary<string, DayTotalIncomeExpenditure> = {};
        responseGetIncomeAndExpenditure?.matrix_set_list.forEach(matrix_set => {
            let str_date = format_date(targetDate.getFullYear(), targetDate.getMonth() + 1, matrix_set.day);
            tmp[str_date] = {
                dayTotalIncome: matrix_set.income,
                dayTotalExpenditure: matrix_set.expenditure
            };
        });
        setTotalIncomeExpenditureList(tmp);
    }, [responseGetIncomeAndExpenditure]);

    /**
     * 合計収支の計算と確定
     */
    useEffect(() => {
        let tmp_totalIncome = 0;
        let tmp_totalExpenditure = 0;

        for (let key in totalIncomeExpenditureList) {
            tmp_totalIncome += totalIncomeExpenditureList[key].dayTotalIncome;
            tmp_totalExpenditure += totalIncomeExpenditureList[key].dayTotalExpenditure;
        }

        setTotalIncome(tmp_totalIncome);
        setTotalExpenditure(tmp_totalExpenditure);
    }, [totalIncomeExpenditureList]);

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
            let tmp = new Date(date as string);

            if (!(date as string in setMatrixSetList)) {
                get_income_and_expenditure(setResponseGetIncomeAndExpenditure, tmp.getFullYear(), tmp.getMonth() + 1);
            } else {
                let date_str = `${tmp.getFullYear()}-${tmp.getMonth() + 1}-${tmp.getDate().toString().padStart(2, '0')}`;
                get_income_and_expenditure_matrix_set(tmp.getFullYear(), tmp.getMonth() + 1, tmp.getDate(), setMatrixSetList[date_str]);
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
                    <td>{totalIncome}</td>
                    <td>{totalExpenditure}</td>
                    <td>{totalIncome - totalExpenditure}</td>
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
