import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';
import {MonthlySumInfo} from "../../libraries/transceiver/get_monthly_overview";

/**
 * WrapPieChartは円グラフをレンダリングするReactの機能コンポーネント
 * 各セグメントがカテゴリを表し、異なる色でスタイリングされた円グラフを使用して月次サマリーのリストを可視化
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {MonthlySumInfo[]} props.sum_list - カテゴリの詳細と対応する合計値を含む
 * 月次サマリー情報の配列
 *
 * @returns {JSX.Element} データの視覚化とインタラクションを含むスタイリングされた円グラフ
 */
const WrapPieChart = ({sum_list}: { sum_list: MonthlySumInfo[]}) => {

    const COLORS = [
        '#D35400',
        '#D4AC0D',
        '#27AE60',
        '#196F3D',
        '#16A085',
        '#2980B9',
        '#5DADE2',
        '#8E44AD',
        '#C678DD',
        '#A569BD',
        '#85929E'
    ];

    return (
        <div className="chart-container">
            <PieChart width={600} height={600}>
                <Pie
                    data={sum_list as unknown as { [key: string]: any }[]}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="category_name"
                    label
                >
                    {sum_list.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                <Tooltip/>
                <Legend align="center"/>
            </PieChart>
        </div>
    );
}

export default WrapPieChart;
