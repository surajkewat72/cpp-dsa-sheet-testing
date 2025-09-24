import { Metadata } from "next";
import ContributorsPageClient from "./ContributorsPageClient";

export const metadata: Metadata = {
  title: "Contributors - DSAMate v2 Community & Open Source Contributors",
  description: "Meet the amazing contributors who make DSAMate v2 possible! View our open source community, GitHub contributors, and the talented developers building the future of DSA learning.",
  keywords: [
    "DSAMate contributors",
    "open source contributors",
    "GitHub contributors",
    "DSA community",
    "open source community",
    "contributors leaderboard",
    "GitHub stats",
    "open source developers",
    "DSA learning community",
    "programming contributors"
  ],
  openGraph: {
    title: "Contributors - DSAMate v2 Community & Open Source Contributors | DSAMate v2",
    description: "Meet the amazing contributors who make DSAMate v2 possible! View our open source community and talented developers.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "DSAMate v2 Contributors - Open Source Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contributors - DSAMate v2 Community & Open Source Contributors",
    description: "Meet the amazing contributors who make DSAMate v2 possible! View our open source community and talented developers.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/contributors",
  },
};

export default function ContributorsPage() {
  return <ContributorsPageClient />;
}
