import {useState, useEffect} from 'react';
import {get_categories, GetCategoryResponse} from '../libraries/transceiver/get_categories';
import {get_monthly_overview, ResponseGetMonthlyOverview} from "../libraries/transceiver/get_monthly_overview";
import CreateCategoryTable from "./sub_components/CreateCategoryTable";
import WrapPieChart from "./sub_components/WrapPieChart";

const Home = () => {

    const [categoryResponse, setCategoryResponse] = useState<GetCategoryResponse>();
    const [monthlyOverview, setMonthlyOverview] = useState<ResponseGetMonthlyOverview>();

    useEffect(() => {
        const fetchData = async () => {
            get_categories(setCategoryResponse);
            get_monthly_overview(setMonthlyOverview);
        }
        fetchData();
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <h3>ホーム</h3>
                <div className="container-fluid">
                    <div className="row">
                        {
                            monthlyOverview === undefined
                                ? <>
                                    <div className="col">
                                        <div>Loading...</div>
                                    </div>
                                    <div className="col">
                                        <div>Loading...</div>
                                    </div>
                                </>
                                : <>
                                    <div className="col">
                                        <h4>今月の収入</h4>
                                        <WrapPieChart sum_list={monthlyOverview.sum_income_list}/>
                                    </div>
                                    <div className="col">
                                        <h4>今月の支出</h4>
                                        <WrapPieChart sum_list={monthlyOverview.sum_expenditure_list}/>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                </div>
                <div className="col-3">
                    {
                        categoryResponse === undefined
                            ? <div>Loading...</div>
                            : categoryResponse.categories.length === 0
                                ? <div>No categories</div>
                                : <CreateCategoryTable categories={categoryResponse.categories} is_manage={false} setCategoryResponse={setCategoryResponse}/>
                    }
                </div>
            </div>
        </div>
    );
}
export default Home;
