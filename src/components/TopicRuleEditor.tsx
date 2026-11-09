import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  SlidersHorizontal,
  Folder,
  Tag,
  FileCode,
  RotateCcw,
} from 'lucide-react';
import { TopicRule } from '../types';
import { DEFAULT_RULES } from '../services/defaultRules';

interface TopicRuleEditorProps {
  rules: TopicRule[];
  isOpen: boolean;
  onClose: () => void;
  onSaveRules: (updatedRules: TopicRule[]) => void;
}

const COLOR_PRESETS = [
  '#0A84FF', // Blue
  '#32D74B', // Green
  '#BF5AF2', // Purple
  '#FF9F0A', // Orange
  '#FF375F', // Pink
  '#64D2FF', // Cyan
  '#AC8E68', // Ochre
  '#8E8E93', // Gray
];

export const TopicRuleEditor: React.FC<TopicRuleEditorProps> = ({
  rules,
  isOpen,
  onClose,
  onSaveRules,
}) => {
  const [editingRules, setEditingRules] = useState<TopicRule[]>(rules);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newName, setNewName] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newExtensions, setNewExtensions] = useState('');
  const [newColor, setNewColor] = useState(COLOR_PRESETS[0]);

  React.useEffect(() => {
    setEditingRules(rules);
  }, [rules]);

  if (!isOpen) return null;

  const handleToggleRule = (id: string) => {
    const updated = editingRules.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setEditingRules(updated);
    onSaveRules(updated);
  };

  const handleDeleteRule = (id: string) => {
    const updated = editingRules.filter(r => r.id !== id);
    setEditingRules(updated);
    onSaveRules(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all topic rules back to original defaults?')) {
      setEditingRules(DEFAULT_RULES);
      onSaveRules(DEFAULT_RULES);
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newFolder.trim()) return;

    const keywords = newKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const extensions = newExtensions
      .split(',')
      .map(e => (e.trim().startsWith('.') ? e.trim() : `.${e.trim()}`))
      .filter(e => e.length > 1);

    const newRule: TopicRule = {
      id: `rule-custom-${Date.now()}`,
      name: newName.trim(),
      folderName: newFolder.trim(),
      keywords,
      extensions,
      enabled: true,
      color: newColor,
      priority: 15,
    };

    const updated = [newRule, ...editingRules];
    setEditingRules(updated);
    onSaveRules(updated);

    setNewName('');
    setNewFolder('');
    setNewKeywords('');
    setNewExtensions('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-xl bg-[#0e0e12] border border-white/10 shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0a0a0d]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-100 font-sans">
                Topic & Project Classification Rules
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Customize folder matching patterns, keywords, and target folders.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Rule Inline Form */}
        {isAddingNew && (
          <form
            onSubmit={handleCreateRule}
            className="p-4 border-b border-white/[0.08] bg-[#121216] space-y-3.5 animate-slideDown"
          >
            <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest">
              Create Custom Rule
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Topic Name</label>
                <input
                  type="text"
                  placeholder="e.g. AI Research Papers"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-[#181820] border border-white/[0.08] text-xs text-neutral-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Destination Subfolder</label>
                <input
                  type="text"
                  placeholder="e.g. Research/AI & LLM"
                  required
                  value={newFolder}
                  onChange={e => setNewFolder(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-[#181820] border border-white/[0.08] text-xs text-neutral-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. arxiv, gpt, llm, prompt"
                  value={newKeywords}
                  onChange={e => setNewKeywords(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-[#181820] border border-white/[0.08] text-xs text-neutral-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  File Extensions (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. .pdf, .docx, .md"
                  value={newExtensions}
                  onChange={e => setNewExtensions(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md bg-[#181820] border border-white/[0.08] text-xs text-neutral-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Color picker */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-neutral-400">Badge Color:</span>
                <div className="flex space-x-1.5">
                  {COLOR_PRESETS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-4 h-4 rounded-full transition-transform ${
                        newColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-md bg-[#181820] hover:bg-[#202028] text-neutral-300 text-xs border border-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Save Rule
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Rules List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5 bg-[#0a0a0d]">
          {editingRules.map(rule => (
            <div
              key={rule.id}
              className={`flex items-start justify-between p-3.5 rounded-lg border transition-all ${
                rule.enabled
                  ? 'bg-[#121216] border-white/[0.06]'
                  : 'bg-[#0f0f13] border-white/[0.03] opacity-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={() => handleToggleRule(rule.id)}
                  className="mt-0.5 w-3.5 h-3.5 rounded text-blue-500 bg-neutral-900 border-neutral-700"
                />

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: rule.color }}
                    />
                    <span className="text-xs font-semibold text-neutral-200">{rule.name}</span>
                    <span className="text-xs text-neutral-600">→</span>
                    <span className="text-xs font-mono text-neutral-400 bg-white/[0.05] px-1.5 py-0.5 rounded">
                      {rule.folderName}
                    </span>
                  </div>

                  {rule.keywords.length > 0 && (
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <Tag className="w-3 h-3 text-neutral-500" />
                      {rule.keywords.map(kw => (
                        <span
                          key={kw}
                          className="px-1.5 py-0.5 rounded bg-[#181820] text-[10px] text-neutral-300 font-mono"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {rule.extensions.length > 0 && (
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <FileCode className="w-3 h-3 text-neutral-500" />
                      {rule.extensions.map(ext => (
                        <span
                          key={ext}
                          className="px-1.5 py-0.5 rounded bg-blue-500/10 text-[10px] text-blue-300 font-mono"
                        >
                          {ext}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  title="Delete rule"
                  className="p-1.5 rounded hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0d]">
          <button
            onClick={handleResetDefaults}
            className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
