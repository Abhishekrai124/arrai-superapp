import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  QrCode, 
  UserCheck, 
  AtSign, 
  Building2, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface QuickTransferBarProps {
  onSelectTab?: (tab: string) => void;
}

export const QuickTransferBar: React.FC<QuickTransferBarProps> = () => {
  const { openModal, setActiveSection } = useAppStore();

  const actions = [
    {
      id: 'qr',
      label: 'Scan Any QR',
      subtitle: 'Fast Camera Scanner',
      icon: QrCode,
      color: 'bg-indigo-600 text-white shadow-indigo-200',
      action: () => openModal('qrScanner')
    },
    {
      id: 'contact',
      label: 'To Mobile / Contact',
      subtitle: 'Contacts & ARRAI Pay',
      icon: UserCheck,
      color: 'bg-emerald-600 text-white shadow-emerald-200',
      action: () => openModal('transfer', { targetType: 'contact' })
    },
    {
      id: 'vpa',
      label: 'To UPI ID / VPA',
      subtitle: 'Any Bank UPI ID',
      icon: AtSign,
      color: 'bg-blue-600 text-white shadow-blue-200',
      action: () => openModal('transfer', { targetType: 'vpa' })
    },
    {
      id: 'self',
      label: 'To Self / Bank',
      subtitle: 'Transfer between A/Cs',
      icon: Building2,
      color: 'bg-purple-600 text-white shadow-purple-200',
      action: () => openModal('transfer', { targetType: 'self' })
    },
    {
      id: 'balance',
      label: 'Check Balance',
      subtitle: 'Bank Account PIN',
      icon: Building2,
      color: 'bg-teal-600 text-white shadow-teal-200',
      action: () => openModal('checkBalance')
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Money Transfer</h3>
          <p className="text-[11px] text-slate-500">Instant UPI 2.0 direct to bank or wallet</p>
        </div>
        
        <button
          onClick={() => setActiveSection('chat')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Open ARRAI Chat</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.action}
              className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 active:scale-95 transition-all group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${act.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2.5 group-hover:text-indigo-600 transition-colors">
                {act.label}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium line-clamp-1">
                {act.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
