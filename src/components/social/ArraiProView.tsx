import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { 
  Building2, 
  Briefcase, 
  Award, 
  Users, 
  BadgeCheck, 
  MapPin, 
  Link2, 
  Plus, 
  Search, 
  Send, 
  Check, 
  Calendar,
  Sparkles,
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';

interface JobOpening {
  id: string;
  role: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  logo: string;
}

export const ArraiProView: React.FC = () => {
  const { userProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState<'network' | 'jobs' | 'profile'>('network');
  const [connectToast, setConnectToast] = useState<string | null>(null);

  const jobs: JobOpening[] = [
    {
      id: 'j_1',
      role: 'Staff Full-Stack Engineer (React + FinTech)',
      company: 'ARRAI Technologies',
      location: 'Bangalore / Remote',
      salary: '₹35 - 50 LPA',
      type: 'Full-time',
      posted: '2 days ago',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'j_2',
      role: 'Product Lead - Super App Platforms',
      company: 'NextGen Payments India',
      location: 'Mumbai / Hybrid',
      salary: '₹40 - 60 LPA',
      type: 'Full-time',
      posted: '4 days ago',
      logo: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'j_3',
      role: 'Lead UI/UX Systems Designer',
      company: 'PixelForge Studios',
      location: 'Delhi NCR / Remote',
      salary: '₹24 - 36 LPA',
      type: 'Contract',
      posted: '1 week ago',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80'
    }
  ];

  const handleConnect = (name: string) => {
    soundEngine.playSuccessChime();
    setConnectToast(`Connection invitation sent to ${name}`);
    setTimeout(() => setConnectToast(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-24">
      {connectToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl animate-in fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{connectToast}</span>
        </div>
      )}

      {/* Header Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="h-32 bg-gradient-to-r from-sky-800 via-blue-900 to-indigo-950 relative" />
        
        <div className="px-6 pb-6 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name} 
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{userProfile.name}</h1>
                <BadgeCheck className="w-5 h-5 text-blue-600" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  ARRAI Pro
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">FinTech Architect & Systems Developer • ARRAI Ecosystem</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> India</span>
                <span>•</span>
                <span className="text-blue-600 font-bold">500+ Connections</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleConnect('Network')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
            <button className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* Pro Navigation Tabs */}
        <div className="flex border-t border-slate-100 px-6 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('network')}
            className={`py-3 transition-all border-b-2 ${activeTab === 'network' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Feed & Network
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3 transition-all border-b-2 ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Jobs & Hiring ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 transition-all border-b-2 ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Credentials & Endorsements
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'jobs' ? (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-all">
              <div className="flex items-start gap-3.5">
                <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-100 shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">{job.role}</h3>
                  <p className="text-xs text-slate-600 font-medium">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">{job.salary}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>Posted {job.posted}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleConnect(job.company)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-auto"
              >
                Easy Apply (ARRAI ID)
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Experience */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800">Experience & Projects</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                  AP
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Lead Systems Engineer</h4>
                  <p className="text-[11px] text-slate-500">ARRAI Super-App Engineering Group</p>
                  <p className="text-[10px] text-slate-400 font-mono">2024 - Present • Full-time</p>
                  <p className="text-xs text-slate-600 mt-1.5">
                    Architected high-throughput UPI 2.0 transaction ledger, decentralized social networks, and live soundbox audio engine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Endorsements */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800">Verified Skills</h2>
            </div>

            <div className="space-y-2">
              {[
                { name: 'FinTech & UPI Payments', endorsements: '142 endorsements' },
                { name: 'React 19 & TypeScript', endorsements: '98 endorsements' },
                { name: 'Distributed Systems', endorsements: '74 endorsements' },
                { name: 'Smart Contract & Escrow', endorsements: '56 endorsements' }
              ].map(skill => (
                <div key={skill.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{skill.name}</span>
                    <span className="text-[10px] text-slate-400 block">{skill.endorsements}</span>
                  </div>
                  <BadgeCheck className="w-4 h-4 text-blue-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
