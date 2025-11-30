import {JSX} from "react/jsx-runtime";
import {Categories} from "../../libraries/transceiver/get_categories";
import { create_hash } from "../../libraries/hash_library";

/**
 * カテゴリオブジェクトのリストからHTMLテーブルを生成する
 *
 * @param {Object} props - プロパティオブジェクト
 * @param {Categories[]} props.categories - カテゴリオブジェクトの配列
 *                                         `id`、`name`、`type`のプロパティを含みます。
 * @returns {JSX.Element} カテゴリのリストを表示するテーブル
 */
const CreateCategoryTable = ({categories}: { categories: Categories[] }): JSX.Element => {
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
                </tr>
            </thead>
            <tbody>
            {
                categories.map(category => {
                    const hash = create_hash(category.id + category.name + category.type).toString();

                    return (
                        <tr key={`CategoryTable-${hash}`}>
                            <td key={`CategoryTable-Id-${hash}`}>{category.id}</td>
                            <td key={`CategoryTable-Name-${hash}`}>{category.name}</td>
                            <td key={`CategoryTable-Type-${hash}`}>{income_and_expenditure[category.type]}</td>
                        </tr>
                    );
                })
            }
            </tbody>
        </table>
    );
}

export default CreateCategoryTable;


