import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { DecodeHintType, BarcodeFormat } from '@zxing/library'
import { X, CameraOff, Keyboard } from 'lucide-react'

const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
])

// Live camera barcode scanner. Falls back to manual entry when there's no
// camera / permission is denied (desktop, blocked, etc.).
export default function CameraScanner({ onDetected, onClose, onManual }) {
  const videoRef = useRef(null)
  const controlsRef = useRef(null)
  const doneRef = useRef(false)
  const [error, setError] = useState(null)
  const [manual, setManual] = useState('')

  useEffect(() => {
    const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 250 })
    let cancelled = false

    reader
      .decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoRef.current,
        (result, err, controls) => {
          controlsRef.current = controls
          if (cancelled) {
            controls?.stop()
            return
          }
          if (result && !doneRef.current) {
            doneRef.current = true
            controls?.stop()
            onDetected(result.getText())
          }
        }
      )
      .catch((e) => {
        if (!cancelled) setError(e?.name === 'NotAllowedError' ? 'denied' : 'unavailable')
      })

    return () => {
      cancelled = true
      controlsRef.current?.stop()
    }
  }, [onDetected])

  const submitManual = () => {
    const code = manual.replace(/\D/g, '')
    if (code.length >= 8) onManual(code)
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="font-display text-lg font-black text-white">Scan a barcode</span>
        <button onClick={onClose} className="rounded-full bg-white/15 p-2 text-white active:scale-90">
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline autoPlay />

        {!error && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative h-44 w-72 rounded-2xl border-2 border-white/40">
              {['top-0 left-0 border-l-4 border-t-4 rounded-tl-2xl', 'top-0 right-0 border-r-4 border-t-4 rounded-tr-2xl', 'bottom-0 left-0 border-l-4 border-b-4 rounded-bl-2xl', 'bottom-0 right-0 border-r-4 border-b-4 rounded-br-2xl'].map(
                (c) => (
                  <span key={c} className={`absolute h-8 w-8 border-accent ${c}`} />
                )
              )}
              <div className="absolute left-2 right-2 top-1/2 h-0.5 animate-pulse rounded-full bg-accent shadow-[0_0_16px_4px_rgba(76,175,80,0.9)]" />
            </div>
            <p className="mt-4 text-sm text-white/70">Line up the barcode inside the frame</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0d1912] px-8 text-center">
            <CameraOff size={40} className="text-white/40" />
            <p className="text-sm text-white/70">
              {error === 'denied'
                ? 'Camera permission was blocked. Enter a barcode number instead:'
                : 'No camera available here. Enter a barcode number to look it up:'}
            </p>
          </div>
        )}
      </div>

      {/* Manual entry — always available (great for desktop testing) */}
      <div className="flex items-center gap-2 border-t border-white/10 bg-[#0d1912] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Keyboard size={18} className="shrink-0 text-white/50" />
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitManual()}
          inputMode="numeric"
          placeholder="Type a barcode (e.g. 5449000000996)"
          className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
        />
        <button
          onClick={submitManual}
          className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-white active:scale-95"
        >
          Look up
        </button>
      </div>
    </div>
  )
}
