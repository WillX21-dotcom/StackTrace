import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StackTrace | GitHub Repository Analysis",
  description: "Analyze GitHub repositories and generate structured onboarding documentation with AI-powered insights.",
  keywords: ["github", "repository", "analysis", "onboarding", "documentation", "developer tools"],
  authors: [{ name: "StackTrace" }],
  creator: "StackTrace",
  openGraph: {
    title: "StackTrace | GitHub Repository Analysis",
    description: "AI-powered GitHub repository analysis and onboarding documentation generator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}

// Made with Bob
