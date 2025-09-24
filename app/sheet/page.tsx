import { Metadata } from "next";
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

  return <SheetPageClient />;
}

  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [revisionFilter, setRevisionFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const [randomPick, setRandomPick] = useState<{
    topicName: string;
    question: Question;
  } | null>(null);

  const [streak, setStreak] = useState(0);
  const [potd, setPotd] = useState<Question | null>(null);

  useEffect(() => {

    const potd = getPOTD();
    setPotd(potd);

    const savedStreak = parseInt(localStorage.getItem("potd_streak") || "0");
    setStreak(savedStreak);
  }, []);

  const updateStreak = () => {
    const updatedStreak = parseInt(localStorage.getItem("potd_streak") || "0");
    setStreak(updatedStreak);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const resetFilters = () => {
    setDifficultyFilter("");
    setStatusFilter("");
    setRevisionFilter("");
    setPlatformFilter("");
    setCompanyFilter("");
  };

  const pickRandomQuestion = () => {
    const all = sampleTopics.flatMap((topic) =>
      topic.questions.map((q) => ({ topicName: topic.name, question: q }))
    );
    if (all.length === 0) return;
    let idx = Math.floor(Math.random() * all.length);
    if (randomPick && all.length > 1) {
      const lastId = `${randomPick.topicName}-${randomPick.question.id}`;
      // Re-roll once if same as last shown
      const candidateId = `${all[idx].topicName}-${all[idx].question.id}`;
      if (candidateId === lastId) {
        idx = (idx + 1) % all.length;
      }
    }
    setRandomPick(all[idx]);
    // Smooth scroll to the card for visibility on mobile
    setTimeout(() => {
      const el = document.getElementById("random-question-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/5 dark:to-blue-900/10 text-gray-900 dark:text-white px-4 md:px-8 sheet-navbar-offset pb-24 transition-colors duration-300">
        <ReportIssueButton />

        {/* Progress Summary */}
        <ProgressSummary />

        {/* HERO SECTION */}
        <div className="mb-8 text-center">
          <div className="relative">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
              DSA Practice Problems
            </h1>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500/20 rounded-full animate-pulse delay-1000"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              <strong className="text-blue-600 dark:text-blue-400">Note:</strong> Questions marked with the (for practice) tag
              do not include the exact solutions. The provided code solutions in
              this section serve as hints or are solutions to similar problems
              from platforms like{" "}
              <span className="text-orange-500 dark:text-orange-400 font-semibold">LeetCode</span>,{" "}
              <span className="text-green-600 dark:text-green-400 font-semibold">
                GeeksforGeeks
              </span>
              , or{" "}
              <span className="text-yellow-500 dark:text-yellow-400 font-semibold">
                HackerRank
              </span>{" "}
              ...
            </p>
            
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 rounded-xl px-6 py-4 inline-block text-sm md:text-base transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold">Company-wise filtering is currently in progress.</span> You might see
                  incomplete or missing tags. Contribute company-specific questions
                  via{" "}
                  <a
                    href="https://forms.gle/8WccErg3TBFTMPkj9"
                    className="underline font-semibold hover:text-amber-900 dark:hover:text-amber-100 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    this form
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEGEND SECTION */}
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-blue-200/30 dark:border-blue-700/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Question Popularity Legend
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm md:text-base">
              <li className="flex items-center space-x-2 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                <span className="text-lg">⚡</span>
                <span className="text-gray-700 dark:text-gray-300">Asked in 20+ companies</span>
              </li>
              <li className="flex items-center space-x-2 p-3 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg border border-orange-200/30 dark:border-orange-700/30">
                <span className="text-lg">⚡🔥</span>
                <span className="text-gray-700 dark:text-gray-300">Asked in 50+ companies</span>
              </li>
              <li className="flex items-center space-x-2 p-3 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200/30 dark:border-yellow-700/30">
                <span className="text-lg">⚡🔥🏆</span>
                <span className="text-gray-700 dark:text-gray-300">Asked in 80+ companies</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Based on data from LeetCode and GeeksforGeeks company tags
            </p>
          </div>
        </div>

        {/* FILTERS SECTION */}
        <div className="mb-8 max-w-7xl mx-auto">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-blue-200/30 dark:border-blue-700/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Filter Questions
            </h3>
            <div className="flex flex-wrap gap-4 md:items-center">
              {/* Difficulty Filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-md text-gray-900 dark:text-white rounded-xl px-4 py-2.5 border border-blue-200/50 dark:border-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {/* Solved Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-md text-gray-900 dark:text-white rounded-xl px-4 py-2.5 border border-blue-200/50 dark:border-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <option value="">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>

              {/* Revision Filter */}
              <select
                value={revisionFilter}
                onChange={(e) => setRevisionFilter(e.target.value)}
                className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-md text-gray-900 dark:text-white rounded-xl px-4 py-2.5 border border-blue-200/50 dark:border-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <option value="">All Revision Status</option>
                <option value="marked">Marked for Revision</option>
                <option value="unmarked">Not Marked</option>
              </select>

              {/* Platform Filter */}
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-md text-gray-900 dark:text-white rounded-xl px-4 py-2.5 border border-blue-200/50 dark:border-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <option value="">All Platforms</option>
                <option value="leetcode">LeetCode</option>
                <option value="gfg">GeeksforGeeks</option>
                <option value="hackerrank">HackerRank</option>
                <option value="spoj">SPOJ</option>
                <option value="ninja">Coding Ninjas</option>
                <option value="code">Others</option>
              </select>

              {/* Company Filter */}
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-md text-gray-900 dark:text-white rounded-xl px-4 py-2.5 border border-blue-200/50 dark:border-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <option value="">All Companies</option>
                <option value="Adobe">Adobe</option>
                <option value="Amazon">Amazon</option>
                <option value="Apple">Apple</option>
                <option value="Cisco">Cisco</option>
                <option value="DE shaw">DE shaw</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Google">Google</option>
                <option value="Intuit">Intuit</option>
                <option value="MakeMyTrip">MakeMyTrip</option>
                <option value="Meta">Meta</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Morgan Stanley">Morgan Stanley</option>
                <option value="Nvidia">Nvidia</option>
                <option value="Oracle">Oracle</option>
                <option value="Paypal">PayPal</option>
                <option value="Paytm">Paytm</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Salesforce">Salesforce</option>
                <option value="Samsung">Samsung</option>
                <option value="Sprinklr">Sprinklr</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Tesla">Tesla</option>
                <option value="Walmart">Walmart</option>
                <option value="Uber">Uber</option>
                <option value="Visa">Visa</option>
                <option value="WITCH">WITCH</option>
                {/* Add more as needed */}
              </select>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl px-6 py-2.5 shadow-lg hover:from-red-500/20 hover:to-red-600/20 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 font-medium backdrop-blur-sm"
              >
                Reset Filters
              </button>

              {/* Pick Random Question */}
              <button
                onClick={pickRandomQuestion}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 font-medium flex items-center space-x-2 backdrop-blur-sm"
              >
                <span>🎲</span>
                <span>Pick Random Question</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* POTD Section */}
        <POTD potd={potd} updateStreak={updateStreak} />

        {/* Random Question Card */}
        {randomPick && (
          <div
            id="random-question-card"
            className="mt-6 mb-8 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-900/40 dark:to-indigo-900/40 backdrop-blur-md border border-blue-200/40 dark:border-blue-700/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                      🎯 Random Pick
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {randomPick.question.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="font-medium">Topic:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{randomPick.topicName}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="font-medium">Difficulty:</span>
                      <span className={`font-semibold capitalize ${
                        randomPick.question.difficulty === 'easy' ? 'text-green-600 dark:text-green-400' :
                        randomPick.question.difficulty === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {randomPick.question.difficulty}
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={pickRandomQuestion}
                  className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                >
                  Pick Another
                </button>
              </div>
              {/* Links */}
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(randomPick.question.links || {}).map(
                  ([key, url]) =>
                    url ? (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white/60 dark:bg-gray-700/60 border border-blue-200/50 dark:border-blue-600/50 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all duration-200"
                      >
                        {key}
                      </a>
                    ) : null
                )}
                {randomPick.question.solutionLink && (
                  <a
                    href={randomPick.question.solutionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white/60 dark:bg-gray-700/60 border border-gray-200/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200"
                  >
                    solution
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SHEET CONTENT */}
        <div>
          <SheetContent
            difficultyFilter={difficultyFilter}
            statusFilter={statusFilter}
            revisionFilter={revisionFilter}
            searchTerm={searchTerm}
            platformFilter={platformFilter}
            companyFilter={companyFilter}
          />
        </div>
      </main>

      <TestimonialPrompt />
    </>
  );
}

