import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Contact } from '../../types';
import { Plus, MessageCircle, CheckCircle2 } from 'lucide-react';

interface RecentContactsRowProps {
  onOpenChat: (contact: Contact) => void;
}

export const RecentContactsRow: React.FC<RecentContactsRowProps> = ({ onOpenChat }) => {
  const { contacts, openModal } = useAppStore();

  const handleQuickPay = (c: Contact) => {
    openModal('transfer', {
      recipientName: c.name,
      recipientVpa: c.vpa,
      contactId: c.id,
      amount: c.recentAmount || 500,
      note: 'Transfer via ARRAI Pay'
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Recent Chats & UPI Contacts</span>
            <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              WhatsApp Pay
            </span>
          </h3>
          <p className="text-[11px] text-slate-500">Tap to chat & pay instantly</p>
        </div>

        <button
          onClick={() => openModal('transfer', { targetType: 'contact' })}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View All ({contacts.length})
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
        
        {/* Add New Contact Button */}
        <button
          onClick={() => openModal('transfer', { targetType: 'contact' })}
          className="flex flex-col items-center shrink-0 group"
        >
          <div className="w-13 h-13 rounded-2xl border-2 border-dashed border-slate-300 group-hover:border-indigo-500 group-hover:bg-indigo-50 flex items-center justify-center transition-all">
            <Plus className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 mt-1.5">New Pay</span>
        </button>

        {/* Contacts */}
        {contacts.map((c) => (
          <div
            key={c.id}
            className="flex flex-col items-center shrink-0 relative group cursor-pointer"
            onClick={() => onOpenChat(c)}
          >
            <div className="relative">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all shadow-xs"
              />
              {c.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-white" />
                </div>
              )}
            </div>

            <span className="text-[11px] font-bold text-slate-800 mt-1.5 max-w-[68px] truncate text-center">
              {c.name.split(' ')[0]}
            </span>

            <span className="text-[10px] text-indigo-600 font-semibold font-mono">
              ₹{c.recentAmount || 500}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
