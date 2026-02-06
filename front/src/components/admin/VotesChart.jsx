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
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

/**
 * Votes activity chart
 */
export default function VotesChart({ data = [] }) {
  /* ===============================
     SAFETY FALLBACK
  =============================== */
  if (!data.length) {
    return (
      <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
        <h3 className="text-lg font-semibold mb-4">
          Activité des votes
        </h3>
        <p className="text-neutral-400">
          Aucune donnée disponible
        </p>
      </div>
    );
  }

  /* ===============================
     FORMAT DATE
  =============================== */
  const formatted = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString()
  }));

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
      <h3 className="text-lg font-semibold mb-6">
        Activité des votes (7 derniers jours)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

