import React, {useState, useEffect, ChangeEvent, JSX, createContext, useContext} from 'react';
import {create_hash} from "../libraries/hash_library";
import {GetCategoryResponse, get_categories} from "../libraries/transceiver/get_categories";
import {
    get_income_and_expenditure,
    IncomeAndExpenditureMatrixSet,
    IncomeAndExpenditureRecord,
    ResponseGetIncomeAndExpenditure
} from "../libraries/transceiver/get_income_and_expenditure";
import {set_income_and_expenditure} from "../libraries/transceiver/set_income_and_expenditure";
import '../components_css/RevenueAndExpenseManagement.css';
import { update_income_and_expenditure } from "../libraries/transceiver/update_income_and_expenditure";
import { del_income_and_expenditure } from "../libraries/transceiver/del_income_and_expenditure";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long'
}

const income_and_expenditure = [
    '支出',
    '収入'
];

interface TotalIncomeExpenditure {
    totalIncome: number,
    totalExpenditure: number,
}

interface CommonContextProps {
    categoryResponse: GetCategoryResponse | undefined
}

const CommonContext = createContext({categoryResponse: undefined} as CommonContextProps);

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
    let date = new Date();
    const [responseGetIncomeAndExpenditure, setResponseGetIncomeAndExpenditure] = useState<ResponseGetIncomeAndExpenditure>();
    const [categoryResponse, setCategoryResponse] = useState<GetCategoryResponse>();
    const [targetDate, setTargetDate] = useState(new Intl.DateTimeFormat('ja-JP', DATE_FORMAT_OPTIONS).format(date));
    const [totalIncomeExpenditure, setTotalIncomeExpenditure] = useState<TotalIncomeExpenditure>({totalIncome: 0, totalExpenditure: 0});

    useEffect(() => {
        get_categories(setCategoryResponse);
        get_income_and_expenditure(setResponseGetIncomeAndExpenditure, date.getFullYear(), date.getMonth() + 1)
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
        );
    };

    return (
        <CommonContext.Provider value={ {categoryResponse} }>
            <h2>収支管理</h2>
            <br/>
            <h3>{targetDate}</h3>
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
                                                                       value={category.id}>{`${category.name} : ${income_and_expenditure[category.type]}`}</option>
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
        </CommonContext.Provider>
    );
}

/**
 * カレンダーに表示された月の収支データを表示するコンポーネント
 *
 * 入力として以下のプロパティを受け取る:
 * - responseGetIncomeAndExpenditure - 収支明細と一覧データを含むレスポンスデータ
 * - categoryResponse - 収支カテゴリ情報を含むレスポンスデータ(任意)
 *
 * 表形式で収支カレンダーを表示し、各日の収支詳細を閲覧できる
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {ResponseGetIncomeAndExpenditure} props.responseGetIncomeAndExpenditure - 収支データを含むレスポンス
 * @returns {JSX.Element} 収支カレンダーを表示するテーブル要素
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
                                    <RevenueAndExpenseMatrix matrix_set={matrix_set} />
                            }
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}

/**
 * 収支の詳細マトリックスを表示するコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {IncomeAndExpenditureMatrixSet} props.matrix_set - 収支データとマトリックス詳細を含むデータセット
 *
 * @returns {JSX.Element} 収支明細マトリックスを表示するJSXコンポーネント
 */
const RevenueAndExpenseMatrix = ({matrix_set}: {
    matrix_set: IncomeAndExpenditureMatrixSet,
}): JSX.Element => {

    const [income, setIncome] = useState(matrix_set.income);
    const [expenditure, setExpenditure] = useState(matrix_set.expenditure);
    const [matrix, setMatrix] = useState(matrix_set.matrix);

    const update_today = (matrix_set: IncomeAndExpenditureMatrixSet) => {
        setIncome(matrix_set.income);
        setExpenditure(matrix_set.expenditure);
        setMatrix(matrix_set.matrix);
    }

    return (
        <details>
            <summary className='RevenueAndExpenseMatrix-details-summary'>
                <span className="container RevenueAndExpenseMatrix-details-summary-title">
                    <span className="row align-items-start">
                        <span className="col-2"><strong>詳細</strong></span>
                        <span className="col">収入<span className="RevenueAndExpenseMatrix-details-summary-amount income-summary-amount">{income}</span>円</span>
                        <span className="col">支出<span className="RevenueAndExpenseMatrix-details-summary-amount expenditure-summary-amount">{expenditure}</span>円</span>
                        <span className="col">±<span className="RevenueAndExpenseMatrix-details-summary-amount">{income - expenditure}</span>円</span>
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
                    matrix.map(row => {
                        let hash = create_hash(row.id + row.date);
                        return <RevenueAndExpenseRow key={`RevenueAndExpenseMatrix-${hash}`} row={row} update_today={update_today}/>
                    })
                }
            </div>
        </details>
    );
}

/**
 * 収支明細の行を表示・編集するためのコンポーネント
 * 収支データの編集と更新・削除が可能
 *
 * @param {object} props - コンポーネントのプロパティ
 * @param {IncomeAndExpenditureRecord} props.row - 単一の収支記録を表すオブジェクト
 *
 * @returns {JSX.Element} カテゴリ、場所、金額、コメントを含む収支明細の行を表示
 */
const RevenueAndExpenseRow = ({row, update_today}: {
    row: IncomeAndExpenditureRecord,
    update_today: (matrix_set: IncomeAndExpenditureMatrixSet) => void
}):JSX.Element => {
    const {categoryResponse} = useContext<CommonContextProps>(CommonContext);

    const [id] = useState(row.id);
    const [date] = useState(row.date);
    const [amount, setAmount] = useState(row.amount);
    const [place, setPlase] = useState(row.place);
    const [categoryId, setCategoryId] = useState(row.category_id);
    const [comment, setComment] = useState(row.comment);

    const updateButtonHandler = () => {
        update_income_and_expenditure(
            id,
            date,
            amount,
            place,
            categoryId,
            comment,
        ).then(() => {

        });
    }
    const deleteButtonHandler = () => {
        del_income_and_expenditure(id);
    }

    const handleInputAmount = (event:ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value));
    }
    const handleInputPlace = (event:ChangeEvent<HTMLInputElement>) => {
        setPlase(String(event.target.value));
    }
    const handleInputCategoryId = (event:ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(Number(event.target.value));
    }
    const handleInputComment = (event:ChangeEvent<HTMLTextAreaElement>) => {
        setComment(String(event.target.value));
    }

    return (
        <span className="row RevenueAndExpenseMatrix-details-body">
            <span className="col-2">
                <select name="category_id" onChange={handleInputCategoryId} > {
                    categoryResponse?.categories.map(
                        category => {
                            const hash = create_hash(row.id + row.date + category.id + category.name + category.type);
                            return <option key={`CategoryList-${hash}`} value={categoryId} selected={categoryId === category.id}>
                                {`${category.name} : ${income_and_expenditure[category.type]}`}
                            </option>
                        })
                }
                </select>
            </span>
            <span className="col">
                <input type="text" name="place" value={place} onChange={handleInputPlace}/>
            </span>
            <span className="col-3">
                <label><input type="number" name="amount" value={amount} onChange={handleInputAmount}/>円</label>
            </span>
            <span className="col RevenueAndExpenseMatrix-comment">
                <textarea value={comment} onChange={handleInputComment}></textarea>
            </span>
            <span className="col-1">
                <button onClick={updateButtonHandler}>更新</button>
                <button onClick={deleteButtonHandler}>削除</button>
            </span>
        </span>
    );
}

export default RevenueAndExpenseManagement;
