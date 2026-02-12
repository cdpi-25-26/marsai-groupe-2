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
  const chartData = votesData?.trend?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    votes: item.count
  })) || [];

  // Empty state
  if (!votesData || chartData.length === 0) {
    return (
      <div
        className="
          bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60
          backdrop-blur-xl
          border border-white/10
          rounded-xl
          p-6
          shadow-xl shadow-black/30
          hover:shadow-2xl hover:shadow-blue-500/10
          transition-all duration-300
        "
      >
        <h3 className="font-semibold text-lg text-white mb-4">
          Voting Activity (Last 7 Days)
        </h3>

        <div className="flex items-center justify-center h-48 text-white/50">
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <p>No voting activity yet</p>
            <p className="text-xs text-white/40">
              Chart will appear when jury starts voting
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60
        backdrop-blur-xl
        border border-white/10
        rounded-xl
        p-6
        shadow-xl shadow-black/30
        hover:shadow-2xl hover:shadow-blue-500/10
        transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white text-lg">Voting Activity</h3>
        <span className="text-xs text-white/40">Last 7 Days</span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            style={{ fontSize: '11px' }}
          />

          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '11px' }}
          />

          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(20,20,25,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              backdropFilter: 'blur(12px)',
              color: '#fff'
            }}
          />

          <Line 
            type="monotone" 
            dataKey="votes" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
