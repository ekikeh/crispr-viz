# CRISPR Off-Target Visualizer

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

A powerful bioinformatics tool designed for researchers to validate CRISPR guide RNAs (sgRNAs) by visualizing potential off-target effects across the genome. It combines high-performance D3.js data visualization with AI-powered insights from Google Gemini to assess safety risks in gene editing experiments.

## 🚀 Key Features

*   **Dual Analysis Modes**: Design new guides or import existing prediction data (Cas-OFFinder CSV/BED).
*   **Interactive Visualizations**:
    *   **Linear Ideogram**: See off-target distribution across all chromosomes.
    *   **Circos Plot**: Analyze relationships and density in a circular genome layout.
*   **Deep Sequence Alignment**: Pixel-perfect nucleotide alignment visualization highlighting mismatches.
*   **Safety Scoring**: Cutting Frequency Determination (CFD) scoring to prioritize high-risk sites.
*   **AI Insights**: Integrated Google Gemini API to optimize sgRNA sequence efficiency and cloning.
*   **Genomic Context**: Automatic detection of off-target locations (Exon, Intron, Promoter, Intergenic).
*   **Export Capabilities**: Generate PDF reports, SVG/PNG images of charts, and CSV data dumps.
*   **Accessibility First**: Color-blind friendly modes, keyboard navigation, and screen reader support.

## 🛠 Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **State Management**: Zustand
*   **Visualization**: D3.js
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google GenAI SDK (Gemini)
*   **Data Parsing**: PapaParse (CSV), Custom BED parser
*   **Export**: html-to-image, jsPDF

## 📦 Getting Started

### Prerequisites
*   Node.js 18+
*   NPM or Yarn
*   A Google Gemini API Key (for AI features)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/crispr-visualizer.git
    cd crispr-visualizer
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
    Create a `.env` file in the root directory:
    ```
    VITE_API_KEY=your_google_gemini_api_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
├── features/           # Feature-specific logic
├── hooks/              # Custom React hooks (D3, Export, Logic)
├── pages/              # Route components
├── services/           # External API services (Gemini)
├── stores/             # Global state (Zustand)
├── styles/             # Global CSS and Print styles
├── types/              # TypeScript interfaces
├── utils/              # Helper functions (Bioinformatics, Parsing)
└── visualizations/     # D3.js Chart Components
```

## 📖 Documentation

*   [**User Guide**](./docs/USER_GUIDE.md): Detailed instructions on how to use the application.
*   [**Architecture**](./docs/ARCHITECTURE.md): Technical overview for developers.
*   [**API Reference**](./docs/API.md): Documentation for internal components.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Disclaimer**: This tool is for research purposes only. Always validate off-target predictions experimentally.