import { memo } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";

const Datachart = memo(({ data }) => (
    <ResponsiveContainer width="100%" height="200">
        <LineChart data={data} style={{ fontSize: "10px", margin: "0px" }}>
            <CartesianGrid strokeDasharray="0.5 3" />
            <Line
                dataKey="thrust"
                stroke="var(--yellow)"
                isAnimationActive={false}
                dot={{ r: 1 }}
                strokeWidth={0.7}
                activeDot={false}
            />
            <XAxis />
            <YAxis width={20} />
        </LineChart>
    </ResponsiveContainer>
));

export default Datachart;
