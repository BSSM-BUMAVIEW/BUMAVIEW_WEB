import React from 'react';
import { Card, CardContent } from '../ui/card';

interface Stat {
  label: string;
  value: string;
  icon: string;
  piece: string;
  color: string;
  delay: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="relative overflow-hidden bg-white border border-slate-200 shadow-lg hover:border-blue-300 transition-all duration-500 interactive-scale animate-slide-in-up cursor-pointer group hover:shadow-xl hover:shadow-blue-500/10"
          style={{animationDelay: stat.delay}}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-500 mb-1 group-hover:text-slate-600 transition-colors">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors animate-typewriter">{stat.value}</p>
                <p className="text-xs text-blue-500 mt-1 group-hover:text-blue-600 transition-colors">{stat.piece}</p>
              </div>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 interactive-glow`}>
                <span className="text-white text-2xl animate-chess-hover">{stat.icon}</span>
              </div>
            </div>
            
            {/* Animated Chess square pattern */}
            <div className="absolute top-2 right-2 w-4 h-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                <div className="bg-slate-200/50 group-hover:bg-blue-200/60 transition-colors"></div>
                <div className="bg-transparent"></div>
                <div className="bg-transparent"></div>
                <div className="bg-slate-200/50 group-hover:bg-blue-200/60 transition-colors"></div>
              </div>
            </div>

            {/* Hover shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
