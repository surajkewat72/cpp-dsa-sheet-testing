import { Metadata } from "next";
import { Suspense } from "react";
import SheetPageClient from "./SheetPageClient";

export const metadata: Metadata = {
  title: "DSA Practice Problems - 450+ Curated Questions",
  description: "Practice 450+ Data Structures and Algorithms problems with smart filters, progress tracking, and solutions. Filter by difficulty, platform (LeetCode, GeeksforGeeks, HackerRank), and company. Perfect for coding interview preparation.",
  keywords: [
    "DSA practice problems",
    "coding interview questions",
    "leetcode problems",
    "geeksforgeeks questions",
    "hackerrank problems",
    "algorithm practice",
    "data structures problems",
    "coding interview preparation",
    "DSA sheet",
    "competitive programming"
  ],
  openGraph: {
    title: "DSA Practice Problems - 450+ Curated Questions | DSAMate v2",
    description: "Practice 450+ Data Structures and Algorithms problems with smart filters, progress tracking, and solutions. Perfect for coding interview preparation.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "DSA Practice Problems - DSAMate v2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Practice Problems - 450+ Curated Questions",
    description: "Practice 450+ Data Structures and Algorithms problems with smart filters and progress tracking. Perfect for coding interviews.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/sheet",
  },
};

export default function SheetPage() {
  return (
    <Suspense fallback={null}>
      <SheetPageClient />
    </Suspense>
  );
}

