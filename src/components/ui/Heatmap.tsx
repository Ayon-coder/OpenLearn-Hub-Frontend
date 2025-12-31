import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

const data = [
  {
    name: 'Computer Science',
    children: [
      { name: 'OS Scheduling', size: 85, color: '#16a34a' },
      { name: 'Memory Mgmt', size: 40, color: '#facc15' },
      { name: 'File Systems', size: 12, color: '#ef4444' },
      { name: 'Deadlocks', size: 65, color: '#4ade80' },
      { name: 'Concurrency', size: 30, color: '#f87171' },
    ],
  },
  {
    name: 'Mathematics',
    children: [
      { name: 'Calculus I', size: 95, color: '#16a34a' },
      { name: 'Linear Algebra', size: 20, color: '#f87171' },
      { name: 'Probability', size: 55, color: '#facc15' },
    ],
  },
];

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, name, value, color } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color || '#ddd',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1),
          strokeOpacity: 1 / (depth + 1),
        }}
      />
      {width > 40 && height > 20 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="600"
        >
          {name}
        </text>
      )}
    </g>
  );
};

export const Heatmap: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Knowledge Coverage Heatmap</h2>
          <p className="text-sm text-gray-500">Green = Well covered, Yellow = Needs review, Red = Missing</p>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomizedContent />}
          >
            <Tooltip />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
