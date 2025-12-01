import React, { useState, useEffect } from 'react';
import { Candidate, CheerMessage } from './types';
import CandidateCard from './components/CandidateCard';
import LiveChart from './components/LiveChart';
import SmartCheer from './components/SmartCheer';
import { generateBattleCommentary } from './services/geminiService';
import { Trophy, Activity, MessageCircle, Share2, Zap, X, Copy, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Initial data customized for user request
const INITIAL_CANDIDATES: Candidate[] = [
  { id: 1, name: "李丹阳", votes: 1245, image: "https://picsum.photos/id/1011/300/300", color: "red" },
  { id: 2, name: "张丁井", votes: 982, image: "https://picsum.photos/id/1027/300/300", color: "blue" },
  { id: 3, name: "张靖童", votes: 1156, image: "https://picsum.photos/id/1066/300/300", color: "green" },
  { id: 4, name: "杜堃宇", votes: 890, image: "https://picsum.photos/id/129/300/300", color: "purple" },
];

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [cheerLog, setCheerLog] = useState<CheerMessage[]>([]);
  const [commentary, setCommentary] = useState<string>("欢迎来到星光投票竞技场！");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Computed state for sorting
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  // Handle voting
  const handleVote = (id: number) => {
    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, votes: c.votes + 1 } : c
    ));
  };

  // Handle cheer messages
  const handleCheer = (message: string) => {
    const newCheer: CheerMessage = {
      id: Math.random().toString(36).substr(2, 9),
      candidateName: "粉丝", // Generic for simplicity
      message,
      timestamp: new Date()
    };
    setCheerLog(prev => [newCheer, ...prev].slice(0, 5)); // Keep last 5
  };

  // Effect: Generate commentary when leader changes or significantly periodically
  useEffect(() => {
    const timer = setInterval(async () => {
      const leader = sortedCandidates[0];
      const runnerUp = sortedCandidates[1];
      const gap = leader.votes - runnerUp.votes;
      
      const newCommentary = await generateBattleCommentary(leader.name, runnerUp.name, gap);
      setCommentary(newCommentary);
    }, 30000); // Every 30 seconds

    return () => clearInterval(timer);
  }, [sortedCandidates]); 

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-400">
                星光投票 StarVote
              </h1>
              <p className="text-xs text-slate-400">实时人气排行榜</p>
            </div>
          </div>
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 hover:border-slate-600"
          >
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Candidates */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Top Commentary Banner */}
          <div className="bg-slate-800/50 rounded-xl p-4 flex items-start gap-3 border border-indigo-500/20 shadow-lg relative overflow-hidden">
             {/* Background Pulse */}
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 animate-pulse"></div>
            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wide mb-1">AI 实时战况解说</h3>
              <p className="text-slate-200 text-sm leading-relaxed">{commentary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidates.map((candidate) => {
              const rank = sortedCandidates.findIndex(c => c.id === candidate.id) + 1;
              return (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  rank={rank}
                  onVote={handleVote}
                  isLeading={rank === 1}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column: Sidebar Stats & Fun */}
        <div className="space-y-6">
          
          {/* Chart Section */}
          <LiveChart data={candidates} />

          {/* AI Fun Section */}
          <SmartCheer candidates={candidates} onCheer={handleCheer} />

          {/* Recent Cheers Log */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
             <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                <Activity className="text-green-400" size={20} />
                <h2 className="text-lg font-bold text-white">实时助威榜</h2>
             </div>
             <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {cheerLog.length === 0 ? (
                 <p className="text-slate-500 text-sm text-center py-4">暂无助威，快来抢占沙发！</p>
               ) : (
                 <AnimatePresence initial={false}>
                   {cheerLog.map((log) => (
                     <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 items-start border-b border-slate-700/50 pb-3 last:border-0 last:pb-0"
                     >
                       <div className="bg-slate-700 rounded-full p-1.5 mt-0.5 shrink-0">
                         <MessageCircle size={12} className="text-slate-400" />
                       </div>
                       <div>
                         <p className="text-slate-200 text-sm font-medium leading-snug">{log.message}</p>
                         <p className="text-slate-500 text-xs mt-1">{log.timestamp.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit', second: '2-digit'})}</p>
                       </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               )}
             </div>
          </div>

        </div>
      </main>

      <footer className="mt-12 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2024 StarVote. 由 Gemini AI 驱动支持.</p>
      </footer>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-slate-700 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 mb-3">
                  <QrCode size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">分享给好友</h3>
                <p className="text-slate-400 text-sm mt-1">扫码或复制链接，邀请好友一起来投票！</p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-xl mx-auto w-48 h-48 mb-6 flex items-center justify-center">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.href)}&color=0f172a`} 
                    alt="Scan to vote"
                    className="w-full h-full object-contain"
                  />
              </div>

              {/* Copy Link */}
              <div className="relative">
                <input 
                  type="text" 
                  readOnly 
                  value={window.location.href}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-400 text-sm rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                  onClick={handleCopyLink}
                  className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors border border-slate-700"
                >
                  <Copy size={16} />
                </button>
              </div>

              {showCopyToast && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                 >
                   链接已复制!
                 </motion.div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;