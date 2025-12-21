/**
 * RevenueAndExpenseManagement の親子系で共通で使う値のAtomのまとめ
 */

import {atom, WritableAtom} from 'jotai';
import {GetCategoryResponse} from "../libraries/transceiver/get_categories";
import {Dispatch, SetStateAction} from "react";
import {IncomeAndExpenditureMatrixSet} from "../libraries/transceiver/get_income_and_expenditure";
import {Dictionary} from "../libraries/expansion_type";

/**
 * ターゲット日付を管理・保存するための状態アトム
 * @type WritableAtom<Date, [Date], void>
 */
export const targetDateAtom: WritableAtom<Date, [Date], void> = atom<Date>(new Date());

/**
 * カテゴリ一覧を共通化させるためのアトム
 * @type {import('jotai').Atom<GetCategoryResponse | undefined>}
 */
export const categoryResponseAtom: import('jotai').Atom<GetCategoryResponse | undefined> = atom<GetCategoryResponse | undefined>();

/**
 * 収支マトリックスセットのコレクションの状態を管理するAtom
 *
 * 型情報:
 * - 辞書のキーは `string`
 * - 辞書の値は`Dispatch<SetStateAction<IncomeAndExpenditureMatrixSet>>`関数
 *   `IncomeAndExpenditureMatrixSet`状態の更新を可能にする
 *
 * 初期値:
 * - アトムはデフォルトで空の辞書で初期化
 *
 * @type {import('jotai').Atom<Dictionary<string, Dispatch<SetStateAction<IncomeAndExpenditureMatrixSet>>>>}
 */
export const setMatrixSetListAtom: WritableAtom<Dictionary<string, Dispatch<SetStateAction<IncomeAndExpenditureMatrixSet>>>, [Dictionary<string, Dispatch<SetStateAction<IncomeAndExpenditureMatrixSet>>>], void> = atom<Dictionary<string, Dispatch<SetStateAction<IncomeAndExpenditureMatrixSet>>>>({});
