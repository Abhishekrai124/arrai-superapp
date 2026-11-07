import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { 
  Radio, 
  Heart, 
  Repeat, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Send, 
  TrendingUp, 
  Search, 
  BadgeCheck, 
  MoreHorizontal,
  Bookmark,
  Hash,
  BarChart2,
  User,
  Settings,
  Check
} from 'lucide-react';

interface PulsePost {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  tag?: string;
}

export const ArraiPulseView: React.FC = () => {
  const { userProfile } = useAppStore();
  const [composeText, setComposeText] = useState('');
  const [activeTab, setActiveTab] = useState<'forYou' | 'trending' | 'latest' | 'profile'>('forYou');
  const [pulseHandle, setPulseHandle] = useState('@abhishek_rai');
  const [pulseBio, setPulseBio] = useState('Founder & Developer @ ARRAI | Building India\'s Super App Ecosystem 🇮🇳');
  const [pulseVerified, setPulseVerified] = useState(true);
  const [saveToast, setSaveToast] = useState(false);
  const [posts, setPosts] = useState<PulsePost[]>([
    {
      id: 'p_1',
      author: {
        name: 'ARRAI Official',
        handle: '@arrai_hq',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        verified: true
      },
      content: '🚀 ARRAI Developer Console is now live! Independent developers across India can now build, publish, and monetize commercial apps directly on the ARRAI Store with 0% gateway commission. #ARRAI #DevEcosystem #MakeInIndia',
      timestamp: '22m ago',
      likes: 1240,
      retweets: 382,
      replies: 94,
      tag: '#DevEcosystem'
    },
    {
      id: 'p_2',
      author: {
        name: 'Karan Mehra',
        handle: '@karan_fintech',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        verified: true
      },
      content: 'Just tested the ARRAI Wallet instant soundbox confirmation at my coffee shop. Sub-second latency on UPI 2.0 payments is revolutionary. Anyone else building micro-apps here? ☕⚡',
      timestamp: '1h ago',
      likes: 420,
      retweets: 89,
      replies: 31,
      tag: '#FinTech'
    },
    {
      id: 'p_3',
      author: {
        name: 'Ananya Sharma',
        handle: '@ananya_ui',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        verified: false
      },
      content: 'The new ARRAI Pulse feed feels so clean and fast compared to legacy microblogging networks. Love the integrated creator tipping straight through UPI! 💜',
      timestamp: '3h ago',
      likes: 215,
      retweets: 42,
      replies: 18,
      tag: '#Design'
    }
  ]);

  const trendingTopics = [
    { tag: '#ARRAIStore', tweets: '45.2K Pulses' },
    { tag: '#DeveloperConsole', tweets: '28.9K Pulses' },
    { tag: '#UPI2Point0', tweets: '19.4K Pulses' },
    { tag: '#MakeInIndia', tweets: '15.1K Pulses' },
    { tag: '#TechSummit2026', tweets: '12.8K Pulses' },
  ];

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeText.trim()) return;
    soundEngine.playSuccessChime();

    const newPost: PulsePost = {
      id: `p_${Date.now()}`,
      author: {
        name: userProfile.name,
        handle: `@${userProfile.vpa.replace('@arrai', '')}`,
        avatar: userProfile.avatar,
        verified: true
      },
      content: composeText.trim(),
      timestamp: 'Just now',
      likes: 0,
      retweets: 0,
      replies: 0,
      isLiked: false
    };

    setPosts([newPost, ...posts]);
    setComposeText('');
  };

  const handleLike = (id: string) => {
    soundEngine.playKeypadClick();
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handleRetweet = (id: string) => {
    soundEngine.playKeypadClick();
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isRetweeted: !p.isRetweeted,
          retweets: p.isRetweeted ? p.retweets - 1 : p.retweets + 1
        };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 pb-24">
      
      {/* Center Feed */}
      <div className="flex-1 space-y-4">
        
        {/* Top Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs sticky top-20 z-20 backdrop-blur-md bg-white/95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-900 text-white rounded-2xl shadow-md">
                <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 tracking-tight">ARRAI Pulse</h1>
                <p className="text-[10px] text-slate-400 font-medium">Real-time Public Feeds, News & Trends</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Stream
            </span>
          </div>

          <div className="grid grid-cols-4 pt-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('forYou')}
              className={`py-2 text-center transition-all ${activeTab === 'forYou' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`py-2 text-center transition-all ${activeTab === 'trending' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`py-2 text-center transition-all ${activeTab === 'latest' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 text-center transition-all ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Profile & Settings
            </button>
          </div>
        </div>

        {/* Profile & Settings Tab View */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-sm text-slate-900">ARRAI Pulse Creator Profile & Settings</h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize your public handle, bio, and timeline feed filters</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Verified Creator
              </span>
            </div>

            {saveToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>ARRAI Pulse Profile and preferences saved!</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Pulse Unique Handle
                  </label>
                  <input
                    type="text"
                    value={pulseHandle}
                    onChange={(e) => setPulseHandle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.name}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Public Bio (Bio & Links)
                </label>
                <textarea
                  value={pulseBio}
                  onChange={(e) => setPulseBio(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Verified Gold Tick Badge</span>
                    <span className="text-[11px] text-slate-500">Official ARRAI verified status for creators</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pulseVerified}
                    onChange={(e) => setPulseVerified(e.target.checked)}
                    className="rounded text-indigo-600 w-4 h-4 cursor-pointer"
                  />
                </label>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Direct Mentions & Message Requests</span>
                    <span className="text-[11px] text-slate-500">Allow followers to send direct messages</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4 cursor-pointer" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playSuccessChime();
                  setSaveToast(true);
                  setTimeout(() => setSaveToast(false), 2500);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all"
              >
                Save Pulse Settings
              </button>
            </div>
          </div>
        )}

        {/* Compose Pulse Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <form onSubmit={handlePost}>
            <div className="flex gap-3">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0" />
              <div className="flex-1">
                <textarea
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  placeholder="What's happening in your digital world? #Pulse"
                  rows={3}
                  className="w-full text-xs text-slate-900 placeholder-slate-400 outline-none resize-none bg-transparent"
                />

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="text-[10px] font-mono">{280 - composeText.length} chars</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!composeText.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>Pulse</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Posts Stream */}
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs transition-all hover:border-indigo-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-100" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-slate-900">{post.author.name}</h4>
                      {post.author.verified && <BadgeCheck className="w-3.5 h-3.5 text-indigo-600" />}
                      <span className="text-[11px] text-slate-400 font-mono">{post.author.handle}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-800 mt-3 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-slate-500 text-xs">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'}`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button 
                  onClick={() => handleRetweet(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${post.isRetweeted ? 'text-emerald-600 font-bold' : 'hover:text-emerald-600'}`}
                >
                  <Repeat className="w-4 h-4" />
                  <span>{post.retweets}</span>
                </button>

                <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.replies}</span>
                </button>

                <button className="hover:text-slate-800 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right Sidebar: Trends & Developer Spotlight */}
      <div className="w-full md:w-72 space-y-4">
        
        {/* Search */}
        <div className="bg-white rounded-3xl border border-slate-200 p-3 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Pulses & Trends..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Trending in India</h3>
          </div>

          <div className="space-y-2.5">
            {trendingTopics.map(item => (
              <div key={item.tag} className="hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer">
                <span className="text-xs font-bold text-slate-900 block">{item.tag}</span>
                <span className="text-[10px] text-slate-400 block">{item.tweets}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
