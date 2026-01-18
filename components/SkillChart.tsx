import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis
} from 'recharts';
import { Skill } from '../types';

interface SkillChartProps {
  data: Skill[];
}

const SkillChart: React.FC<SkillChartProps> = ({ data }) => {
  return (
    /* 
      Fix: Menghapus class 'flex items-center justify-center' dari parent div.
      ResponsiveContainer membutuhkan parent block dengan dimensi pasti (h-[300px] w-full)
      agar tidak terjadi kalkulasi 0 width/height saat mounting.
    */
    <div className="h-[300px] w-full relative">
      {/* Decorative background circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 border border-neutral-800 rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#333" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#a3a3a3', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Fa'al"
            dataKey="A"
            stroke="#ffffff"
            strokeWidth={2}
            fill="#ffffff"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillChart;