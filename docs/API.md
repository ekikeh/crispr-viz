# Internal Component API Reference

This document outlines the props and usage of key reusable components within the application.

## Visualizations

### `<ChromosomeIdeogram />`
Renders a linear view of all chromosomes with off-target markers.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `OffTargetHit[]` | Array of hits to render. |
| `onHitClick` | `(hit) => void` | Callback when a hit marker is clicked. |
| `width` | `number` | Width of the SVG container. |
| `height` | `number` | Height of the SVG container. |

### `<CircosPlot />`
Renders a circular genome plot.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `OffTargetHit[]` | Array of hits to render. |
| `currentGuide` | `GuideRNA` | Metadata about the guide (for center label). |
| `onHitClick` | `(hit) => void` | Callback when a hit marker is clicked. |
| `onTargetLocation` | `{ chr, pos }` | Optional. Draws connection lines from this point. |

## UI Components

### `<FileUploader />`
Handles file selection, drag-and-drop, and parsing logic.
*   **No Props**: Self-contained component that updates `offTargetStore`.

### `<SequenceAlignmentView />`
Displays the list of aligned sequences alongside the reference.

| Prop | Type | Description |
|------|------|-------------|
| `guideSequence` | `string` | The 20nt reference sequence. |
| `hits` | `OffTargetHit[]` | Sorted and filtered hits to display. |
| `selectedHitId` | `string` | ID of the currently active hit (highlighted). |
| `onHitSelect` | `(hit) => void` | Callback for row selection. |

### `<ExportMenu />`
Dropdown menu for exporting data and images.

| Prop | Type | Description |
|------|------|-------------|
| `hits` | `OffTargetHit[]` | Data to export. |
| `guideInfo` | `object` | Metadata for filenames/headers. |
| `visualizationId` | `string` | HTML ID of the element to capture (screenshot). |

## Hooks

### `useAnalysisData()`
Aggregates data from multiple stores into a single convenient object.

**Returns:**
*   `guide`: Guide store state.
*   `offTargets`: Raw off-target data.
*   `ui`: UI store state.
*   `processed`: Object containing `filteredHits` and `sortedHits`.
*   `riskSummary`: Counts of high/med/low risk hits.

### `useExport()`
Provides helper functions for exporting.

**Returns:**
*   `exportImage(id, name, format)`: Async function to download DOM element.
*   `exportData(type, hits, name)`: Async function to download text files.
*   `exportReport(...)`: Async function to generate PDF.
*   `isExporting`: Boolean flag for loading state.