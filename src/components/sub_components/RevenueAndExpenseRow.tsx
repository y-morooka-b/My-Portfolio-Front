import {ChangeEvent, JSX, useState} from "react";
import {IncomeAndExpenditureRecord} from "../../libraries/transceiver/get_income_and_expenditure";
import {update_income_and_expenditure} from "../../libraries/transceiver/update_income_and_expenditure";
import {get_income_and_expenditure_matrix_set} from "../../libraries/transceiver/get_income_and_expenditure_matrixSet";
import {del_income_and_expenditure} from "../../libraries/transceiver/del_income_and_expenditure";
import {create_hash} from "../../libraries/hash_library";
import {INCOME_AND_EXPENDITURE} from "../../FixedValue";
import {useAtom} from "jotai";
import {
    categoryResponseAtom,
    setMatrixSetListAtom,
    targetDateAtom
} from "../../jotai_atom/RevenueAndExpenseManagement_Atom";

/**
 * 収支明細の行を表示・編集するためのコンポーネント
 * 収支データの編集と更新・削除が可能
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {IncomeAndExpenditureRecord} props.row - 単一の収支記録データ
 * @param {number} props.day - 行の対象日付の日にち
 * @returns {JSX.Element} 編集可能なフィールドを持つ収支明細の1行を表すJSX要素
 */
const RevenueAndExpenseRow = ({row, day}: { row: IncomeAndExpenditureRecord, day: number }): JSX.Element => {
    const [targetDate] = useAtom(targetDateAtom);
    const [categoryResponse] = useAtom(categoryResponseAtom);
    const [setMatrixSetList] = useAtom(setMatrixSetListAtom);

    const [amount, setAmount] = useState(row.amount);
    const [place, setPlace] = useState(row.place);
    const [categoryId, setCategoryId] = useState(row.category_id);
    const [comment, setComment] = useState(row.comment);

    const updateButtonHandler = () => {
        update_income_and_expenditure(
            row.id,
            row.date,
            amount,
            place,
            categoryId,
            comment,
        ).then(() => {
            if (Object.keys(setMatrixSetList).length !== 0) {
                get_income_and_expenditure_matrix_set(targetDate.getFullYear(), targetDate.getMonth() + 1, day, setMatrixSetList[row.date as string]);
            }
        });
    }
    const deleteButtonHandler = () => {
        del_income_and_expenditure(row.id)
            .then(() => {
                if (Object.keys(setMatrixSetList).length !== 0) {
                    get_income_and_expenditure_matrix_set(targetDate.getFullYear(), targetDate.getMonth() + 1, day, setMatrixSetList[row.date as string]);
                }
            });
    }

    const handleInputAmount = (event: ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value));
    }
    const handleInputPlace = (event: ChangeEvent<HTMLInputElement>) => {
        setPlace(String(event.target.value));
    }
    const handleInputCategoryId = (event: ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(Number(event.target.value));
    }
    const handleInputComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setComment(String(event.target.value));
    }

    return (
        <span className="row RevenueAndExpenseMatrix-details-body">
            <span className="col-2">
                <select name="category_id" onChange={handleInputCategoryId}> {
                    categoryResponse?.categories.map(
                        category => {
                            const hash = create_hash(row.id + row.date + category.id + category.name + category.type);
                            return <option key={`CategoryList-${hash}`} value={categoryId}
                                           selected={categoryId === category.id}>
                                {`${category.name} : ${INCOME_AND_EXPENDITURE[category.type]}`}
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

export default RevenueAndExpenseRow;
