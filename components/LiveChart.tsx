import React from 'react';
import { Candidate } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LiveChartProps {
  data: Candidate[];
}

const LiveChart: React.FC<LiveChartProps> = ({ data }) => {
  // Sort data for chart to look nice (descending)
  const sortedData = [...data].sort((a, b) => b.votes - a.votes);

  return (
    <div className="w-full h-64 bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">实时战报</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            width={70}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number) => [value.toLocaleString(), '票数']}
          />
          <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={20} animationDuration={500}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;