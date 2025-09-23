import React from 'react';
import { getSectionTitle, getSectionIcon } from '../lib/utils';
import type { AppSection } from '../types';

interface LoadingProps {
  activeSection: AppSection;
}

export const Loading: React.FC<LoadingProps> = ({ activeSection }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl">{getSectionIcon(activeSection)}</span>
        </div>
        <div className="text-slate-800 text-lg font-medium">
          {getSectionTitle(activeSection)} 로딩 중...
        </div>
        <div className="mt-2 w-24 h-1 bg-slate-200 rounded-full mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-3/4"></div>
        </div>
      </div>
    </div>
  );
};
