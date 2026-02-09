// // components/admin/VotesChart.jsx
// import { useState } from "react";

// export default function VotesChart() {
//   const [timeRange, setTimeRange] = useState("7 derniers jours");

//   const votesTrend = [
//     { day: "Lun", votes: 45 },
//     { day: "Mar", votes: 52 },
//     { day: "Mer", votes: 49 },
//     { day: "Jeu", votes: 63 },
//     { day: "Ven", votes: 58 },
//     { day: "Sam", votes: 72 },
//     { day: "Dim", votes: 89 },
//   ];

//   return (
//     <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
//       <div className="flex justify-between mb-4">
//         <h3 className="font-semibold">Votes</h3>

//         <select
//           value={timeRange}
//           onChange={(e) => setTimeRange(e.target.value)}
//           className="bg-neutral-800 px-3 py-1 rounded"
//         >
//           <option>7 derniers jours</option>
//           <option>30 derniers jours</option>
//         </select>
//       </div>

//       <div className="flex items-end space-x-4 h-40">
//         {votesTrend.map((d, i) => (
//           <div key={i} className="flex flex-col items-center flex-1">
//             <div
//               className="bg-blue-600 w-full rounded-t"
//               style={{ height: `${d.votes * 2}px` }}
//             />
//             <span className="text-xs mt-2 text-neutral-400">
//               {d.day}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import { 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function VotesChart({ votesData }) {
  // Transform data for chart
  const chartData = votesData?.trend?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    votes: item.count
  })) || [];

  // Show empty state if no data
  if (!votesData || chartData.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
        <h3 className="font-semibold mb-4">Voting Activity (Last 7 Days)</h3>
        <div className="flex items-center justify-center h-64 text-neutral-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No voting activity yet</p>
            <p className="text-sm">Chart will appear when jury starts voting</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Voting Activity</h3>
        <span className="text-sm text-neutral-400">Last 7 Days</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="votes" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}