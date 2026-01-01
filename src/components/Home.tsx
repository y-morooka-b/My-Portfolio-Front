import React, {useState, useEffect} from 'react';
import {get_categories, GetCategoryResponse} from '../libraries/transceiver/get_categories';
import {get_monthly_overview, ResponseGetMonthlyOverview} from "../libraries/transceiver/get_monthly_overview";
import CreateCategoryTable from "./sub_components/CreateCategoryTable";
import WrapPieChart from "./sub_components/WrapPieChart";
import {format} from "date-fns";
import OverviewTable from "./sub_components/OverviewTable";

const Home = () => {
    const [targetDate, setTargetDate] = useState<Date>();
    const [categoryResponse, setCategoryResponse] = useState<GetCategoryResponse>();
    const [monthlyOverview, setMonthlyOverview] = useState<ResponseGetMonthlyOverview>();

    useEffect(() => {
        let now = new Date();
        setTargetDate(now);

        const fetchData = async () => {
            get_categories(setCategoryResponse);
            get_monthly_overview(setMonthlyOverview);
        }
        fetchData();
    }, []);

    return (
        <>
            <h3>ホーム</h3>
            <br/>
            <h3> {targetDate && format(targetDate, 'yyyy年MM月')}分の概要</h3>
            <br/>

            <div className="container-fluid">
                <div className="row">
                    <div className="container-fluid">
                        <div className="row">
                            {
                                monthlyOverview &&
                                    <>
                                        <div className="col">
                                            <h4>今月の収入</h4>
                                            <h5>合計: {monthlyOverview.total_income}円</h5>
                                            <WrapPieChart sum_list={monthlyOverview.sum_income_list}/>
                                        </div>
                                        <div className="col">
                                            <h4>今月の支出</h4>
                                            <h5>合計: {monthlyOverview.total_expenditure}円</h5>
                                            <WrapPieChart sum_list={monthlyOverview.sum_expenditure_list}/>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
                <br/>
                <div className="col">
                    {monthlyOverview &&
                        <OverviewTable sum_income_list={monthlyOverview.sum_income_list} sum_expenditure_list={monthlyOverview.sum_expenditure_list}/>
                    }
                </div>
            </div>
        </>
    );
}
export default Home;
