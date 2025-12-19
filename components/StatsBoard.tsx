import React, { useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AdventureStat } from '../types';

interface StatsBoardProps {
  stats: AdventureStat[];
  onStatChange?: (statName: string, newValue: number) => void;
}

export const StatsBoard: React.FC<StatsBoardProps> = ({ stats, onStatChange }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleChartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current || !onStatChange) return;

    const rect = chartRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const relativeX = e.clientX - rect.left;
    
    // Only process clicks within the chart bounds
    if (relativeY < 0 || relativeY > rect.height || relativeX < 0 || relativeX > rect.width) {
      return;
    }
    
    const barHeight = rect.height / stats.length;
    const barIndex = Math.floor(relativeY / barHeight);
    
    // Ensure barIndex is within valid range
    if (barIndex < 0 || barIndex >= stats.length) return;

    const stat = stats[barIndex];
    
    // Calculate percentage (considering margins)
    // Left margin is approximately 50px, right margin is approximately 20px
    const leftMargin = 50;
    const rightMargin = 20;
    const availableWidth = rect.width - leftMargin - rightMargin;
    
    // Only update if click is within the actual bar area
    if (relativeX < leftMargin || relativeX > rect.width - rightMargin) {
      return;
    }
    
    const clickPercent = Math.max(0, Math.min(1, (relativeX - leftMargin) / availableWidth));
    const newValue = Math.round(clickPercent * stat.max);
    
    onStatChange(stat.name, newValue);
  };
  return (
    <div className="bg-stone-800/90 backdrop-blur-md border-4 border-stone-600 p-4 rounded-none shadow-xl w-full transition-all duration-300">
      <h3 className="mc-font text-white text-center mb-6 text-sm md:text-base text-yellow-400 drop-shadow-md animate-pulse">
        当前状态
      </h3>
      <div className="h-64 w-full" ref={chartRef} onClick={handleChartClick} style={{ cursor: 'pointer' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stats}
            layout="vertical"
            margin={{ top: 8, right: 20, left: 50, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: 'white', fontFamily: '"Press Start 2P"', fontSize: 11 }} 
              width={40}
            />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ 
                backgroundColor: '#2a2a2a', 
                border: '2px solid #fff', 
                fontFamily: '"Press Start 2P"',
                fontSize: '11px',
                color: '#fff',
                padding: '8px'
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-stone-400 text-xs mc-font">
        渲染距离：极致
      </div>
    </div>
  );
};