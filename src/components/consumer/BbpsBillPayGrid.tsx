import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Smartphone, 
  Zap, 
  Tv, 
  Car, 
  Wifi, 
  Flame, 
  Droplets, 
  CreditCard,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { TransactionCategory } from '../../types';

export const BbpsBillPayGrid: React.FC = () => {
  const { openModal } = useAppStore();

  const billServices = [
    {
      category: 'recharge' as TransactionCategory,
      title: 'Mobile Recharge',
      subtitle: 'Jio, Airtel, Vi',
      icon: Smartphone,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      category: 'electricity' as TransactionCategory,
      title: 'Electricity Bill',
      subtitle: 'Tata, BESCOM, Adani',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      category: 'dth' as TransactionCategory,
      title: 'DTH Recharge',
      subtitle: 'Tata Play, Airtel DTH',
      icon: Tv,
      color: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
      category: 'fastag' as TransactionCategory,
      title: 'FASTag Recharge',
      subtitle: 'NHAI, ICICI, ARRAI Fastag',
      icon: Car,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      category: 'broadband' as TransactionCategory,
      title: 'Broadband / WiFi',
      subtitle: 'ACT, JioFiber, Airtel',
      icon: Wifi,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200'
    },
    {
      category: 'gas' as TransactionCategory,
      title: 'Piped Gas',
      subtitle: 'Mahanagar, IGL, Adani',
      icon: Flame,
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      category: 'electricity' as TransactionCategory,
      title: 'Water Utility',
      subtitle: 'BWSSB, DJB, Municipal',
      icon: Droplets,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    },
    {
      category: 'recharge' as TransactionCategory,
      title: 'Credit Card Bill',
      subtitle: 'HDFC, SBI, ICICI, Axis',
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  const handleSelectService = (category: TransactionCategory, title: string) => {
    openModal('billPay', { category, serviceTitle: title });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-[10px] tracking-tighter">
            BBPS
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recharge & Bill Pay</h3>
            <p className="text-[11px] text-slate-500">Bharat BillPay verified utility payments</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>NPCI Assured</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {billServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <button
              key={index}
              onClick={() => handleSelectService(service.category, service.title)}
              className="flex items-center sm:flex-col sm:text-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/20 active:scale-95 transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${service.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {service.title}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {service.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Promo Banner */}
      <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-xs font-bold text-indigo-950">Pay Electricity Bill & Get up to ₹100 Cashback</p>
            <p className="text-[10px] text-indigo-600">Scratch card unlocked automatically on successful bill clearance</p>
          </div>
        </div>
        <button
          onClick={() => handleSelectService('electricity', 'Electricity Bill')}
          className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-0.5 shrink-0"
        >
          Pay Now <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
