import { useState, useEffect } from 'react';
import {get_categories, GetCategoryResponse} from '../libraries/transceiver/get_categories';
import CreateCategoryTable from "./sub_components/CreateCategoryTable";

const Home = () => {

    const [categoryResponse, setCategoryResponse] = useState<GetCategoryResponse>();

    useEffect(() => {
        const fetchData = async () => {
            get_categories(setCategoryResponse);

        }
        fetchData();
    }, []);

    return (
        <div>
            Home
            {
                categoryResponse === undefined
                    ? <div>Loading...</div>
                    : categoryResponse.categories.length === 0
                        ? <div>No categories</div>
                        : <CreateCategoryTable categories={categoryResponse.categories} is_manage={false}/>
            }
        </div>
    );
}
export default Home;
