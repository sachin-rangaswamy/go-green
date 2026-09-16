import { useState, useCallback, useRef, lazy, Suspense } from 'react'
import { ScanLine, Camera, LayoutGrid, Loader2, SearchX } from 'lucide-react'
import Header from '../layout/Header.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { lookupProduct } from '../../data/openFoodFacts.js'
import ProductSelector from './ProductSelector.jsx'
import ProductCard from './ProductCard.jsx'

// zxing is heavy (~400KB) — only load it when the camera is actually opened.
const CameraScanner = lazy(() => import('./CameraScanner.jsx'))

// modes: idle | camera | selecting | scanning | result | notfound
export default function ScanScreen() {
  const { addPoints } = useApp()
  const [mode, setMode] = useState('idle')
  const [product, setProduct] = useState(null)
  const [failedCode, setFailedCode] = useState(null)
  const abortRef = useRef(null)

  const handleBarcode = useCallback(
    async (code) => {
      setMode('scanning')
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const p = await lookupProduct(code, { signal: controller.signal })
        setProduct(p)
        setMode('result')
        addPoints(5, `Scanned ${p.brand}`)
      } catch (e) {
        if (e.name === 'AbortError') return
        setFailedCode(code)
        setMode('notfound')
      }
    },
    [addPoints]
  )

  const pickDemo = (p) => {
    setProduct(p)
    setMode('scanning')
    setTimeout(() => {
      setMode('result')
      addPoints(5, `Scanned ${p.brand}`)
    }, 1000)
  }

  const reset = () => {
    abortRef.current?.abort()
    setMode('idle')
    setProduct(null)
    setFailedCode(null)
  }

  return (
    <>
      <Header title="Scanner" />
      <main className="relative flex-1 overflow-hidden bg-[#0d1912]">
        {/* Idle viewfinder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-b from-[#16281c] to-[#0d1912]">
            {['top-4 left-4 border-l-4 border-t-4', 'top-4 right-4 border-r-4 border-t-4', 'bottom-4 left-4 border-l-4 border-b-4', 'bottom-4 right-4 border-r-4 border-b-4'].map(
              (c) => (
                <span key={c} className={`absolute h-10 w-10 rounded-md border-accent ${c}`} />
              )
            )}
            <div className="absolute left-6 right-6 top-6 h-0.5 animate-scan-line rounded-full bg-accent shadow-[0_0_18px_4px_rgba(76,175,80,0.9)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <ScanLine size={44} className="text-white/30" />
              <p className="px-6 text-xs text-white/40">
                Scan any barcode for instant Health + Eco scores from real product data
              </p>
            </div>
          </div>

          <button
            onClick={() => setMode('camera')}
            className="mt-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-white shadow-lg shadow-accent/40 transition active:scale-95"
          >
            <Camera size={18} /> Scan with Camera
          </button>
          <button
            onClick={() => setMode('selecting')}
            className="mt-3 flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 active:scale-95"
          >
            <LayoutGrid size={15} /> Try demo products
          </button>
          <p className="mt-3 text-xs text-white/40">Powered by Open Food Facts · +5 🌿 per scan</p>
        </div>

        {/* Live camera */}
        {mode === 'camera' && (
          <Suspense
            fallback={
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
                <Loader2 size={40} className="animate-spin text-accent" />
              </div>
            }
          >
            <CameraScanner onDetected={handleBarcode} onManual={handleBarcode} onClose={reset} />
          </Suspense>
        )}

        {/* Looking-up loader */}
        {mode === 'scanning' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[#0d1912]/95">
            {product ? (
              <div
                className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl font-display text-4xl font-black text-white"
                style={{ background: product.color }}
              >
                {product.initial}
              </div>
            ) : (
              <Loader2 size={44} className="animate-spin text-accent" />
            )}
            <p className="font-mono text-sm text-accent">Looking up product…</p>
          </div>
        )}

        {/* Not found */}
        {mode === 'notfound' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#0d1912]/95 px-8 text-center">
            <SearchX size={44} className="text-white/40" />
            <div>
              <p className="font-semibold text-white">Product not found</p>
              <p className="mt-1 text-sm text-white/50">
                <span className="font-mono">{failedCode}</span> isn't in the Open Food Facts database yet.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setMode('camera')}
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white active:scale-95"
              >
                Scan another
              </button>
              <button
                onClick={() => setMode('selecting')}
                className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white/80 active:scale-95"
              >
                Try demo products
              </button>
            </div>
          </div>
        )}

        {/* Bottom sheets */}
        {(mode === 'selecting' || mode === 'result') && (
          <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/40" onClick={reset}>
            <div onClick={(e) => e.stopPropagation()}>
              {mode === 'selecting' && <ProductSelector onPick={pickDemo} onClose={reset} />}
              {mode === 'result' && product && <ProductCard product={product} onClose={reset} />}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
