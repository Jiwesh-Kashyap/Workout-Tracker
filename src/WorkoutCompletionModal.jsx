import React from 'react';
import { CheckCircle2, ArrowRight, BarChart2, X } from 'lucide-react';

function WorkoutCompletionModal({ isOpen, dayName, onClose, onViewReport }) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="completion-modal-title"
        >
            <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
                {/* Close X button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close dialog"
                >
                    <X size={20} />
                </button>

                {/* Animated check icon */}
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 size={36} className="text-emerald-400" />
                </div>

                <h2 id="completion-modal-title" className="text-2xl font-bold text-white mb-2">
                    Workout Completed!
                </h2>

                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Great job finishing your workout for <span className="font-semibold text-white">{dayName}</span>! Your session has been saved, and your exercises have been automatically reset for your next workout.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    {onViewReport && (
                        <button
                            onClick={onViewReport}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition-colors border border-slate-700 cursor-pointer"
                        >
                            <BarChart2 size={16} />
                            View Report
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-md shadow-blue-600/30 cursor-pointer"
                    >
                        Back to Schedule
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WorkoutCompletionModal;
