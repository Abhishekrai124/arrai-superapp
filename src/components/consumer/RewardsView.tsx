import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ScratchCard } from '../../types';
import { 
  Gift, 
  Sparkles, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  X,
  Trophy,
  ArrowLeft
} from 'lucide-react';

interface ScratchCanvasProps {
  card: ScratchCard;
  onRevealed: (amount: number) => void;
  onClose: () => void;
}

const ScratchCanvasModal: React.FC<ScratchCanvasProps> = ({ card, onRevealed, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw scratch card golden foil
    const width = canvas.width;
    const height = canvas.height;

    // Create luxury gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#f59e0b'); // amber-500
    grad.addColorStop(0.5, '#fbbf24'); // amber-400
    grad.addColorStop(1, '#d97706'); // amber-600

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative star patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text on foil
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH & WIN', width / 2, height / 2 - 10);
    ctx.font = '12px system-ui';
    ctx.fillText('Peel foil to reveal cashback', width / 2, height / 2 + 15);
  }, [card]);

  const scratch = (clientX: number, clientY: number) => {
    if (isDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Estimate scratched pixels
    checkPercentScratched();
  };

  const checkPercentScratched = () => {
    const canvas = canvasRef.current;
    if (!canvas || isDone) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sample pixels
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const step = 32; // check every 8th pixel to be performant

    for (let i = 3; i < pixels.length; i += step * 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / (step * 4);
    const percent = Math.round((transparentCount / totalSampled) * 100);
    setScratchedPercent(percent);

    if (percent > 40 && !isDone) {
      setIsDone(true);
      // clear canvas completely
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onRevealed(card.amount);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isScratching && e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 text-white text-center space-y-4 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>ARRAI Rewards Card</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scratch Card Frame */}
        <div className="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/40 bg-gradient-to-tr from-indigo-900 to-purple-900 flex flex-col items-center justify-center">
          
          {/* Hidden Cashback Layer Underneath */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 select-none">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-2 animate-bounce">
              <Trophy className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">You Won!</span>
            <div className="text-4xl font-black font-mono text-white mt-1">
              ₹{card.amount}
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold mt-1">
              ✓ Credited to ARRAI Wallet
            </span>
          </div>

          {/* Canvas Foil Overlay */}
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className={`absolute inset-0 cursor-crosshair touch-none transition-opacity duration-300 ${
              isDone ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-200">{card.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{card.description}</p>
        </div>

        {isDone ? (
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
          >
            Claim & Return to Wallet
          </button>
        ) : (
          <p className="text-[11px] text-amber-300 animate-pulse">
            {scratchedPercent > 0 ? `Scratched: ${scratchedPercent}%` : '👉 Drag your finger or mouse across the foil to scratch!'}
          </p>
        )}

      </div>
    </div>
  );
};

export const RewardsView: React.FC = () => {
  const { scratchCards, executeScratchCard, walletBalance, openModal, setConsumerTab } = useAppStore();
  const [activeCardForScratch, setActiveCardForScratch] = useState<ScratchCard | null>(null);

  const totalWon = scratchCards
    .filter(c => c.isScratched)
    .reduce((sum, c) => sum + c.amount, 0);

  const unscratchedCount = scratchCards.filter(c => !c.isScratched).length;

  const handleReveal = async (amount: number) => {
    if (activeCardForScratch) {
      await executeScratchCard(activeCardForScratch.id);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Rewards Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">ARRAI Rewards & Scratch Cards</h2>
          </div>
          <p className="text-xs text-amber-100 mt-1">
            Earn instant cashback on every UPI payment and BBPS utility bill.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setConsumerTab('home')}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pay Dashboard</span>
          </button>

          <div className="bg-black/20 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-3">
            <div>
              <span className="text-[10px] text-amber-200 uppercase font-semibold block">Total Cashback Won</span>
              <span className="text-xl font-black font-mono text-white">₹{totalWon.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-7 w-px bg-white/20" />
            <span className="text-xs font-bold text-amber-200">{unscratchedCount} Unopened</span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {scratchCards.map((card) => (
          <div
            key={card.id}
            onClick={() => {
              if (!card.isScratched) setActiveCardForScratch(card);
            }}
            className={`rounded-3xl border overflow-hidden p-5 flex flex-col justify-between transition-all select-none ${
              card.isScratched
                ? 'bg-white border-slate-200 opacity-90'
                : 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white border-amber-400/50 shadow-lg shadow-amber-500/15 cursor-pointer hover:scale-[1.02] active:scale-98'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  card.isScratched
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-white/20 text-white border border-white/30'
                }`}>
                  {card.isScratched ? 'Revealed' : 'Unscratched'}
                </span>

                <Sparkles className={`w-4 h-4 ${card.isScratched ? 'text-slate-300' : 'text-amber-200 animate-spin'}`} />
              </div>

              <h3 className={`text-sm font-bold ${card.isScratched ? 'text-slate-800' : 'text-white'}`}>
                {card.title}
              </h3>
              <p className={`text-xs mt-0.5 ${card.isScratched ? 'text-slate-500' : 'text-amber-100'}`}>
                {card.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100/30 flex items-center justify-between">
              {card.isScratched ? (
                <div>
                  <span className="text-[10px] text-slate-400 block">Cashback Won</span>
                  <span className="text-xl font-black font-mono text-emerald-600">₹{card.amount}</span>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] text-amber-200 block">Potential Reward</span>
                  <span className="text-base font-black font-mono text-white">Up to ₹100</span>
                </div>
              )}

              {card.isScratched ? (
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  In Wallet
                </span>
              ) : (
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-white text-amber-800 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  Scratch Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active Scratch Modal */}
      {activeCardForScratch && (
        <ScratchCanvasModal
          card={activeCardForScratch}
          onRevealed={handleReveal}
          onClose={() => setActiveCardForScratch(null)}
        />
      )}

    </div>
  );
};
