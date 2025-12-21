import {JSX} from "react/jsx-runtime";
import {Categories, GetCategoryResponse, get_categories} from "../../libraries/transceiver/get_categories";
import {create_hash} from "../../libraries/hash_library";
import {del_category} from "../../libraries/transceiver/del_category";
import {ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {update_category} from "../../libraries/transceiver/update_category";
import {INCOME_AND_EXPENDITURE} from "../../FixedValue";

const CATEGORY_TYPE_EXPENDITURE = 0;
const CATEGORY_TYPE_INCOME = 1;

const background_color_list = [
    'registered-categories-expenditure',
    'registered-categories-income'
];

/**
 * カテゴリオブジェクトのリストからHTMLテーブルを生成する
 *
 * @param {Object} props - プロパティオブジェクト
 * @param {Categories[]} props.categories - カテゴリオブジェクトの配列
 *                                         `id`、`name`、`type`のプロパティを含みます。
 * @returns {JSX.Element} カテゴリのリストを表示するテーブル
 */
const CreateCategoryTable = ({categories, is_manage, setCategoryResponse}: {
    categories: Categories[],
    is_manage: boolean,
    setCategoryResponse: Dispatch<SetStateAction<GetCategoryResponse | undefined>>
}): JSX.Element => {
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
                        const hash = 'CategoryTable-' + create_hash(category.id + category.name + category.type);
                        return <CreateCategoryManageSet key={hash} key_hash={hash} category={category} setCategoryResponse={setCategoryResponse}/>
                    })
                    : categories.map(category => {
                        const hash = create_hash(category.id + category.name + category.type);
                        return <CreateCategorySet key={`CategoryTable-${hash}`} category={category} income_and_expenditure={INCOME_AND_EXPENDITURE}/>
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
        <tr className={background_color_list[category.type]}>
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
 * @param {String} props.key_hash - キー用のハッシュ
 * @param {Categories} props.category - カテゴリの詳細情報を含むオブジェクト
 * @param {Dispatch<SetStateAction<GetCategoryResponse | undefined>>} props.setCategoryResponse - カテゴリの更新や削除などの変更後にカテゴリレスポンスを更新するためのステート設定関数
 *
 * @returns {JSX.Element} カテゴリデータを持つテーブル行を表すJSX要素
 */
const CreateCategoryManageSet = ({key_hash, category, setCategoryResponse}: {
    key_hash: String,
    category: Categories,
    setCategoryResponse: Dispatch<SetStateAction<GetCategoryResponse | undefined>>
}): JSX.Element => {

    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState(0);

    useEffect(() => {
        setCategoryName(category.name);
        setCategoryType(category.type);

    }, [category]);

    const handleInputChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(event.target.value);
    };
    const handleInputChangeType = (event: ChangeEvent<HTMLInputElement>) => {
        setCategoryType(Number(event.target.value));
    };

    const delButtonHandler = useCallback(() => {
        del_category(category.id)
            .then(
                () => {
                    get_categories(setCategoryResponse);
                }
            );
    }, [category.id]);
    const updateButtonHandler = useCallback(() => {
        update_category(category.id, categoryName, categoryType)
            .then(
                () => {
                    get_categories(setCategoryResponse);
                }
            );
    }, [category.id, categoryName, categoryType]);

    return (
        <tr className={background_color_list[category.type]}>
            <td>{category.id}</td>
            <td>
                <input
                    key={`${key_hash}-category_name`}
                    type="text"
                    name={`${key_hash}-category_name`}
                    value={categoryName}
                    onChange={handleInputChangeName}
                />
            </td>
            <td>
                <div>
                    <input
                        key={`${key_hash}-category_type-expenditure`}
                        type="radio"
                        name={`${key_hash}-category_type`}
                        value={CATEGORY_TYPE_EXPENDITURE}
                        onChange={handleInputChangeType}
                        checked={categoryType === CATEGORY_TYPE_EXPENDITURE}
                    /> 支出
                </div>
                <div>
                    <input
                        key={`${key_hash}-category_type-income`}
                        type="radio"
                        name={`${key_hash}-category_type`}
                        value={CATEGORY_TYPE_INCOME}
                        onChange={handleInputChangeType}
                        checked={categoryType === CATEGORY_TYPE_INCOME}
                    /> 収入
                </div>
            </td>
            <td>
                <button onClick={updateButtonHandler}>更新</button>
            </td>
            <td>
                <button onClick={delButtonHandler}>削除</button>
            </td>
        </tr>
    );
}

export default CreateCategoryTable;


