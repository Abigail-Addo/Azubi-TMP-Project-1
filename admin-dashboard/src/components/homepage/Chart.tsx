import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390];
const pData = [2400, 1398, 9800, 3908, 4800, 3800];

const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const Chart = () => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-8">
            <h1 className="text-lg font-bold mb-4">Recent Revenue</h1>
            <hr className='text-[#E5E5EF]' />
            <BarChart
                height={250}
                series={[
                    { data: pData, label: 'pv', stack: 'stack1', color: '#60A5FA' },
                    { data: uData, label: 'uv', stack: 'stack1', color: '#2563EB' },
                ]}
                xAxis={[{
                    data: xLabels,
                    scaleType: 'band',
                    tickLabelStyle: { fontSize: 12, fill: '#6B7280' },
                    tickSize: 0,
                }]}
                yAxis={[{
                    width: 50,
                    valueFormatter: (value: number) => `${value / 1000}k`,
                    tickLabelStyle: { fontSize: 12, fill: '#6B7280' },
                    tickSize: 0,
                }]}
                grid={{
                    horizontal: true,
                    vertical: false,
                }}
                sx={{
                    '.MuiChartsAxis-line': { stroke: 'transparent' },
                    '.MuiChartsGrid-line': { stroke: '#E5E7EB' },
                    '.MuiBarElement-root': {
                        borderRadius: 4,
                    },
                }}
            />
        </div>
    );
}

export default Chart;
