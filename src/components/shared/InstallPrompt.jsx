import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

// "Add to Home Screen" banner driven by the beforeinstallprompt event (Android/Chrome).
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setDeferred(e)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!deferred || dismissed) return null

  const install = async () => {
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }

  return (
    <div className="fixed inset-x-3 bottom-24 z-[55] mx-auto flex max-w-[406px] items-center gap-3 rounded-2xl bg-forest px-4 py-3 text-white shadow-xl animate-slide-up">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
        <Download size={20} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold">Install Go Green</p>
        <p className="text-[11px] text-paper/70">Add to your home screen for the full app experience.</p>
      </div>
      <button onClick={install} className="rounded-full bg-accent px-3 py-2 text-xs font-bold active:scale-95">
        Install
      </button>
      <button onClick={() => setDismissed(true)} className="text-paper/60 active:scale-90">
        <X size={18} />
      </button>
    </div>
  )
}
