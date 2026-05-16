// Export buttons component for PDF and Markdown download
// TODO: Implement export functionality

import type { AnalysisResult } from "@/lib/types";

interface ExportButtonsProps {
  repoName: string;
  analysisData: AnalysisResult;
  onExport: (format: "pdf" | "markdown") => void;
}

export default function ExportButtons({ repoName, analysisData, onExport }: ExportButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onExport("pdf")}
        className="px-4 py-2 bg-accent hover:bg-accent-hover text-background font-semibold rounded-button transition-colors"
      >
        📄 Export PDF
      </button>
      <button
        onClick={() => onExport("markdown")}
        className="px-4 py-2 bg-surface border border-border hover:border-accent text-text-primary rounded-button transition-colors"
      >
        📝 Export Markdown
      </button>
    </div>
  );
}

// Made with Bob
