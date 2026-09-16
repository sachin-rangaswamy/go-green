import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useApp } from '../../context/AppContext.jsx'
import { treesFromCo2 } from '../../utils/formatters.js'

export default function ImpactDashboard() {
  const { state } = useApp()
  const u = state.user

  const tiles = [
    { label: 'CO₂ saved', value: `${u.co2Saved}kg`, icon: '☁️' },
    { label: 'Waste cut', value: `${u.foodWastePrevented}kg`, icon: '🗑️' },
    { label: 'Points', value: u.points.toLocaleString('en-GB'), icon: '🌿' },
    { label: 'Trees', value: treesFromCo2(u.co2Saved), icon: '🌳' },
  ]

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
      <h3 className="mb-3 font-bold text-forest dark:text-paper">Lifetime Impact</h3>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl bg-paper/60 p-2 text-center dark:bg-white/5">
            <div className="text-xl">{t.icon}</div>
            <div className="font-mono text-sm font-bold text-forest dark:text-paper">{t.value}</div>
            <div className="text-[10px] text-earth">{t.label}</div>
          </div>
        ))}
      </div>

      <p className="mb-1 text-xs font-semibold text-earth">CO₂ saved over 6 months (kg)</p>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={u.monthlyStats} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94755C' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94755C' }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: 12 }}
              labelStyle={{ fontWeight: 700, color: '#265832' }}
            />
            <Line
              type="monotone"
              dataKey="co2"
              name="CO₂ saved"
              stroke="#265832"
              strokeWidth={3}
              dot={{ r: 3, fill: '#4CAF50' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
