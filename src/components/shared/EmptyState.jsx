// Consistent empty state: emoji, title, subtitle, optional action button.
export default function EmptyState({ emoji = '🌱', title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white/60 px-6 py-10 text-center dark:bg-white/5">
      <div className="mb-2 text-5xl">{emoji}</div>
      <p className="font-bold text-forest dark:text-paper">{title}</p>
      {subtitle && <p className="mt-1 max-w-[240px] text-sm text-earth dark:text-paper/60">{subtitle}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
