import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { UndoRecord } from '../types';

interface UndoHistoryModalProps {
  history: UndoRecord[];
  isOpen: boolean;
  onClose: () => void;
  onUndo: (recordId: string) => Promise<void>;
  isUndoing: boolean;
}

export const UndoHistoryModal: React.FC<UndoHistoryModalProps> = ({
  history,
  isOpen,
  onClose,
  onUndo,
  isUndoing,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col rounded-xl bg-[#0e0e12] border border-white/10 shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0a0a0d]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-100 font-sans">
                Rollback & Undo History
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Every organization action is recorded. You can revert any run with 1-click.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0a0a0d]">
          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 flex flex-col items-center">
              <Clock className="w-7 h-7 text-neutral-600 mb-2" />
              <span className="font-medium text-neutral-300">No past organization runs</span>
              <span>When you organize a folder, history is stored here for rollback.</span>
            </div>
          ) : (
            history.map(record => {
              const isExpanded = expandedId === record.id;
              const dateStr = new Date(record.timestamp).toLocaleString();

              return (
                <div
                  key={record.id}
                  className="rounded-lg border border-white/[0.06] bg-[#121216] overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3.5 bg-[#16161c]">
                    <div
                      className="flex items-center space-x-2.5 cursor-pointer select-none flex-1 overflow-hidden"
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                      )}
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-neutral-200">
                            {record.count} files moved
                          </span>
                          <span className="text-[10px] text-neutral-500">• {dateStr}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">
                          {record.sourceDirectory}
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={isUndoing}
                      onClick={() => onUndo(record.id)}
                      className="ml-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#1f1f28] hover:bg-[#282834] text-neutral-200 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className={`w-3 h-3 ${isUndoing ? 'animate-spin' : ''}`} />
                      <span>Revert</span>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-3.5 border-t border-white/[0.04] bg-black/30 text-xs space-y-1.5 max-h-56 overflow-y-auto">
                      <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">
                        Restorable Files:
                      </div>
                      {record.items.map((item, idx) => {
                        const fileName = item.movedPath.split(/[\\/]/).pop();
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-0.5 text-neutral-400 font-mono text-[11px]"
                          >
                            <span className="truncate text-neutral-200 mr-2">{fileName}</span>
                            <span className="text-neutral-500 text-[10px] truncate max-w-[200px]">
                              ← {item.originalPath}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0d]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#16161c] hover:bg-[#202028] text-neutral-200 text-xs font-semibold border border-white/[0.06] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
