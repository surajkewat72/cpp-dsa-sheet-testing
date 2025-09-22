import { Metadata } from "next";
import ProgressPageClient from "./ProgressPageClient";

export const metadata: Metadata = {
  title: "Progress Tracking - DSA Analytics & Statistics",
  description: "Track your DSA learning journey with comprehensive analytics, progress charts, streak tracking, and detailed statistics. Monitor your solving patterns, completion rates, and celebrate achievements.",
  keywords: [
    "DSA progress tracking",
    "coding progress analytics",
    "algorithm learning statistics",
    "programming streak tracker",
    "DSA completion rate",
    "coding interview progress",
    "learning analytics",
    "programming statistics"
  ],
  openGraph: {
    title: "Progress Tracking - DSA Analytics & Statistics | DSAMate v2",
    description: "Track your DSA learning journey with comprehensive analytics, progress charts, streak tracking, and detailed statistics.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "DSA Progress Tracking - DSAMate v2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Progress Tracking - DSA Analytics & Statistics",
    description: "Track your DSA learning journey with comprehensive analytics, progress charts, and streak tracking.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/progress",
  },
};

export default function ProgressPage() {
  return <ProgressPageClient />;
}