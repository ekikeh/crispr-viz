# User Guide: CRISPR Off-Target Visualizer

Welcome to the CRISPR Off-Target Visualizer. This guide will help you navigate the features of the application to ensure safe and efficient gene editing designs.

## Table of Contents
1. [Designing a Guide RNA](#1-designing-a-guide-rna)
2. [Importing Data](#2-importing-data)
3. [Analysis Dashboard](#3-analysis-dashboard)
4. [Visualizations](#4-visualizations)
5. [Exporting Results](#5-exporting-results)
6. [FAQ](#6-faq)

---

## 1. Designing a Guide RNA

If you are starting from scratch:

1.  Navigate to the **Design** tab.
2.  **Target Gene**: The system defaults to TP53 for demonstration, but you can mentally note your target.
3.  **Sequence Input**: Enter your 20-nucleotide spacer sequence (5' to 3').
    *   Do not include the PAM in the spacer box.
    *   The system calculates GC content automatically (aim for 40-60%).
4.  **PAM Selection**: Choose the Protospacer Adjacent Motif (PAM) from the dropdown (default `NGG` for SpCas9).
5.  **AI Check**: Click "Run AI Quality Check" to have Google Gemini analyze your sequence for efficiency, self-complementarity, or poly-T runs.

## 2. Importing Data

If you have already run an off-target prediction algorithm (like Cas-OFFinder or CRISPOR):

1.  Go to the **Design** tab.
2.  Locate the "Option 2: Import Data" section.
3.  Drag and drop your file or click "Browse Files".
4.  **Supported Formats**:
    *   **CSV/TSV**: Must contain columns for `Chromosome`, `Position`, and `Sequence`. Optional: `Score`, `Mismatches`, `Gene`.
    *   **BED**: Standard BED format.
5.  **Validation**: The system will validate headers and parse rows. A progress bar will indicate the status.

## 3. Analysis Dashboard

Once data is loaded, you are redirected to the Analysis Dashboard.

*   **Stats Bar**: Shows total hits, high-risk count, and chromosome spread.
*   **Filters**:
    *   **Region**: Filter by Exon, Intron, Promoter, or Intergenic.
    *   **Min Risk Score**: Slider to hide low-risk hits.
*   **View Toggle**: Switch between Linear Ideogram and Circos Plot.

## 4. Visualizations

### Linear Ideogram
Displays chromosomes linearly (1-22, X, Y).
*   **Vertical Bars**: Represent chromosomes.
*   **Dots**: Represent off-target hits.
    *   **Red**: High Risk (CFD > 0.8)
    *   **Amber**: Medium Risk
    *   **Blue**: Low Risk
*   **Interaction**: Hover for details, click to open the Detailed View.

### Circos Plot
Circular representation of the genome.
*   **Outer Ring**: Chromosomes.
*   **Inner Dots**: Off-target hits positioned radially by score (High score = further out).
*   **Lines**: Connecting lines show relationships (e.g., from Target to Off-target).

### Detailed View (Side Panel)
Clicking any hit opens the side drawer:
*   **Alignment**: Shows the mismatch between Guide and Off-Target sequences.
*   **Genomic Context**: Visual diagram showing if the cut is in an Exon, Intron, or Promoter.
*   **Risk Assessment**: AI-generated or rule-based risk level summary.
*   **External Links**: Direct links to UCSC Genome Browser.

## 5. Exporting Results

Use the **Export** button in the top right corner:

*   **PDF Report**: Generates a formal summary with the current chart snapshot and a table of top hits.
*   **Image (PNG/SVG)**: High-resolution download of the current visualization.
*   **Data (CSV/BED/JSON)**: Download the filtered dataset for external use.

## 6. FAQ

**Q: What is the CFD Score?**
A: The Cutting Frequency Determination score predicts the likelihood of Cas9 cleavage. A score of 1.0 implies high efficiency (or perfect match), while 0.0 implies no cleavage.

**Q: My CSV file isn't loading.**
A: Ensure your CSV has headers. The parser looks for columns named roughly "Chromosome", "Position", and "Sequence".

**Q: Is the data sent to a server?**
A: Data parsing happens entirely in your browser. However, when using AI features, text prompts are sent to the Google Gemini API.