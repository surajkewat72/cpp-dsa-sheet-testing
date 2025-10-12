export interface HackerEarthRankTriple {
  rank: number | null;
  points: number | null;
  performance: string | null;
}

export interface HackerEarthStats {
  Points: number;
  ContestRating: number | null;
  ProblemsSolved: number;
  Submissions: number | null;
  rankings: {
    algorithms: HackerEarthRankTriple;
    dataStructures: HackerEarthRankTriple;
  };
}

export const fetchHackerEarthStats = async (
  username: string
): Promise<HackerEarthStats | null> => {
  const res = await fetch("/api/hackerearth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    let msg = "Failed to fetch HackerEarth stats";
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  return data?.stats ?? null;
};

