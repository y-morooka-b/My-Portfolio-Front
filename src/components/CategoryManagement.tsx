import {useState, useEffect} from 'react';
import {get_categories, GetCategoryResponse} from '../libraries/transceiver/get_categories';
import {set_category} from '../libraries/transceiver/set_category';
import CreateCategoryTable from "./sub_components/CreateCategoryTable";
import '../components_css/CategoryManagement.css';

/**
 * カテゴリを管理するためのコンポーネントで、
 * 新しいカテゴリを登録し、既存のカテゴリを表示することができます。
 */
const CategoryManagement = () => {
    const [categoryResponse, setCategoryResponse] = useState<GetCategoryResponse>();

    useEffect(() => {
        const fetchData = async () => {
            get_categories(setCategoryResponse);

        }
        fetchData();
    }, []);

    function category_registration(formData: FormData) {
        let category_name = formData.get('category_name');
        let category_type = formData.get('category_type');

        set_category(
            String(category_name),
            Number(category_type)
        ).then(
            () => {
                get_categories(setCategoryResponse);
            }
        )

    }

    return (
        <>
            <h2>カテゴリ管理</h2>
            <br/>
            <div className="container-md">
                <div className="row">
                    <div className="col">
                        <form id="add-category-form" action={category_registration}>
                            <table>
                                <tbody>
                                <tr>
                                    <th><label>カテゴリ名</label></th>
                                    <td><input type="text" name="category_name"/></td>
                                </tr>
                                <tr>
                                    <th><label>カテゴリタイプ</label></th>
                                    <td>
                                        <div>
                                            <input type="radio" name="category_type" value="0" defaultChecked/> 支出
                                        </div>
                                        <div>
                                            <input type="radio" name="category_type" value="1"/> 収入
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2} align={"right"}>
                                            <input id="add-category-foot" type={"submit"}/>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </form>
                    </div>
                    <div className="col">
                        {
                            categoryResponse === undefined
                                ? <div>Loading...</div>
                                : categoryResponse.categories.length === 0
                                    ? <div>No categories</div>
                                    : <CreateCategoryTable categories={categoryResponse.categories}/>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default CategoryManagement;