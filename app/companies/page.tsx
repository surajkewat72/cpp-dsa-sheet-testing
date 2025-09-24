import { Metadata } from "next";
import CompaniesPageClient from "./CompaniesPageClient";

export const metadata: Metadata = {
  title: "Company-Specific DSA Questions - FAANG & Top Tech Companies",
  description: "Practice company-specific Data Structures and Algorithms questions from FAANG, Microsoft, Google, Amazon, Meta, and other top tech companies. Curated questions for coding interviews at major tech companies.",
  keywords: [
    "company specific DSA questions",
    "FAANG interview questions",
    "Google coding interview",
    "Amazon coding interview",
    "Microsoft coding interview",
    "Meta coding interview",
    "Apple coding interview",
    "Netflix coding interview",
    "tech company interview preparation",
    "coding interview questions by company",
    "company wise DSA problems"
  ],
  openGraph: {
    title: "Company-Specific DSA Questions - FAANG & Top Tech Companies | DSAMate v2",
    description: "Practice company-specific Data Structures and Algorithms questions from FAANG, Microsoft, Google, Amazon, Meta, and other top tech companies.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Company-Specific DSA Questions - DSAMate v2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Company-Specific DSA Questions - FAANG & Top Tech Companies",
    description: "Practice company-specific DSA questions from FAANG, Microsoft, Google, Amazon, Meta, and other top tech companies.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/companies",
  },
};

export default function CompaniesPage() {
  return <CompaniesPageClient />;
}
