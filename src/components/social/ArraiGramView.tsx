import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { GramPost, GramReel } from '../../types';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Sparkles, 
  IndianRupee, 
  Share2, 
  MapPin, 
  PlusCircle, 
  Check, 
  CheckCircle2,
  Play,
  Volume2,
  Grid,
  Search,
  PlusSquare,
  User,
  Music
} from 'lucide-react';

export const ArraiGramView: React.FC = () => {
  const { 
    gramPosts, 
    gramStories, 
    likeGramPost, 
    tipGramCreator, 
    addGramComment, 
    walletBalance, 
    userProfile 
  } = useAppStore();

  const [gramTab, setGramTab] = useState<'feed' | 'reels' | 'explore' | 'create' | 'profile'>('feed');
  const [activeStoryUser, setActiveStoryUser] = useState<any | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showTipModalForPost, setShowTipModalForPost] = useState<GramPost | null>(null);
  const [tipAmount, setTipAmount] = useState('50');

  // Create Post state
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostLocation, setNewPostLocation] = useState('Indiranagar, Bangalore');
  const [newPostImage, setNewPostImage] = useState('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800');
  const [postCreatedSuccess, setPostCreatedSuccess] = useState(false);

  // Reels State
  const [reels] = useState<GramReel[]>([
    {
      id: 'reel_1',
      author: gramPosts[0].author,
      videoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      caption: 'Catching sunset waves at Gokarna 🏄‍♂️ Tipped by 14 people on ARRAI Pay!',
      audioTitle: 'Original Audio • Priya Patel',
      likesCount: 1420,
      hasLiked: false,
      commentsCount: 88,
      tipsReceived: 650
    },
    {
      id: 'reel_2',
      author: gramPosts[1].author,
      videoUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      caption: 'Building FinTech with 60FPS UI animations ⚡ Keyboard ASMR + Code',
      audioTitle: 'Lo-Fi Chill Beats • Bangalore',
      likesCount: 2310,
      hasLiked: true,
      commentsCount: 142,
      tipsReceived: 1200
    }
  ]);

  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addGramComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleTipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTipModalForPost) return;
    const val = parseFloat(tipAmount);
    if (!val || val <= 0) return;

    const ok = await tipGramCreator(showTipModalForPost.id, val);
    if (ok) {
      setShowTipModalForPost(null);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostCaption) return;

    setPostCreatedSuccess(true);
    setTimeout(() => {
      setPostCreatedSuccess(false);
      setNewPostCaption('');
      setGramTab('feed');
    }, 1200);
  };

  const explorePhotos = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500'
  ];

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-12">
      
      {/* 1. ARRAI Gram Sub-Nav (Feed, Reels, Explore, Create, Profile) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-1.5 shadow-xs flex items-center justify-around">
        <button
          onClick={() => setGramTab('feed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            gramTab === 'feed' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Feed
        </button>

        <button
          onClick={() => setGramTab('reels')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            gramTab === 'reels' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🎬 Reels
        </button>

        <button
          onClick={() => setGramTab('explore')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            gramTab === 'explore' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Explore
        </button>

        <button
          onClick={() => setGramTab('create')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            gramTab === 'create' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          + Post
        </button>

        <button
          onClick={() => setGramTab('profile')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            gramTab === 'profile' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profile
        </button>
      </div>

      {/* VIEW 1: Main Feed & Stories */}
      {gramTab === 'feed' && (
        <>
          {/* Stories Tray */}
          <div className="bg-white rounded-3xl border border-slate-200 p-3.5 shadow-xs overflow-x-auto scrollbar-none flex items-center gap-4">
            <div className="flex flex-col items-center shrink-0 cursor-pointer group">
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover p-0.5 ring-2 ring-slate-200 group-hover:ring-pink-500 transition-all"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">+</div>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-1">Your Story</span>
            </div>

            {gramStories.map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveStoryUser(story)}
                className="flex flex-col items-center shrink-0 cursor-pointer group"
              >
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600">
                  <img
                    src={story.author.avatar}
                    alt=""
                    className="w-13 h-13 rounded-full object-cover p-0.5 bg-white group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 mt-1 max-w-[62px] truncate text-center">
                  {story.author.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          {/* Posts Stream */}
          <div className="space-y-5">
            {gramPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                
                {/* Post Author Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600">
                      <img
                        src={post.author.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover p-0.5 bg-white"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{post.author.username || post.author.name}</span>
                        {post.author.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                      {post.location && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" /> {post.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTipModalForPost(post)}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      Tip ₹{post.tipsReceived}
                    </button>
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Media Image (Double tap to like) */}
                <div 
                  className="relative aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer"
                  onDoubleClick={() => likeGramPost(post.id)}
                >
                  <img src={post.mediaUrl} alt="" className="w-full h-full object-cover select-none" />
                </div>

                {/* Post Actions & Comments */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => likeGramPost(post.id)}
                        className="flex items-center gap-1 text-xs font-bold transition-transform active:scale-125"
                      >
                        <Heart className={`w-6 h-6 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
                        <span className="text-slate-800">{post.likesCount}</span>
                      </button>

                      <button className="flex items-center gap-1 text-xs font-bold text-slate-700">
                        <MessageCircle className="w-6 h-6" />
                        <span>{post.commentsCount}</span>
                      </button>

                      <Share2 className="w-5 h-5 text-slate-700 cursor-pointer" />
                    </div>

                    <Bookmark className="w-5 h-5 text-slate-700 cursor-pointer" />
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed">
                    <span className="font-bold mr-1.5">{post.author.username || post.author.name}</span>
                    {post.caption}
                  </p>

                  {/* Add comment */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment or send vibes..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(post.id); }}
                      className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
                    >
                      Post
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW 2: ARRAI Reels (Instagram Vertical Reels Simulator) */}
      {gramTab === 'reels' && (
        <div className="space-y-4">
          <div className="relative aspect-9/16 max-w-sm mx-auto rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 flex flex-col justify-between p-5 text-white">
            <img
              src={reels[activeReelIndex].videoUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

            {/* Reel Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="font-black text-sm tracking-wider uppercase text-pink-400">ARRAI Reels</span>
              <Volume2 className="w-5 h-5" />
            </div>

            {/* Reel Right Actions */}
            <div className="relative z-10 self-end flex flex-col items-center gap-4">
              <button className="flex flex-col items-center gap-1 active:scale-125 transition-transform">
                <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
                <span className="text-[11px] font-bold">{reels[activeReelIndex].likesCount}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <MessageCircle className="w-7 h-7" />
                <span className="text-[11px] font-bold">{reels[activeReelIndex].commentsCount}</span>
              </button>

              {/* Creator Tip in Reels */}
              <button
                onClick={() => alert(`Tipped ₹50 to ${reels[activeReelIndex].author.name} directly via ARRAI Pay!`)}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-lg active:scale-95"
                title="Send ₹50 Tip"
              >
                ₹50
              </button>

              <Share2 className="w-6 h-6" />
            </div>

            {/* Reel Bottom Caption & Audio */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <img src={reels[activeReelIndex].author.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
                <span className="font-bold text-xs">{reels[activeReelIndex].author.username || reels[activeReelIndex].author.name}</span>
                <button className="text-[10px] bg-white text-slate-900 font-bold px-2 py-0.5 rounded-full">Follow</button>
              </div>

              <p className="text-xs text-slate-200 line-clamp-2">{reels[activeReelIndex].caption}</p>

              <div className="flex items-center gap-1.5 text-[10px] text-pink-200">
                <Music className="w-3 h-3 animate-spin" />
                <span>{reels[activeReelIndex].audioTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setActiveReelIndex(prev => Math.max(0, prev - 1))}
              disabled={activeReelIndex === 0}
              className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold disabled:opacity-40"
            >
              Previous Reel
            </button>
            <button
              onClick={() => setActiveReelIndex(prev => Math.min(reels.length - 1, prev + 1))}
              disabled={activeReelIndex === reels.length - 1}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-40"
            >
              Next Reel
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: Explore Search Grid */}
      {gramTab === 'explore' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search #FinTech, creators, places..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-2xl text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5 rounded-3xl overflow-hidden">
            {explorePhotos.map((url, i) => (
              <div key={i} className="aspect-square bg-slate-900 relative group cursor-pointer overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-2 transition-opacity">
                  <Heart className="w-4 h-4 fill-white" /> 2.4k
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: Create Post Form */}
      {gramTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm">Create New ARRAI Gram Post</h3>
          
          {postCreatedSuccess ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Post published to live feed!
            </div>
          ) : (
            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={newPostImage} alt="" className="w-full h-full object-cover" />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Caption</label>
                <textarea
                  rows={3}
                  placeholder="Write a caption... (e.g. Exploring Bangalore cafe culture with ARRAI Pay!)"
                  value={newPostCaption}
                  onChange={(e) => setNewPostCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Location Tag</label>
                <input
                  type="text"
                  value={newPostLocation}
                  onChange={(e) => setNewPostLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Accept Micro-Tips via ARRAI Pay</span>
                  <span className="text-[10px] text-amber-700">Followers can tip ₹20-₹200 to your wallet</span>
                </div>
                <input type="checkbox" defaultChecked className="text-amber-600 rounded" />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Publish Post
              </button>
            </form>
          )}
        </div>
      )}

      {/* VIEW 5: Creator Profile */}
      {gramTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <img src={userProfile.avatar} alt="" className="w-20 h-20 rounded-full object-cover ring-2 ring-pink-500" />
            <div className="flex items-center gap-6 text-center text-xs">
              <div>
                <span className="font-black text-base text-slate-900 block">34</span>
                <span className="text-slate-500">Posts</span>
              </div>
              <div>
                <span className="font-black text-base text-slate-900 block">14.8k</span>
                <span className="text-slate-500">Followers</span>
              </div>
              <div>
                <span className="font-black text-base text-slate-900 block">482</span>
                <span className="text-slate-500">Following</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-black text-sm text-slate-900">{userProfile.name}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{userProfile.bio}</p>
          </div>

          {/* Total Tips Earned Badge */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <div>
                <span className="font-bold text-amber-950 block">Creator Tips Earned</span>
                <span className="text-[10px] text-amber-700">Auto-credited to ARRAI Wallet</span>
              </div>
            </div>
            <span className="text-base font-black font-mono text-amber-800">₹12,450</span>
          </div>
        </div>
      )}

      {/* Tip Creator Modal */}
      {showTipModalForPost && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Send ARRAI Pay Tip</h3>
                  <p className="text-[10px] text-slate-500">To {showTipModalForPost.author.name}</p>
                </div>
              </div>
              <button onClick={() => setShowTipModalForPost(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleTipSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Tip Amount (₹)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTipAmount(amt.toString())}
                      className={`py-1.5 text-xs font-bold rounded-xl border ${
                        tipAmount === amt.toString()
                          ? 'bg-amber-50 border-amber-500 text-amber-800'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min="1"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-black font-mono text-slate-900 text-center"
                  required
                />
              </div>

              <div className="text-xs text-slate-500 flex justify-between">
                <span>Deducted from ARRAI Wallet</span>
                <span className="font-bold text-slate-800 font-mono">Bal: ₹{walletBalance.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Confirm & Send Tip (₹{tipAmount})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Story Fullscreen Preview Modal */}
      {activeStoryUser && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative aspect-9/16 flex flex-col justify-between p-4">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white animate-[pulse_3s_ease-in-out]" />
            </div>

            <div className="flex items-center justify-between text-white z-10 pt-2">
              <div className="flex items-center gap-2">
                <img src={activeStoryUser.author.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-xs font-bold">{activeStoryUser.author.name}</span>
                <span className="text-[10px] text-slate-400">{activeStoryUser.timestamp}</span>
              </div>
              <button onClick={() => setActiveStoryUser(null)} className="text-white text-lg">✕</button>
            </div>

            <img src={activeStoryUser.mediaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />

            <div className="z-10 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-2xl">
              <p className="text-xs text-white">Live story from {activeStoryUser.author.name}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
