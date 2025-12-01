import React, { useState } from 'react';
import { Candidate } from '../types';
import { generateSupportSlogan } from '../services/geminiService';
import { Sparkles, Send, MessageSquareQuote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartCheerProps {
  candidates: Candidate[];
  onCheer: (msg: string) => void;
}

const SmartCheer: React.FC<SmartCheerProps> = ({ candidates, onCheer }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<number>(candidates[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSlogan, setGeneratedSlogan] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedSlogan(null);
    const candidate = candidates.find(c => c.id === selectedCandidateId);
    if (candidate) {
      const slogan = await generateSupportSlogan(candidate.name, candidate.votes);
      setGeneratedSlogan(slogan);
      onCheer(slogan);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-yellow-400" size={20} />
        <h2 className="text-xl font-bold text-white">AI 花式打 Call</h2>
      </div>
      <p className="text-slate-300 text-sm mb-4">
        选择你的偶像，让 AI 帮你想一句炸裂的应援口号，为他/她拉票！
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select 
          value={selectedCandidateId}
          onChange={(e) => setSelectedCandidateId(Number(e.target.value))}
          className="flex-1 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
        >
          {candidates.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg px-5 py-2.5 text-center flex items-center justify-center gap-2 font-medium transition-colors whitespace-nowrap"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Sparkles size={16} /> 生成应援词
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {generatedSlogan && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white/10 border border-white/10 rounded-xl p-4 flex gap-3 items-start"
          >
            <MessageSquareQuote className="text-indigo-300 shrink-0 mt-1" size={24} />
            <div>
              <p className="text-lg font-medium text-white italic">"{generatedSlogan}"</p>
              <p className="text-indigo-200 text-xs mt-2">— Gemini AI 智能生成</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartCheer;