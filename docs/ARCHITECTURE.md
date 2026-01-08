# Architecture: CRISPR Off-Target Visualizer

This document provides a high-level overview of the application architecture, state management, and key design patterns used in the codebase.

## 1. Component Hierarchy

The application follows a standard React component tree structure, wrapped in global providers.

```
App
├── BrowserRouter
│   └── AppLayout
│       ├── Header (Navigation & Accessibility)
│       ├── Toaster (Notifications)
│       ├── ErrorBoundary
│       └── Routes
│           ├── DesignPage
│           │   ├── GuideDesigner (Input Form)
│           │   └── FileUploader (Drag & Drop)
│           └── AnalysisPage
│               └── AnalysisDashboard
│                   ├── SummaryStatsBar
│                   ├── ViewToggle (Linear/Circos)
│                   ├── VisualizationContainer (D3)
│                   │   ├── ChromosomeIdeogram
│                   │   └── CircosPlot
│                   ├── SequenceAlignmentView
│                   └── OffTargetDetailPanel (Drawer)
```

## 2. State Management (Zustand)

We use **Zustand** for global state management, split into logical stores to avoid monolithic state objects.

### `guideRNAStore.ts`
Manages the current guide RNA design.
*   **State**: `sequence`, `pamSequence`, `targetGene`.
*   **Persistence**: Persisted to localStorage to save work between reloads.

### `offTargetStore.ts`
Manages the large dataset of off-target hits.
*   **State**: `hits` (Array of OffTargetHit), `isLoading`, `parseStats`.
*   **Logic**: Handles file parsing results and mock analysis generation.

### `uiStore.ts`
Manages UI preferences and ephemeral state.
*   **State**: `activeTab`, `activeVisualization`, `selectedHitId`, `filters`, `accessibility`.
*   **Persistence**: Filters and view preferences are persisted.

## 3. Visualization Strategy (D3.js + React)

We employ a **"React controls D3"** pattern where:
1.  **React** handles the DOM container (`<svg>` or `<div>`), data fetching, and resize observation.
2.  **D3.js** handles the internal rendering of axes, scales, and shapes within `useEffect` hooks.
3.  **Hooks**: `useD3` handles the ref binding and cleanup. `useCircosLayout` calculates polar coordinates logic separate from rendering.

## 4. Accessibility & Responsiveness

*   **Responsive**: CSS variables and Tailwind classes handle layout shifts (`flex-col` on mobile vs `flex-row` on desktop). `useMediaQuery` hook allows conditional rendering of complex charts on small screens.
*   **Accessibility**:
    *   `aria-label` attributes generated dynamically for data points.
    *   Focus management in Modals/Drawers.
    *   Color-blind palette switching via `uiStore`.

## 5. Adding New Features

### Adding a New Parser
1.  Create a parser file in `src/utils/parsers/`.
2.  Implement the logic to return `OffTargetHit[]`.
3.  Register it in `FileUploader.tsx`.

### Adding a New Visualization
1.  Create a component in `src/visualizations/`.
2.  Use `useAnalysisData` to get filtered hits.
3.  Add the option to `ViewToggle.tsx` and the switch case in `AnalysisDashboard.tsx`.