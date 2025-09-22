import { Metadata } from "next";
import FlashcardsPageClient from "./FlashcardsPageClient";

export const metadata: Metadata = {
  title: "DSA Flashcards - Interactive Learning for Data Structures & Algorithms",
  description: "Master Data Structures and Algorithms concepts with interactive flashcards. Practice core DSA topics, track your progress, and reinforce your learning with spaced repetition. Perfect for coding interview preparation.",
  keywords: [
    "DSA flashcards",
    "data structures flashcards",
    "algorithms flashcards",
    "interactive DSA learning",
    "coding interview flashcards",
    "DSA concepts practice",
    "spaced repetition learning",
    "algorithm flashcards",
    "programming concepts",
    "computer science flashcards"
  ],
  openGraph: {
    title: "DSA Flashcards - Interactive Learning for Data Structures & Algorithms | DSAMate v2",
    description: "Master Data Structures and Algorithms concepts with interactive flashcards. Practice core DSA topics and track your progress.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "DSA Flashcards - Interactive Learning | DSAMate v2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Flashcards - Interactive Learning for Data Structures & Algorithms",
    description: "Master Data Structures and Algorithms concepts with interactive flashcards. Practice core DSA topics and track your progress.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/flashcards",
  },
};

export default function FlashcardsPage() {
  return <FlashcardsPageClient />;
}
