import {JSX} from "react/jsx-runtime";
import {Categories} from "../../libraries/transceiver/get_categories";
import {create_hash} from "../../libraries/hash_library";
import { del_category } from "../../libraries/transceiver/del_category";
import { useCallback } from "react";

/**
 * カテゴリオブジェクトのリストからHTMLテーブルを生成する
 *
 * @param {Object} props - プロパティオブジェクト
 * @param {Categories[]} props.categories - カテゴリオブジェクトの配列
 *                                         `id`、`name`、`type`のプロパティを含みます。
 * @returns {JSX.Element} カテゴリのリストを表示するテーブル
 */
const CreateCategoryTable = ({categories, is_manage}: {
    categories: Categories[],
    is_manage: boolean
}): JSX.Element => {
    console.log(categories);

    let income_and_expenditure = [
        '支出',
        '収入'
    ];


    return (
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>カテゴリ名</th>
                <th>収支</th>
                {
                    is_manage &&
                    <th colSpan={2}>管理機能</th>
                }
            </tr>
            </thead>
            <tbody>
            {
                is_manage
                ? categories.map(category => {
                     const hash = create_hash(category.id + category.name + category.type).toString();
                     return <CreateCategoryManageSet key={`CategoryTable-${hash}`} category={category} income_and_expenditure={income_and_expenditure}/>
                 })
                : categories.map(category => {
                     const hash = create_hash(category.id + category.name + category.type).toString();
                     return <CreateCategorySet key={`CategoryTable-${hash}`} category={category} income_and_expenditure={income_and_expenditure}/>
                 })
            }
            </tbody>
        </table>
    );
}

/**
 * カテゴリを表示するテーブル行(`<tr>`)を生成するための関数コンポーネント
 *
 * @param {Object} props - コンポーネントに渡されるプロパティオブジェクト
 * @param {Categories} props.category - カテゴリの詳細情報を含むオブジェクト
 * @param {String[]} props.income_and_expenditure - 収支情報を表す文字列の配列
 *
 * @returns {JSX.Element} テーブル行(`<tr>`)を表すJSX要素
 */
const CreateCategorySet = ({category, income_and_expenditure}: {
    category: Categories,
    income_and_expenditure: String[]
}): JSX.Element => {
    return (
        <tr>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>{income_and_expenditure[category.type]}</td>
        </tr>
    );
}

/**
 * カテゴリ管理のデータを表示するためのテーブル行を生成する関数コンポーネント
 *
 * @param {Object} props - コンポーネントに渡されるプロパティオブジェクト
 * @param {Categories} props.category - カテゴリの詳細情報を含むオブジェクト
 * @param {String[]} props.income_and_expenditure - 収支情報を表す文字列の配列
 *
 * @returns {JSX.Element} カテゴリデータを持つテーブル行を表すJSX要素
 */
const CreateCategoryManageSet = ({category, income_and_expenditure}: {
    category: Categories,
    income_and_expenditure: String[]
}): JSX.Element => {

    const delButtonHandler = useCallback(() => {
        console.log(category);
        del_category(category.id);
    }, []);

    return (
        <tr>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>{income_and_expenditure[category.type]}</td>
            <td></td>
            <td><button onClick={delButtonHandler}>削除</button></td>
        </tr>
    );
}

export default CreateCategoryTable;


