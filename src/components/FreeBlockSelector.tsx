import React from 'react';
import { FREE_BLOCKS } from '../data/ibdpData.ts';
import { FreeBlockId } from '../types/index.ts';
import { Check, X } from 'lucide-react';

interface FreeBlockSelectorProps {
  selectedBlocks: FreeBlockId[];
  onToggleBlock: (blockId: FreeBlockId) => void;
  onClearBlocks: () => void;
}

export const FreeBlockSelector: React.FC<FreeBlockSelectorProps> = ({
  selectedBlocks,
  onToggleBlock,
  onClearBlocks,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 transition-all">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Select Your Free Block
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose your free blocks to automatically display matching peer tutors
          </p>
        </div>

        {selectedBlocks.length > 0 && (
          <button
            onClick={onClearBlocks}
            type="button"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear selection ({selectedBlocks.length})
          </button>
        )}
      </div>

      {/* 10 Timetable Blocks Grid (8 Color Blocks + Lunch Block + MPB) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
        {FREE_BLOCKS.map((block) => {
          const isSelected = selectedBlocks.includes(block.id);

          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onToggleBlock(block.id)}
              className={`
                group relative flex flex-col items-center justify-center py-5 px-3 rounded-xl border-2 transition-all duration-150 cursor-pointer text-center
                ${block.bgClass} ${block.textClass} ${block.borderClass}
                ${isSelected 
                  ? 'ring-4 ring-offset-2 ring-slate-900 shadow-md scale-[1.03]' 
                  : 'opacity-90 hover:opacity-100 hover:scale-[1.01]'
                }
              `}
              title={`Toggle ${block.name}`}
            >
              {isSelected && (
                <div
                  className={`
                    absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px]
                    ${block.id === 'white' || block.id === 'yellow'
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white text-slate-900'
                    }
                  `}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <span className="text-sm font-extrabold capitalize tracking-tight">
                {block.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Blocks Tray directly below */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
            Selected Blocks:
          </span>

          {selectedBlocks.length === 0 ? (
            <span className="text-xs text-slate-500 italic">
              No blocks selected. Showing all available tutors, or click a color above to match your timetable.
            </span>
          ) : (
            selectedBlocks.map((blockId) => {
              const block = FREE_BLOCKS.find((b) => b.id === blockId);
              if (!block) return null;
              return (
                <span
                  key={blockId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: block.hexCode }}
                  />
                  <span>{block.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBlock(blockId);
                    }}
                    className="hover:text-rose-600 ml-1 cursor-pointer"
                    title={`Remove ${block.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
