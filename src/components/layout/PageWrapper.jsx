// Scrollable page body with a consistent fade-in and bottom padding for the nav.
export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`flex-1 overflow-y-auto overflow-x-hidden bg-paper dark:bg-[#0f1f14] ${className}`}>
      <div className="animate-fade-in px-4 pb-6 pt-4">{children}</div>
    </main>
  )
}
