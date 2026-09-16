import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

// Monthly food waste PREVENTED (kg) vs a typical UK household's monthly waste.
const data = [
  { month: 'Apr', kg: 2.1 },
  { month: 'May', kg: 3.4 },
  { month: 'Jun', kg: 2.9 },
  { month: 'Jul', kg: 4.2 },
  { month: 'Aug', kg: 3.8 },
  { month: 'Sep', kg: 4.6 },
]
const UK_AVG = 5.0 // kg wasted / household / month (approx)

export default function WasteChart() {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-bold text-forest dark:text-paper">Food Waste Prevented</h3>
        <span className="text-xs font-semibold text-accent">kg / month</span>
      </div>
      <p className="mb-2 text-xs text-earth dark:text-paper/60">
        Dashed line = avg UK household waste ({UK_AVG}kg). You're beating it. 🎉
      </p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94755C' }} />
            <ReferenceLine y={UK_AVG} stroke="#E53935" strokeDasharray="4 4" />
            <Bar dataKey="kg" radius={[6, 6, 0, 0]} maxBarSize={30}>
              {data.map((d, i) => (
                <Cell key={i} fill={i === data.length - 1 ? '#265832' : '#4CAF50'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
