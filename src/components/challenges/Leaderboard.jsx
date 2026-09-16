import leaderboard from '../../data/leaderboard.json'

const medal = (rank) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null)

export default function Leaderboard() {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-forest dark:text-paper">Weekly Leaderboard</h3>
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-forest dark:text-accent">
          Resets in 3d
        </span>
      </div>
      <div className="space-y-1.5">
        {leaderboard.map((u) => (
          <div
            key={u.rank}
            className={`flex items-center gap-3 rounded-2xl px-2.5 py-2 ${
              u.isUser ? 'bg-forest text-white' : 'bg-paper/60 dark:bg-white/5'
            }`}
          >
            <span
              className={`w-6 text-center font-display text-lg font-black ${
                u.isUser ? 'text-accent' : 'text-earth'
              }`}
            >
              {medal(u.rank) || u.rank}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
              {u.avatar}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-bold ${u.isUser ? 'text-white' : 'text-forest dark:text-paper'}`}>
                {u.name}
              </p>
              <p className={`text-[11px] ${u.isUser ? 'text-paper/70' : 'text-earth'}`}>Level {u.level}</p>
            </div>
            <span className="text-lg">{u.topBadge}</span>
            <span
              className={`font-mono text-sm font-bold ${u.isUser ? 'text-accent' : 'text-forest dark:text-paper'}`}
            >
              {u.points.toLocaleString('en-GB')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
