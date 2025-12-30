import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';

const WrapPieChart = ({data, colors} : {data:{}[], colors: string[]}) => {
    return (
        <div className="chart-container">
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx={200}
                    cy={200}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
                    ))}
                </Pie>
                <Tooltip/>
                <Legend/>
            </PieChart>
        </div>
    );
}

export default WrapPieChart;
