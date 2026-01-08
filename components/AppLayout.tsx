import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './Header';
import { TabNavigation } from './TabNavigation';
import { AppTab } from '../stores/uiStore';
import { ErrorBoundary } from './ErrorBoundary';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: AppTab;
  onNavigate: (view: AppTab) => void;
  analysisEnabled: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate,
  analysisEnabled 
}) => {
  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-science-500/30">
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* Header with integrated Nav */}
        <Header currentView={currentView} />
        
        {/* Tab Navigation Bar */}
        <div className="bg-slate-950 border-b border-slate-800 py-3 flex justify-center sticky top-0 z-20 no-print">
          <TabNavigation 
              currentView={currentView} 
              onChange={onNavigate} 
              analysisEnabled={analysisEnabled}
          />
        </div>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-hidden relative bg-slate-900" role="main">
          <div className="absolute inset-0 p-4 sm:p-6 overflow-auto custom-scrollbar">
            {children}
          </div>
        </main>
        
        {/* Status Footer */}
        <footer className="h-8 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6 text-[10px] text-slate-500 uppercase tracking-wider no-print">
          <div>CRISPR Off-Target Visualizer v1.0.0-beta</div>
          <div className="flex space-x-4">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span>Hg38 Genome</span>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};