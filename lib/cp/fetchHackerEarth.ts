// lib/cp/fetchHackerEarth.ts
// Scrapes public HackerEarth profile stats. No official public API.
// Returns Points, ContestRating, ProblemsSolved, Submissions, and
// Rankings for Algorithms and Data Structures (rank, points, performance) when found.
import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";

type RankTriple = { rank: number | null; points: number | null; performance: string | null };
type Challenge = { name: string; rank: number | null; ratingChange: string | null };

export const fetchHackerEarthStats = async (username: string) => {
  const parseFromText = (docText: string) => {
    // Remove JSON data that might contain misleading values (like badge points)
    // Remove everything between { and } that looks like JSON
    const cleanedText = docText.replace(/\{[^{}]*"points"[^{}]*\}/g, '');

    const parseNum = (s?: string | null) => {
      if (!s) return null;
      const m = s.replace(/[,\s]/g, "").match(/[-+]?\d+(?:\.\d+)?/);
      return m ? Number(m[0]) : null;
    };

    const extractByLabel = (labelCandidates: string[], debugName?: string): number | null => {
      const lower = cleanedText.toLowerCase();
      for (const l of labelCandidates) {
        const label = l.toLowerCase();

        // Try more specific patterns first (with colons, equal signs, etc.)
        const patterns = [
          new RegExp(`${l}\\s*[:\-=]?\\s*([0-9][0-9,\\.]+)`, "i"),
          new RegExp(`([0-9][0-9,\\.]+)\\s*${l}`, "i"),
          new RegExp(`${l}[^0-9]*?([0-9][0-9,\\.]+)`, "i"),
        ];

        for (const pattern of patterns) {
          const match = cleanedText.match(pattern);
          if (match && match[1]) {
            const num = parseNum(match[1]);
            // Filter out unlikely values (e.g., years, very large numbers that don't make sense)
            if (num !== null && num < 1000000) {
              if (debugName) console.log(`[HackerEarth] ${debugName} found "${num}" using pattern for label "${l}"`);
              return num;
            }
          }
        }

        // Original proximity-based search as fallback
        const idx = lower.indexOf(label);
        if (idx !== -1) {
          // Look forward first (most common pattern: label followed by value)
          const forward = cleanedText.substring(idx, idx + 150);
          const mFwd = forward.match(/([0-9][0-9,\.]+)/);
          if (mFwd && mFwd[1]) {
            const num = parseNum(mFwd[1]);
            if (num !== null && num < 1000000) {
              if (debugName) console.log(`[HackerEarth] ${debugName} found "${num}" near label "${l}"`);
              return num;
            }
          }
        }
      }
      return null;
    };

    const extractSection = (keyword: string): RankTriple => {
      const out: RankTriple = { rank: null, points: null, performance: null };
      const idx = cleanedText.toLowerCase().indexOf(keyword.toLowerCase());
      if (idx === -1) return out;
      const windowText = cleanedText.substring(idx, Math.min(cleanedText.length, idx + 1200));
      const rankM = windowText.match(/rank\s*#?\s*([0-9][0-9,\.]*)/i);
      const pointsM = windowText.match(/(?:points?|score)\s*:?\s*([0-9][0-9,\.]*)/i);
      const perfM = windowText.match(/performance\s*:?\s*([a-zA-Z][a-zA-Z\s%\-+]*)/i);
      if (rankM && rankM[1]) out.rank = parseNum(rankM[1]);
      if (pointsM && pointsM[1]) out.points = parseNum(pointsM[1]);
      if (perfM && perfM[1]) out.performance = perfM[1].trim();
      return out;
    };

    const Points = extractByLabel([
      "Total Points",
      "Points",
      "Practice Points",
      "Score",
      "Total Score"
    ], "Points");
    const ContestRating = extractByLabel([
      "Contest Rating",
      "Contest Ratings",
      "Rating",
      "Current Rating"
    ], "ContestRating");
    const ProblemsSolved = extractByLabel([
      "Problems Solved",
      "Problem Solved",
      "Solved Problems",
      "Total Solved",
      "Questions Solved"
    ], "ProblemsSolved");
    const Submissions = extractByLabel([
      "Solutions Submitted",
      "Submissions",
      "Total Submissions",
      "Solutions",
      "Submitted Solutions"
    ], "Submissions");
    const rankings = {
      algorithms: extractSection("Algorithms"),
      dataStructures: extractSection("Data Structures"),
    };

    return { Points, ContestRating, ProblemsSolved, Submissions, rankings };
  };

  const url = `https://www.hackerearth.com/@${encodeURIComponent(username)}`;

  // Uncomment for debugging: console.log('[HackerEarth] Profile requires JavaScript rendering, using Playwright...');

  // Use Playwright for dynamic content
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    // Wait longer for client-side widgets to render
    await page.waitForTimeout(3000);
    // Try to wait for likely metric keywords to appear
    await Promise.race([
      page.waitForSelector("text=Points", { timeout: 5000 }).catch(() => {}),
      page.waitForSelector("text=Problems", { timeout: 5000 }).catch(() => {}),
      page.waitForSelector("text=Solved", { timeout: 5000 }).catch(() => {}),
    ]);

    // Look for and click on tabs to load different sections
    try {
      // Try to find Performance or Challenges tab and click it
      const performanceTab = page.locator('text=/Performance|Challenges/i').first();
      if (await performanceTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await performanceTab.click();
        await page.waitForTimeout(2000); // Wait for content to load
      }
    } catch (e) {
      // Uncomment for debugging: console.log('[HackerEarth] Could not find/click Performance tab:', e);
    }

    // Scroll down to ensure Rewards section loads (if it's lazy-loaded)
    try {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(1500); // Wait for any lazy-loaded content
    } catch (e) {
      // Uncomment for debugging: console.log('[HackerEarth] Error scrolling page:', e);
    }

    // Extract challenges with pagination support
    // We need to extract data AFTER EACH page, not after all pagination
    const allChallenges: Array<{ name: string; rank: number | null; ratingChange: string | null }> = [];
    const seenChallenges = new Set<string>();

    try {
      let hasNextPage = true;
      let pageNum = 0;
      const maxPages = 50; // Increased limit to ensure we get all challenges

      while (hasNextPage && pageNum < maxPages) {
        // Extract challenges from current page
        const pageChallenges = await page.evaluate(() => {
          const parseNum = (s?: string | null) => {
            if (!s) return null;
            const m = s.replace(/[\s,]/g, "").match(/[-+]?\d+(?:\.\d+)?/);
            return m ? Number(m[0]) : null;
          };

          const challenges: Array<{ name: string; rank: number | null; ratingChange: string | null }> = [];
          const rows = document.querySelectorAll('table tr, [role="table"] [role="row"]');

          for (const row of Array.from(rows)) {
            const cells = row.querySelectorAll('td, th, [role="cell"]');
            if (cells.length >= 3) {
              const nameCell = cells[0]?.textContent?.trim() || '';
              const rankCell = cells[1]?.textContent?.trim() || '';
              const ratingChangeCell = cells[2]?.textContent?.trim() || '';

              const skipKeywords = ['name', 'challenge', 'rating change', 'algorithms', 'data structure', 'data structures'];
              const nameLower = nameCell.toLowerCase();

              if (nameCell &&
                  !skipKeywords.includes(nameLower) &&
                  nameCell.length > 3 && // Minimum length for valid challenge name
                  (!ratingChangeCell || ratingChangeCell.startsWith('+') || ratingChangeCell.startsWith('-') || ratingChangeCell === '—')) {
                challenges.push({
                  name: nameCell,
                  rank: parseNum(rankCell),
                  ratingChange: ratingChangeCell || null,
                });
              }
            }
          }
          return challenges;
        });

        // Add new challenges to our collection (deduplication)
        for (const challenge of pageChallenges) {
          if (!seenChallenges.has(challenge.name)) {
            seenChallenges.add(challenge.name);
            allChallenges.push(challenge);
          }
        }

        // Uncomment for debugging: console.log(`[HackerEarth] Page ${pageNum + 1}: Found ${pageChallenges.length} challenges (${allChallenges.length} total)`);

        // Try to click next button
        const nextButton = page.locator('button:has-text("›"), a:has-text("›"), button:has-text("Next"), a:has-text("Next")').last();
        if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          const isDisabled = await nextButton.getAttribute('disabled').catch(() => null);
          const ariaDisabled = await nextButton.getAttribute('aria-disabled').catch(() => null);

          if (!isDisabled && ariaDisabled !== 'true') {
            await nextButton.click();
            await page.waitForTimeout(2000); // Wait for new data to load
            pageNum++;
          } else {
            hasNextPage = false;
          }
        } else {
          hasNextPage = false;
        }
      }

      // Uncomment for debugging: console.log(`[HackerEarth] Total challenges extracted: ${allChallenges.length}`);
    } catch (e) {
      // Uncomment for debugging: console.log('[HackerEarth] Error during challenge pagination:', e);
    }
    const parsed = await page.evaluate(() => {
      const parseNum = (s?: string | null) => {
        if (!s) return null as number | null;
        const m = s.replace(/[\s,]/g, "").match(/[-+]?\d+(?:\.\d+)?/);
        return m ? Number(m[0]) : null;
      };

      const getAllElements = () => Array.from(document.querySelectorAll<HTMLElement>('body *'));

      const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

      const findExactLabelNodes = (labels: string[]) => {
        const els = getAllElements();
        const out: HTMLElement[] = [];
        const targets = labels.map(norm);
        for (const el of els) {
          const t = norm(el.innerText || '');
          if (!t) continue;
          if (targets.includes(t)) out.push(el);
        }
        return out;
      };

      const pickFirstNumber = (text: string) => {
        const m = text.match(/([0-9][0-9,\.]*)/);
        return m ? parseNum(m[1]) : null;
      };
      const pickMaxNumber = (text: string) => {
        const matches = Array.from(text.matchAll(/([0-9][0-9,\.]*)/g));
        let best: number | null = null;
        for (const m of matches) {
          const n = parseNum(m[1]);
          if (n !== null && (best === null || n > best)) best = n;
        }
        return best;
      };

      const getNearbyNumber = (labelEl: HTMLElement, strategy: 'first' | 'max'): number | null => {
        // 1) Next sibling value
        const sib = (labelEl.nextElementSibling as HTMLElement | null)?.innerText || '';
        if (sib) {
          const n = strategy === 'max' ? pickMaxNumber(sib) : pickFirstNumber(sib);
          if (n !== null && n < 1000000) return n;
        }
        // 2) Previous sibling (some layouts flip order)
        const prev = (labelEl.previousElementSibling as HTMLElement | null)?.innerText || '';
        if (prev) {
          const n = strategy === 'max' ? pickMaxNumber(prev) : pickFirstNumber(prev);
          if (n !== null && n < 1000000) return n;
        }
        // 3) Parent's direct text (sometimes value is in same element)
        const parentText = (labelEl.parentElement?.innerText || '').replace(/\s+/g, ' ').trim();
        if (parentText) {
          const labelText = norm(labelEl.innerText || '');
          const idx = norm(parentText).indexOf(labelText);
          if (idx !== -1) {
            const after = parentText.substring(idx + labelText.length);
            const n = strategy === 'max' ? pickMaxNumber(after) : pickFirstNumber(after);
            if (n !== null && n < 1000000) return n;
          }
        }
        // 4) Parent small container
        const container = labelEl.closest('section, article, li, div, span');
        if (container && container !== document.body) {
          const chunk = (container.innerText || '').replace(/\s+/g, ' ').trim();
          // Prefer after the label index
          const idx = norm(chunk).indexOf(norm(labelEl.innerText || ''));
          if (idx !== -1) {
            const after = chunk.substring(idx);
            const n = strategy === 'max' ? pickMaxNumber(after) : pickFirstNumber(after);
            if (n !== null && n < 1000000) return n;
          }
          // As last resort, any number in container
          const n2 = strategy === 'max' ? pickMaxNumber(chunk) : pickFirstNumber(chunk);
          if (n2 !== null && n2 < 1000000) return n2;
        }
        return null;
      };

      const findNumberByLabels = (labels: string[], strategy: 'first' | 'max' = 'first'): number | null => {
        // Try exact label nodes first
        const exactNodes = findExactLabelNodes(labels);
        for (const el of exactNodes) {
          const n = getNearbyNumber(el, strategy);
          if (n !== null) return n;
        }
        // Fallback: inclusive text match
        const els = getAllElements();
        for (const raw of labels) {
          const label = raw.toLowerCase();
          for (const el of els) {
            const t = (el.textContent || '').trim();
            if (!t) continue;
            const lower = t.toLowerCase();
            const idx = lower.indexOf(label);
            if (idx !== -1) {
              const n = getNearbyNumber(el, strategy);
              if (n !== null) return n;
            }
          }
        }
        return null;
      };

      const findSection = (keyword: string) => {
        const els = getAllElements();
        const out = { rank: null as number | null, points: null as number | null, performance: null as string | null };
        const debugInfo: any = {
          keyword,
          totalElements: els.length,
          foundMatches: 0,
          sectionTexts: [] as string[],
        };

        // Look for elements whose direct text content matches the keyword closely
        for (const el of els) {
          const elText = (el.innerText || '').trim();
          const normalizedText = norm(elText);

          // Check if this is a heading/label element that contains just the keyword
          if (normalizedText === norm(keyword) || (elText.length < 50 && elText.toLowerCase().includes(keyword.toLowerCase()))) {
            debugInfo.foundMatches++;

            // Try parent element first (most common pattern: heading + stats in same parent)
            let container = el.parentElement;
            let chunk = '';

            if (container) {
              chunk = (container.innerText || '').replace(/\s+/g, ' ').trim();

              // If parent is too large (> 500 chars), it's probably not the right container
              // Look for a smaller, more specific container
              if (chunk.length > 500) {
                // Try to find a sibling container or nearby element
                const siblings = Array.from(container.children || []);
                for (const sib of siblings) {
                  const sibText = ((sib as HTMLElement).innerText || '').trim();
                  if (sibText.length > 20 && sibText.length < 500 &&
                      (sibText.toLowerCase().includes('rank') ||
                       sibText.toLowerCase().includes('points') ||
                       sibText.toLowerCase().includes('performance'))) {
                    chunk = sibText.replace(/\s+/g, ' ').trim();
                    break;
                  }
                }
              }
            }

            if (chunk) {
              debugInfo.sectionTexts.push(chunk.substring(0, 400));

              // Pattern: "Algorithms 22339 180 Top 13%" or "Data Structure 7508 390 Top 5%"
              // Format: [Name] [Rank] [Points] [Performance]
              const compactPattern = new RegExp(`${keyword}[\\s]+([0-9,\\.]+)[\\s]+([0-9,\\.]+)[\\s]+(Top\\s*\\d+%|[A-Za-z][A-Za-z0-9\\s%\\-+]*)`, 'i');
              const compactMatch = chunk.match(compactPattern);

              if (compactMatch) {
                out.rank = parseNum(compactMatch[1]);     // First number is rank (higher value)
                out.points = parseNum(compactMatch[2]);   // Second number is points (lower value)
                out.performance = compactMatch[3].trim().split(/\s+[A-Z]/)[0].trim(); // Take only until next capital word
              } else {
                // Fallback: Look for rank patterns
                const rankPatterns = [
                  /rank[:\s#]*([0-9][0-9,\.]+)/i,
                  /global\s*rank[:\s]*([0-9][0-9,\.]+)/i,
                  /#\s*([0-9][0-9,\.]+)/,
                ];

                for (const pattern of rankPatterns) {
                  const rankM = chunk.match(pattern);
                  if (rankM && rankM[1] && !out.rank) {
                    out.rank = parseNum(rankM[1]);
                    break;
                  }
                }

                // Look for points
                const pointsM = chunk.match(/(?:points?|score)[:\s]*([0-9][0-9,\.]+)/i);
                if (pointsM && pointsM[1]) {
                  out.points = parseNum(pointsM[1]);
                }

                // Look for performance
                const perfM = chunk.match(/performance[:\s]*([a-zA-Z][a-zA-Z\s%\-+]+)/i);
                if (perfM && perfM[1]) {
                  out.performance = perfM[1].trim();
                }
              }

              if (out.rank || out.points || out.performance) break;
            }
          }
        }

        return { ...out, _debug: debugInfo };
      };

      const Points = findNumberByLabels([
        'Total Points',
        'Points',
        'Practice Points',
        'Practice points',
        'Total points',
        'Score',
        'Total Score'
      ], 'max');
      const ContestRating = findNumberByLabels([
        'Contest Rating',
        'Contest rating',
        'Contest Ratings',
        'Contest ratings',
        'Rating',
        'Current Rating'
      ], 'first');
      const ProblemsSolved = findNumberByLabels([
        'Problems Solved',
        'Problems solved',
        'Problem Solved',
        'Problem solved',
        'Solved Problems',
        'Total Solved',
        'Questions Solved',
        'Solved'
      ], 'first');
      const Submissions = findNumberByLabels([
        'Solutions Submitted',
        'Solutions submitted',
        'Submissions',
        'Total Submissions',
        'Solutions',
        'Submitted Solutions'
      ], 'first');
      const algorithmsRaw = findSection('Algorithms');
      const dataStructuresRaw = findSection('Data Structure');

      const rankings = {
        algorithms: {
          rank: algorithmsRaw.rank,
          points: algorithmsRaw.points,
          performance: algorithmsRaw.performance,
        },
        dataStructures: {
          rank: dataStructuresRaw.rank,
          points: dataStructuresRaw.points,
          performance: dataStructuresRaw.performance,
        },
      };

      // Extract Rewards section
      const rewards: Array<{ category: string; level: string }> = [];
      const els = getAllElements();
      let rewardsDebug = {
        found: false,
        searchAttempts: 0,
        patterns: [] as string[]
      };

      // Try multiple approaches to find rewards
      for (const el of els) {
        const text = (el.innerText || '').trim();
        rewardsDebug.searchAttempts++;

        // Look for "Rewards" section or "Level" mentions
        if ((text.toLowerCase().includes('reward') || text.toLowerCase().includes('level')) && text.length < 50) {
          rewardsDebug.found = true;

          // Look in parent/nearby elements
          let container = el.parentElement;
          let attempts = 0;

          while (container && container !== document.body && attempts < 8) {
            const containerText = (container.innerText || '').replace(/\n/g, ' ').trim();
            rewardsDebug.patterns.push(containerText.substring(0, 200));

            // Multiple pattern variations to catch different formats
            // Format: "Global 15,035/25,000 Level 6/7 completed"
            // Format: "Algorithms 600/4,860 Level 3/6 completed"
            // Format: "CPP 383/10 Level 1/1 completed"
            const patterns = [
              // More specific patterns that match after the points value
              /(Global|Algorithms|CPP|Data Structures?|Java|Python|C\+\+|JavaScript)\s+[\d,]+\/[\d,]+\s+Level\s+(\d+\/\d+)\s+completed/gi,
              // Generic pattern with word boundary
              /\b([A-Z][A-Za-z\s]+?)\s+[\d,]+\/[\d,]+\s+Level\s+(\d+\/\d+)\s+completed/g,
              /([A-Za-z\s]+?)\s*:\s*Level\s+(\d+\/\d+)\s+completed/gi,
            ];

            for (const pattern of patterns) {
              const matches = Array.from(containerText.matchAll(pattern));
              if (matches.length > 0) {
                for (const match of matches) {
                  let category = match[1].trim();
                  const level = match[2];

                  // Clean up category name - remove "pts" prefix if present
                  category = category.replace(/^pts\s+/i, '');

                  // Avoid duplicates and filter out invalid categories
                  if (!rewards.some(r => r.category === category) &&
                      category.length > 1 &&
                      category.length < 30 &&
                      !category.toLowerCase().includes('reward') &&
                      !category.toLowerCase().includes('badge')) {
                    rewards.push({ category, level });
                  }
                }
                if (rewards.length > 0) break;
              }
            }

            container = container.parentElement;
            attempts++;
          }

          // Don't break early, keep searching for all rewards
          if (rewards.length >= 4) break;
        }
      }

      // Alternative: Search entire page text for reward patterns
      if (rewards.length < 4) {  // Try to get all rewards including Global
        const bodyText = document.body.innerText;
        const rewardPatterns = [
          // Specific patterns for known categories
          /(Global|Algorithms|CPP|Data Structures?|Java|Python|C\+\+|JavaScript)\s+[\d,]+\/[\d,]+\s+Level\s+(\d+\/\d+)\s+completed/gi,
          // Generic pattern
          /\b([A-Z][A-Za-z\s]+?)\s+[\d,]+\/[\d,]+\s+Level\s+(\d+\/\d+)\s+completed/g,
          /([A-Za-z\s]+?)\s*:\s*Level\s+(\d+\/\d+)\s+completed/gi,
        ];

        for (const rewardPattern of rewardPatterns) {
          const matches = Array.from(bodyText.matchAll(rewardPattern));
          for (const match of matches) {
            let category = match[1].trim();
            const level = match[2];

            // Clean up category name - remove "pts" prefix if present
            category = category.replace(/^pts\s+/i, '');

            if (!rewards.some(r => r.category === category) &&
                category.length > 1 &&
                category.length < 30 &&
                !category.toLowerCase().includes('badge')) {
              rewards.push({ category, level });
            }
          }
          if (rewards.length > 0) break;
        }
      }

      return {
        Points,
        ContestRating,
        ProblemsSolved,
        Submissions,
        rankings,
        rewards,
        _debugRankings: {
          algorithms: (algorithmsRaw as any)._debug,
          dataStructures: (dataStructuresRaw as any)._debug,
        },
        _debugRewards: rewardsDebug
      };
    });

    // Debug logging (uncomment for troubleshooting)
    // console.log('[HackerEarth Debug] Playwright Parse Results:', {
    //   Points: parsed.Points,
    //   ContestRating: parsed.ContestRating,
    //   ProblemsSolved: parsed.ProblemsSolved,
    //   Submissions: parsed.Submissions
    // });
    // console.log('[HackerEarth Debug] Rankings debug info:', parsed._debugRankings);
    // console.log('[HackerEarth Debug] Challenges:', {
    //   count: allChallenges.length,
    //   samples: allChallenges.slice(0, 5)
    // });
    // console.log('[HackerEarth Debug] Rewards:', {
    //   count: parsed.rewards?.length || 0,
    //   items: parsed.rewards,
    //   debug: (parsed as any)._debugRewards
    // });

    return {
      Points: parsed.Points ?? 0,
      ContestRating: parsed.ContestRating ?? null,
      ProblemsSolved: parsed.ProblemsSolved ?? 0,
      Submissions: parsed.Submissions ?? null,
      rankings: parsed.rankings,
      challenges: allChallenges,
      rewards: parsed.rewards || [],
    };
  } catch {
    return null;
  } finally {
    if (browser) await browser.close();
  }
};
