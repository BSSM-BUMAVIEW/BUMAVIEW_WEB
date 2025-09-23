import React from 'react';
import type { AppSection } from '../types';
import { Dashboard } from './Dashboard';
import { InterviewBattle } from './InterviewBattle';
import { QuestionSearch } from './QuestionSearch';
import { Rankings } from './Rankings';
import { MockInterview } from './MockInterview';

interface ContentRendererProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ 
  activeSection, 
  onNavigate 
}) => {
  switch (activeSection) {
    case 'battle':
      return <InterviewBattle />;
    case 'search':
      return <QuestionSearch />;
    case 'rankings':
      return <Rankings />;
    case 'mock':
      return <MockInterview />;
    default:
      return <Dashboard onNavigate={onNavigate} />;
  }
};
