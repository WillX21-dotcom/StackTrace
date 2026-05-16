"use client";

import { useState } from "react";
import { exportMarkdown, exportPDF } from "@/lib/export";
import type { AnalysisResult } from "@/lib/types";

interface ExportButtonsProps {
  repoName: string;
  analysisData: AnalysisResult | null;
}

export default function ExportButtons({ repoName, analysisData }: ExportButtonsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const disabled = !analysisData;

  const handleMarkdownExport = () => {
    if (!analysisData) return;
    exportMarkdown(repoName, analysisData);
  };

  const handlePDFExport = async () => {
    if (!analysisData) return;
    setIsGeneratingPDF(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      exportPDF(repoName, analysisData);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={handlePDFExport}
        disabled={disabled || isGeneratingPDF}
        className="px-6 py-3 bg-accent hover:bg-accent-hover text-background font-semibold rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={disabled ? "Run analysis first" : "Download PDF playbook"}
      >
        {isGeneratingPDF ? "Generating PDF..." : "↓ PDF"}
      </button>
      <button
        onClick={handleMarkdownExport}
        disabled={disabled}
        className="px-6 py-3 bg-surface border border-border hover:border-accent text-text-primary rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={disabled ? "Run analysis first" : "Download Markdown playbook"}
      >
        ↓ Markdown
      </button>
    </div>
  );
}

// Made with Bob
