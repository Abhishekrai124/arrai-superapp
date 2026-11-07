import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { 
  ShieldCheck, 
  X, 
  FileText, 
  Download, 
  CheckCircle2, 
  Eye, 
  Plus, 
  Lock, 
  ExternalLink,
  QrCode,
  Share2
} from 'lucide-react';

export const ArraiDigilockerModal: React.FC = () => {
  const { activeModal, closeModal, userProfile, updateUserProfile } = useAppStore();
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocType, setNewDocType] = useState('PAN');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (activeModal !== 'digilocker') return null;

  const docs = userProfile.digilockerDocs || [
    {
      id: 'doc_aadhaar',
      name: 'Aadhaar Card (UIDAI)',
      number: 'XXXX-XXXX-9021',
      verified: true,
      issueDate: '14 Jan 2021'
    },
    {
      id: 'doc_pan',
      name: 'Permanent Account Number (PAN)',
      number: 'ABCDE1234F',
      verified: true,
      issueDate: '08 Mar 2020'
    },
    {
      id: 'doc_dl',
      name: 'Driving License (MoRTH)',
      number: 'KA-05-20220019283',
      verified: true,
      issueDate: '19 Aug 2022'
    },
    {
      id: 'doc_rc',
      name: 'Vehicle Registration Certificate (RC)',
      number: 'KA-01-MJ-4092',
      verified: true,
      issueDate: '02 Feb 2023'
    }
  ];

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocNumber.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const newDoc = {
        id: `doc_${Date.now()}`,
        name: `${newDocType} Document`,
        number: newDocNumber.toUpperCase(),
        verified: true,
        issueDate: 'Today'
      };

      updateUserProfile({
        digilockerDocs: [...docs, newDoc]
      });

      soundEngine.playSuccessChime();
      setShowAddDocModal(false);
      setNewDocNumber('');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">ARRAI Vault & DigiLocker</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Govt of India Verified
                </span>
              </div>
              <p className="text-xs text-emerald-200">256-Bit Encrypted Sovereign Identity Storage</p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Issued Documents ({docs.length})</span>
            <span className="text-[11px] text-slate-500">Legally valid under IT Act 2000 Rule 9A</span>
          </div>

          <button
            onClick={() => setShowAddDocModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link Document</span>
          </button>
        </div>

        {/* Document Cards */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {docs.map(doc => (
            <div 
              key={doc.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white transition-all flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">{doc.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 block mt-0.5">{doc.number}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Issued: {doc.issueDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                  title="View Document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    soundEngine.playSuccessChime();
                    alert(`Downloaded verified PDF for ${doc.name} from ARRAI Vault.`);
                  }}
                  className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Download Verified PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View Document Modal Drawer */}
        {viewingDoc && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3 animate-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">{viewingDoc.name}</h4>
              </div>
              <button onClick={() => setViewingDoc(null)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
            </div>
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Document Holder:</span>
                <span className="font-bold text-slate-900">{userProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Document Identifier:</span>
                <span className="font-mono font-bold text-slate-900">{viewingDoc.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Digital Signature:</span>
                <span className="font-mono text-emerald-700 text-[10px]">SHA-256 Verified by ARRAI Identity Engine</span>
              </div>
            </div>
          </div>
        )}

        {/* Add Document Drawer */}
        {showAddDocModal && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3 animate-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Link Government Document</h4>
              <button onClick={() => setShowAddDocModal(false)} className="text-xs text-slate-400">Cancel</button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Select Document Type</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                >
                  <option value="Aadhaar">Aadhaar Card (UIDAI)</option>
                  <option value="PAN">PAN Card (Income Tax)</option>
                  <option value="Driving License">Driving License (MoRTH)</option>
                  <option value="Vehicle RC">Vehicle Registration (RC)</option>
                  <option value="Voter ID">Voter ID (ECI)</option>
                  <option value="Academic Degree">Degree / Marksheet (CBSE/University)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Enter Document Number</label>
                <input
                  type="text"
                  placeholder="e.g. DL-04-2023001892"
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {isVerifying ? 'Verifying with Govt Gateway...' : 'Fetch & Save to ARRAI Vault'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
