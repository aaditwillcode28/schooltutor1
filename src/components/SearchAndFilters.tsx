import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SUBJECT_GROUPS } from '../data/ibdpData.ts';
import { SubjectLevel } from '../types/index.ts';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  selectedLevel: 'ALL' | SubjectLevel;
  onLevelChange: (level: 'ALL' | SubjectLevel) => void;
  totalMatches: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedGroup,
  onGroupChange,
  selectedLevel,
  onLevelChange,
  totalMatches,
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || selectedGroup !== 'All Groups' || selectedLevel !== 'ALL';

  const resetFilters = () => {
    onSearchChange('');
    onGroupChange('All Groups');
    onLevelChange('ALL');
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search subjects, topics, or tutor names (e.g. Math AA, Physics, Aadit)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Group Selector */}
        <div className="md:col-span-4 relative">
          <select
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all appearance-none pr-8 cursor-pointer"
          >
            {SUBJECT_GROUPS.map((grp) => (
              <option key={grp} value={grp}>
                {grp}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* HL/SL Level Toggle */}
        <div className="md:col-span-2 flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onLevelChange('ALL')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedLevel === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onLevelChange('HL')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedLevel === 'HL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HL
          </button>
          <button
            type="button"
            onClick={() => onLevelChange('SL')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedLevel === 'SL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SL
          </button>
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div>
          <span className="font-semibold text-slate-800">{totalMatches}</span>{' '}
          {totalMatches === 1 ? 'peer tutor matches' : 'peer tutors match'} your criteria
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1"
          >
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
};
