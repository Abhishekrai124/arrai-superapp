import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ConnectPost, ConnectCommunity } from '../../types';
import { 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  ShoppingBag, 
  Split, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  IndianRupee,
  Lock,
  Calendar,
  Search,
  Filter,
  Ticket,
  User,
  Settings,
  Check
} from 'lucide-react';

export const ArraiConnectView: React.FC = () => {
  const { 
    connectPosts, 
    likeConnectPost, 
    paySplitBill, 
    walletBalance, 
    userProfile, 
    openModal 
  } = useAppStore();

  const [connectTab, setConnectTab] = useState<'feed' | 'groups' | 'marketplace' | 'events' | 'profile'>('feed');
  const [connectBio, setConnectBio] = useState('Founder & Tech Enthusiast @ Bangalore');
  const [connectHometown, setConnectHometown] = useState('Varanasi, UP');
  const [connectPrivacy, setConnectPrivacy] = useState<'Public' | 'Friends' | 'Private'>('Public');
  const [connectSavedToast, setConnectSavedToast] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [isPayingSplit, setIsPayingSplit] = useState(false);
  const [selectedMarketCategory, setSelectedMarketCategory] = useState<string>('all');

  // Seed Communities
  const [communities, setCommunities] = useState<ConnectCommunity[]>([
    {
      id: 'comm_1',
      name: 'Bangalore Tech Founders & Developers',
      category: 'Startups & Tech',
      membersCount: 24800,
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
      isJoined: true,
      description: 'The largest hub of founders, tech leads, and designers building the future in Bangalore.'
    },
    {
      id: 'comm_2',
      name: 'FinTech India & UPI Architecture',
      category: 'Finance',
      membersCount: 18400,
      coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600',
      isJoined: false,
      description: 'Discussing NPCI circulars, payment gateways, and banking APIs.'
    },
    {
      id: 'comm_3',
      name: 'ARRAI Verified Peer Marketplace',
      category: 'Buy & Sell',
      membersCount: 31200,
      coverImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
      isJoined: true,
      description: 'Buy and sell gadgets with guaranteed ARRAI Escrow payment protection.'
    }
  ]);

  // Seed Marketplace Items
  const marketplaceItems = [
    {
      id: 'm1',
      title: 'Apple Magic Keyboard + Magic Trackpad 2',
      price: 8500,
      category: 'Electronics',
      condition: 'Like New (Used 2 months)',
      seller: 'Vikram Malhotra',
      location: 'HSR Layout, Bangalore',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'
    },
    {
      id: 'm2',
      title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      price: 19999,
      category: 'Electronics',
      condition: 'Mint with Box & Warranty',
      seller: 'Priya Patel',
      location: 'Indiranagar, Bangalore',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
    },
    {
      id: 'm3',
      title: 'Ergonomic Mesh Office Chair with Lumbar Support',
      price: 4500,
      category: 'Furniture',
      condition: 'Good Condition',
      seller: 'Rahul Sharma',
      location: 'Koramangala, Bangalore',
      image: 'https://images.unsplash.com/photo-1580481077197-09d58b76c8bb?w=600'
    }
  ];

  // Seed Events
  const events = [
    {
      id: 'ev_1',
      title: 'Bangalore FinTech & Web3 Pitch Night',
      date: 'Sat, Nov 14 • 6:00 PM IST',
      location: 'WeWork Galaxy, Residency Rd',
      ticketPrice: 499,
      attendees: 184,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600'
    },
    {
      id: 'ev_2',
      title: 'Goa Weekend Sunset Hackathon & Retreat',
      date: 'Fri, Nov 27 • 3 Days',
      location: 'Anjuna Beach, Goa',
      ticketPrice: 2499,
      attendees: 58,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'
    }
  ];

  const handlePaySplit = async (postId: string, memberName: string) => {
    setIsPayingSplit(true);
    await paySplitBill(postId, memberName);
    setIsPayingSplit(false);
  };

  const handleBuyMarketplace = (item: any) => {
    openModal('transfer', {
      recipientName: 'ARRAI Escrow: ' + item.title,
      recipientVpa: 'escrow.marketplace@arrai',
      amount: item.price,
      note: 'Escrow payment for ' + item.title,
      paymentMethod: 'ARRAI_WALLET'
    });
  };

  const handleBookEvent = (ev: any) => {
    openModal('transfer', {
      recipientName: 'ARRAI Events: ' + ev.title,
      recipientVpa: 'tickets.events@arrai',
      amount: ev.ticketPrice,
      note: 'Ticket entry for ' + ev.title,
      paymentMethod: 'ARRAI_WALLET'
    });
  };

  const toggleJoinCommunity = (id: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isJoined: !c.isJoined,
          membersCount: !c.isJoined ? c.membersCount + 1 : c.membersCount - 1
        };
      }
      return c;
    }));
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-12">
      
      {/* 1. Sub-Tab Switcher (Feed, Groups, Marketplace, Events) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-1.5 shadow-xs flex items-center justify-around">
        <button
          onClick={() => setConnectTab('feed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            connectTab === 'feed' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📰 Feed
        </button>

        <button
          onClick={() => setConnectTab('groups')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            connectTab === 'groups' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👥 Groups
        </button>

        <button
          onClick={() => setConnectTab('marketplace')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            connectTab === 'marketplace' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🛍️ Marketplace
        </button>

        <button
          onClick={() => setConnectTab('events')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            connectTab === 'events' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📅 Events
        </button>

        <button
          onClick={() => setConnectTab('profile')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            connectTab === 'profile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ⚙️ Profile
        </button>
      </div>

      {/* VIEW 1: News Feed (Facebook Re-engineered) */}
      {connectTab === 'feed' && (
        <>
          {/* Post Creator Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <img src={userProfile.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover" />
              <input
                type="text"
                placeholder={`What's on your mind, ${userProfile.name.split(' ')[0]}?`}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="flex-1 py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <button 
                  onClick={() => setConnectTab('groups')}
                  className="flex items-center gap-1 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  <Split className="w-3.5 h-3.5 text-indigo-500" /> Split Bill
                </button>
                <button 
                  onClick={() => setConnectTab('marketplace')}
                  className="flex items-center gap-1 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" /> Sell Item
                </button>
              </div>

              <button
                disabled={!newPostText.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold"
              >
                Post
              </button>
            </div>
          </div>

          {/* Connect Posts Stream */}
          <div className="space-y-4">
            {connectPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3.5">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{post.author.name}</span>
                        {post.groupName && (
                          <span className="text-[11px] text-slate-500">
                            in <span className="font-semibold text-blue-600">{post.groupName}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed">{post.content}</p>

                {/* Group Bill Split Widget */}
                {post.splitBill && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                          <Split className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-indigo-950">{post.splitBill.title}</h4>
                          <p className="text-[10px] text-indigo-600">Total: ₹{post.splitBill.totalAmount} • ₹{post.splitBill.perPersonAmount}/person</p>
                        </div>
                      </div>
                      <span className="text-xs font-black font-mono text-indigo-900">₹{post.splitBill.perPersonAmount}</span>
                    </div>

                    <div className="space-y-2">
                      {post.splitBill.members.map((member, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-white/80 px-3 py-2 rounded-xl border border-indigo-100/60">
                          <div className="flex items-center gap-2">
                            <img src={member.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-medium text-slate-800">{member.name}</span>
                          </div>

                          {member.status === 'PAID' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid ₹{member.amount}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                Pending ₹{member.amount}
                              </span>
                              {member.name.includes('You') && (
                                <button
                                  onClick={() => handlePaySplit(post.id, 'You')}
                                  disabled={isPayingSplit}
                                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg shadow-xs"
                                >
                                  Pay My Share
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Marketplace Card */}
                {post.marketplaceItem && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 space-y-3">
                    <img src={post.marketplaceItem.image} alt="" className="w-full h-48 object-cover" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{post.marketplaceItem.title}</h4>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" /> {post.marketplaceItem.location}
                          </span>
                        </div>
                        <span className="text-base font-black font-mono text-emerald-700">₹{post.marketplaceItem.price.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-500" /> ARRAI Escrow Protection
                        </span>
                        <button
                          onClick={() => handleBuyMarketplace(post.marketplaceItem)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Instant Buy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Reactions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <button
                    onClick={() => likeConnectPost(post.id)}
                    className={`flex items-center gap-1.5 font-bold ${post.hasLiked ? 'text-blue-600' : ''}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? 'fill-blue-600' : ''}`} />
                    <span>{post.likesCount} Likes</span>
                  </button>

                  <button className="flex items-center gap-1.5 font-bold hover:text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>Comments</span>
                  </button>

                  <button className="flex items-center gap-1.5 font-bold hover:text-blue-600">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW 2: Communities / Groups (Facebook Groups Re-engineered) */}
      {connectTab === 'groups' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl shadow-xs">
            <h3 className="font-bold text-sm">ARRAI Verified Communities</h3>
            <p className="text-xs text-blue-100 mt-0.5">Collaborate, organize events, and split expenses automatically.</p>
          </div>

          <div className="space-y-3">
            {communities.map((comm) => (
              <div key={comm.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col sm:flex-row">
                <img src={comm.coverImage} alt="" className="w-full sm:w-40 h-32 sm:h-auto object-cover" />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{comm.category}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{comm.membersCount.toLocaleString()} Members</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{comm.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{comm.description}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Direct UPI Bill Splits Active
                    </span>

                    <button
                      onClick={() => toggleJoinCommunity(comm.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        comm.isJoined
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {comm.isJoined ? 'Joined ✓' : '+ Join Group'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: ARRAI Marketplace (Facebook Marketplace Re-engineered) */}
      {connectTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white rounded-3xl border border-slate-200 p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-xs text-slate-900">ARRAI Escrow Marketplace</h3>
                <p className="text-[10px] text-slate-500">100% Buyer Protected with UPI Escrow</p>
              </div>
            </div>
            <button className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs">
              + Sell Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marketplaceItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <img src={item.image} alt="" className="w-full h-40 object-cover" />
                  <div className="p-3.5 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-base font-black font-mono text-emerald-700">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{item.category}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] text-slate-500">{item.condition}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{item.location}</span>
                  </div>
                </div>

                <div className="p-3.5 pt-0">
                  <button
                    onClick={() => handleBuyMarketplace(item)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    Buy with ARRAI Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: ARRAI Events (Facebook Events Re-engineered) */}
      {connectTab === 'events' && (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <img src={ev.image} alt="" className="w-full h-36 object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-blue-600 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ev.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {ev.location}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ticket Entry</span>
                    <span className="text-base font-black font-mono text-slate-900">₹{ev.ticketPrice}</span>
                  </div>

                  <button
                    onClick={() => handleBookEvent(ev)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Ticket className="w-3.5 h-3.5" /> Book Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 5: Community Profile & Settings */}
      {connectTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
          <div>
            <h3 className="font-black text-sm text-slate-900">ARRAI Connect Profile & Privacy Settings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage your community member profile, hometown, and social privacy</p>
          </div>

          {connectSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Connect Profile settings updated!</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <img src={userProfile.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/30" />
              <div>
                <h4 className="font-black text-sm text-slate-900">{userProfile.name}</h4>
                <p className="text-[11px] text-slate-500">Member of 4 Communities • 842 Friends</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Community Bio
              </label>
              <textarea
                value={connectBio}
                onChange={(e) => setConnectBio(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Hometown / City
              </label>
              <input
                type="text"
                value={connectHometown}
                onChange={(e) => setConnectHometown(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black text-slate-900">Post Privacy Default</h5>
                  <p className="text-[11px] text-slate-500">Who can see your posts and group discussions</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['Public', 'Friends', 'Private'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setConnectPrivacy(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        connectPrivacy === p
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setConnectSavedToast(true);
                setTimeout(() => setConnectSavedToast(false), 2500);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              Save Community Profile
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
