import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Info } from 'lucide-react';
import { OffTargetHit } from '../types';

interface RiskAssessmentCardProps {
  hit: OffTargetHit;
}

export const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({ hit }) => {
  const isHighRisk = hit.cfdScore > 0.8 || (hit.regionType === 'Exon' && hit.cfdScore > 0.5);
  const isMedRisk = !isHighRisk && (hit.cfdScore > 0.4 || hit.regionType === 'Promoter');
  
  return (
    <div className={`
      relative overflow-hidden rounded-lg p-5 border 
      ${isHighRisk 
        ? 'bg-red-500/10 border-red-500/30' 
        : isMedRisk 
          ? 'bg-amber-500/10 border-amber-500/30' 
          : 'bg-emerald-500/10 border-emerald-500/30'
      }
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isHighRisk ? (
            <ShieldAlert className="text-red-400" size={24} />
          ) : isMedRisk ? (
            <AlertTriangle className="text-amber-400" size={24} />
          ) : (
            <ShieldCheck className="text-emerald-400" size={24} />
          )}
          <div>
            <h4 className={`font-bold ${
              isHighRisk ? 'text-red-400' : isMedRisk ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {isHighRisk ? 'High Risk' : isMedRisk ? 'Medium Risk' : 'Low Risk'}
            </h4>
            <span className="text-xs text-slate-400">Based on CFD Score & Region</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-200">{hit.cfdScore.toFixed(2)}</div>
          <div className="text-xs text-slate-500">Score (0-1)</div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Score Bar */}
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isHighRisk ? 'bg-red-500' : isMedRisk ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${hit.cfdScore * 100}%` }}
          />
        </div>

        {/* Text Analysis */}
        <div className="bg-slate-900/50 rounded p-3 text-sm text-slate-300 border border-slate-700/50">
          <p className="mb-2">
            This off-target has <strong>{hit.mismatches} mismatch{hit.mismatches !== 1 ? 'es' : ''}</strong> relative to the guide sequence.
          </p>
          
          {isHighRisk && (
            <p className="text-red-300">
              ⚠️ <strong>Critical Warning:</strong> High likelihood of cleavage. 
              {hit.regionType === 'Exon' && ' Located in a coding exon, potentially causing frameshift mutations.'}
            </p>
          )}
          
          {isMedRisk && (
            <p className="text-amber-300">
              ⚠️ <strong>Caution:</strong> Moderate cleavage efficiency predicted.
              {hit.regionType === 'Promoter' && ' Proximity to promoter may affect gene expression.'}
            </p>
          )}

          {!isHighRisk && !isMedRisk && (
            <p className="text-emerald-300">
              ✓ Low predicted cleavage efficiency. Located in {hit.regionType.toLowerCase()} region.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};