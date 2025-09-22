import { Metadata } from "next";
import CPTrackerPageClient from "./CPTrackerPageClient";

export const metadata: Metadata = {
  title: "Competitive Programming Tracker - Codeforces & LeetCode Analytics",
  description: "Track your competitive programming progress with comprehensive analytics for Codeforces and LeetCode. Monitor ratings, solve counts, difficulty breakdowns, and contest history with beautiful visualizations.",
  keywords: [
    "competitive programming tracker",
    "codeforces analytics",
    "leetcode analytics",
    "CP progress tracking",
    "competitive programming statistics",
    "codeforces rating tracker",
    "leetcode progress tracker",
    "programming contest analytics",
    "competitive coding dashboard",
    "algorithm contest tracking"
  ],
  openGraph: {
    title: "Competitive Programming Tracker - Codeforces & LeetCode Analytics | DSAMate v2",
    description: "Track your competitive programming progress with comprehensive analytics for Codeforces and LeetCode. Monitor ratings, solve counts, and contest history.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Competitive Programming Tracker - DSAMate v2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Competitive Programming Tracker - Codeforces & LeetCode Analytics",
    description: "Track your competitive programming progress with comprehensive analytics for Codeforces and LeetCode.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/cp-tracker",
  },
};

export default function CPTrackerPage() {
  return <CPTrackerPageClient />;
}