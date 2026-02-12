// import { 
//   LineChart, 
//   Line,
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer 
// } from 'recharts';

// export default function VotesChart({ votesData }) {
//   const chartData = votesData?.trend?.map(item => ({
//     date: new Date(item.date).toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric' 
//     }),
//     votes: item.count
//   })) || [];

//   // Empty state
//   if (!votesData || chartData.length === 0) {
//     return (
//       <div
//         className="
//           bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60
//           backdrop-blur-xl
//           border border-white/10
//           rounded-xl
//           p-6
//           shadow-xl shadow-black/30
//           hover:shadow-2xl hover:shadow-blue-500/10
//           transition-all duration-300
//         "
//       >
//         <h3 className="font-semibold text-lg text-white mb-4">
//           Voting Activity (Last 7 Days)
//         </h3>

//         <div className="flex items-center justify-center h-48 text-white/50">
//           <div className="text-center">
//             <div className="text-3xl mb-2">📊</div>
//             <p>No voting activity yet</p>
//             <p className="text-xs text-white/40">
//               Chart will appear when jury starts voting
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="
//         bg-gradient-to-br from-[#1a1c20]/60 to-[#0f1114]/60
//         backdrop-blur-xl
//         border border-white/10
//         rounded-xl
//         p-6
//         shadow-xl shadow-black/30
//         hover:shadow-2xl hover:shadow-blue-500/10
//         transition-all duration-300
//       "
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="font-semibold text-white text-lg">Voting Activity</h3>
//         <span className="text-xs text-white/40">Last 7 Days</span>
//       </div>

//       {/* Chart */}
//       <ResponsiveContainer width="100%" height={260}>
//         <LineChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

//           <XAxis 
//             dataKey="date" 
//             stroke="#9CA3AF"
//             style={{ fontSize: '11px' }}
//           />

//           <YAxis 
//             stroke="#9CA3AF"
//             style={{ fontSize: '11px' }}
//           />

//           <Tooltip 
//             contentStyle={{
//               backgroundColor: 'rgba(20,20,25,0.8)',
//               border: '1px solid rgba(255,255,255,0.1)',
//               borderRadius: '10px',
//               backdropFilter: 'blur(12px)',
//               color: '#fff'
//             }}
//           />

//           <Line 
//             type="monotone" 
//             dataKey="votes" 
//             stroke="#3B82F6" 
//             strokeWidth={3}
//             dot={{ fill: '#3B82F6', r: 4 }}
//             activeDot={{ r: 6 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
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
  const chartData = votesData?.trend?.map(item => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    votes: item.count
  })) || [];

  // État vide stylisé
  if (!votesData || chartData.length === 0) {
    return (
      <div
        className="
          group
          relative
          bg-gradient-to-br from-white/[0.07] to-white/[0.02]
          backdrop-blur-2xl
          border border-white/10 hover:border-blue-500/30
          rounded-2xl
          p-6
          shadow-2xl shadow-black/40
          hover:shadow-3xl hover:shadow-blue-500/20
          transition-all duration-500
          overflow-hidden
        "
      >
        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Effet de lueur */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-xl transition-opacity duration-700" />

        <div className="relative flex justify-between items-center mb-4">
          <h3 className="font-light text-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Activité des votes
          </h3>
          <span className="px-2 py-1 text-[9px] font-mono bg-white/5 border border-white/10 rounded-full text-white/40 uppercase tracking-wider">
            7 derniers jours
          </span>
        </div>

        <div className="flex flex-col items-center justify-center h-48">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 opacity-50" />
            <span className="relative text-4xl drop-shadow-lg">📊</span>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm font-light text-white/80">Aucune activité pour le moment</p>
            <p className="text-[11px] text-white/40 max-w-[200px]">
              Le graphique apparaîtra lorsque le jury commencera à voter
            </p>
          </div>
          
          {/* Indicateur de statut */}
          <div className="absolute bottom-6 left-6 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-yellow-400/60 rounded-full animate-pulse" />
            <span className="text-[9px] text-white/30 uppercase tracking-wider">En attente de votes</span>
          </div>
        </div>

        {/* Badges décoratifs */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden opacity-5">
          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        group
        relative
        bg-gradient-to-br from-white/[0.07] to-white/[0.02]
        backdrop-blur-2xl
        border border-white/10 hover:border-blue-500/30
        rounded-2xl
        p-6
        shadow-2xl shadow-black/40
        hover:shadow-3xl hover:shadow-blue-500/20
        transition-all duration-500
        overflow-hidden
      "
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Effet de lueur */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-xl transition-opacity duration-700" />

      {/* En-tête stylisé */}
      <div className="relative flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-light bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Activité des votes
            </h3>
            <p className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
              <span className="w-1 h-1 bg-green-400/60 rounded-full animate-pulse" />
              Mise à jour en temps réel
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="text-[10px] font-medium text-blue-300/90">
              +{chartData.reduce((acc, curr) => acc + curr.votes, 0)} total
            </span>
          </span>
          <span className="px-2 py-1 text-[9px] font-mono bg-white/5 border border-white/10 rounded-full text-white/40 uppercase tracking-wider">
            7 jours
          </span>
        </div>
      </div>

      {/* Graphique */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: '10px', fontFamily: 'monospace' }}
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            
            <YAxis 
              stroke="rgba(255,255,255,0.3)"
              style={{ fontSize: '10px', fontFamily: 'monospace' }}
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              width={35}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(10,10,15,0.9)',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                padding: '10px 14px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                fontSize: '11px',
              }}
              labelStyle={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '10px',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              itemStyle={{
                color: '#60a5fa',
                fontWeight: '500'
              }}
            />
            
            <Line 
              type="monotone" 
              dataKey="votes" 
              stroke="url(#colorGradient)"
              strokeWidth={3}
              dot={{ 
                fill: '#3b82f6', 
                r: 4,
                stroke: 'rgba(59,130,246,0.3)',
                strokeWidth: 2,
                fillOpacity: 0.8
              }}
              activeDot={{ 
                r: 6, 
                fill: '#60a5fa',
                stroke: 'rgba(96,165,250,0.5)',
                strokeWidth: 3,
              }}
            />
            
            {/* Définition du gradient */}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>

        {/* Overlay gradient subtil */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Pied de carte */}
      <div className="relative flex justify-between items-center mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-[9px] text-white/30 uppercase tracking-wider">Votes quotidiens</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-white/70">
              Pic : {Math.max(...chartData.map(d => d.votes))}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-white/30">Mis à jour</span>
          <span className="text-[9px] text-white/50 font-mono">
            {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Badges décoratifs */}
      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 overflow-hidden opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
