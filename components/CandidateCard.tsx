import React from 'react';
import { Candidate } from '../types';
import { ThumbsUp, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
  onVote: (id: number) => void;
  isLeading: boolean;
}

const colorMap: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank, onVote, isLeading }) => {
  const accentColorClass = colorMap[candidate.color] || 'bg-slate-500';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl bg-slate-800 border ${isLeading ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'border-slate-700'} p-4 flex flex-col items-center group hover:bg-slate-750 transition-colors`}
    >
      {/* Rank Badge */}
      <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 ${
        rank === 1 ? 'bg-yellow-500 text-slate-900' : 
        rank === 2 ? 'bg-slate-300 text-slate-900' :
        rank === 3 ? 'bg-amber-700 text-slate-100' : 'bg-slate-700 text-slate-400'
      }`}>
        {rank}
      </div>

      {isLeading && (
        <div className="absolute top-3 right-3 text-yellow-500 animate-pulse">
          <Trophy size={20} />
        </div>
      )}

      {/* Image */}
      <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-indigo-500 transition-colors duration-300">
        <img 
          src={candidate.image} 
          alt={candidate.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <h3 className="text-xl font-bold text-white mb-1">{candidate.name}</h3>
      <p className="text-slate-400 text-sm mb-4">当前票数</p>
      
      {/* Vote Count */}
      <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-6">
        {candidate.votes.toLocaleString()}
      </div>

      {/* Vote Button */}
      <button 
        onClick={() => onVote(candidate.id)}
        className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg hover:shadow-indigo-500/25"
      >
        <ThumbsUp size={18} />
        投票 +1
      </button>

      {/* Background decoration - Fixed dynamic class */}
      <div className={`absolute bottom-0 left-0 w-full h-1 ${accentColorClass} opacity-50`} />
    </motion.div>
  );
};

export default CandidateCard;