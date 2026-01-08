import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { AppTab } from './stores/uiStore';
import { useOffTargetStore } from './stores/offTargetStore';
import { DesignPage } from './pages/DesignPage';
import { AnalysisPage } from './pages/AnalysisPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hits } = useOffTargetStore();

  // Determine current view based on path
  const currentView: AppTab = location.pathname.startsWith('/analysis') ? 'ANALYSIS' : 'DESIGN';
  const analysisEnabled = hits.length > 0;

  const handleNavigate = (view: AppTab) => {
    if (view === 'DESIGN') {
      navigate('/design');
    } else if (view === 'ANALYSIS' && analysisEnabled) {
      navigate('/analysis');
    }
  };

  return (
    <AppLayout 
      currentView={currentView} 
      onNavigate={handleNavigate}
      analysisEnabled={analysisEnabled}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/design" replace />} />
        <Route 
          path="/design" 
          element={
            <DesignPage 
              onAnalyze={() => navigate('/analysis')} 
            />
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <AnalysisPage 
              onBack={() => navigate('/design')} 
            />
          } 
        />
        <Route 
          path="/analysis/:hitId" 
          element={
            <AnalysisPage 
              onBack={() => navigate('/design')} 
            />
          } 
        />
        <Route path="*" element={<Navigate to="/design" replace />} />
      </Routes>
    </AppLayout>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;