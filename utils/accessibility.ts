import React from 'react';

export const PALETTES = {
  default: {
    highRisk: '#ef4444', // Red-500
    medRisk: '#f59e0b',  // Amber-500
    lowRisk: '#3b82f6',  // Blue-500
    onTarget: '#10b981', // Emerald-500
    neutral: '#94a3b8'   // Slate-400
  },
  colorBlind: {
    // Okabe-Ito inspired palette for CVD safety
    highRisk: '#d55e00', // Vermilion
    medRisk: '#e69f00',  // Orange
    lowRisk: '#56b4e9',  // Sky Blue
    onTarget: '#009e73', // Bluish Green
    neutral: '#999999'   // Grey
  }
};

export const getRiskColor = (score: number, isColorBlindMode: boolean = false) => {
    const palette = isColorBlindMode ? PALETTES.colorBlind : PALETTES.default;
    if (score > 0.8) return palette.highRisk;
    if (score > 0.4) return palette.medRisk;
    return palette.lowRisk;
};

export const handleKeyboardClick = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
    }
};

export const generateAriaLabel = (hit: any) => {
    return `Off-target hit on chromosome ${hit.chromosome}, position ${hit.position}, gene ${hit.geneName || 'Unknown'}, Risk Score ${hit.cfdScore.toFixed(2)}`;
};
