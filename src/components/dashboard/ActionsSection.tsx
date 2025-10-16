import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { APP_TEXTS } from '../../constants/texts';
import type { AppSection } from '../../types';

interface Action {
  title: string;
  description: string;
  piece: string;
  color: string;
  href: string;
  highlight?: boolean;
  position: string;
}

interface ActionsSectionProps {
  onNavigate: (section: AppSection)=>void;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({ onNavigate }) => {
  const quickActions = [
    {
      title: APP_TEXTS.dashboard.actions.chessDuel.title,
      description: APP_TEXTS.dashboard.actions.chessDuel.description,
      piece: '♞',
      color: 'from-red-500 to-red-700',
      action: () => onNavigate('battle'),
      href: '/battle',
      position: 'a1',
      highlight: true
    },
    {
      title: APP_TEXTS.dashboard.actions.knowledgeExploration.title,
      description: APP_TEXTS.dashboard.actions.knowledgeExploration.description,
      piece: '♗',
      color: 'from-blue-500 to-blue-700',
      action: () => onNavigate('search'),
      href: '/search',
      position: 'b8'
    },
    {
      title: APP_TEXTS.dashboard.actions.soloTraining.title,
      description: APP_TEXTS.dashboard.actions.soloTraining.description,
      piece: '♖',
      color: 'from-emerald-500 to-emerald-700',
      action: () => onNavigate('mock'),
      href: '/mock',
      position: 'h1'
    },
    {
      title: APP_TEXTS.dashboard.actions.hallOfFame.title,
      description: APP_TEXTS.dashboard.actions.hallOfFame.description,
      piece: '♕',
      color: 'from-amber-500 to-amber-700',
      action: () => onNavigate('rankings'),
      href: '/rankings',
      position: 'd8'
    }
  ];
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="mr-3">♔</span>
        {APP_TEXTS.dashboard.actions.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card 
              className="cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 transform group relative bg-white border border-slate-200 shadow-lg hover:border-blue-300 interactive-scale animate-slide-in-up"
              style={{animationDelay: `${0.4 + index * 0.2}s`}}
            >
            <CardContent className="p-6 relative overflow-hidden">
              {/* Chess coordinate */}
              <div className="absolute top-2 left-2 text-xs text-slate-400 group-hover:text-slate-600 transition-colors animate-blink">{action.position}</div>
              
              {/* Action ripple effect */}
              <div className="absolute inset-0 bg-blue-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 interactive-glow animate-float`}>
                      <span className="text-white text-2xl animate-chess-hover">{action.piece}</span>
                    </div>
                    <div className="group-hover:translate-x-2 transition-transform duration-300">
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{action.title}</h3>
                    </div>
                    {action.highlight && (
                      <Badge className="bg-blue-100 text-blue-600 border-blue-200 animate-pulse">
                        <Zap className="w-3 h-3 mr-1" />
                        {APP_TEXTS.dashboard.actions.chessDuel.activate}
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors">{action.description}</p>
                </div>

                {/* Hover arrow */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <ChevronRight className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              
              {/* Animated Chess pattern decoration */}
              <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-30 transition-opacity">
                <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
                  {Array.from({length: 16}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`transition-colors duration-300 ${i % 2 === Math.floor(i/4) % 2 ? 'bg-slate-300 group-hover:bg-blue-300' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Moving light effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
