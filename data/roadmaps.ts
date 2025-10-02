export interface Topic {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  prerequisites?: string[];
  resources?: {
    type: 'article' | 'video' | 'practice';
    title: string;
    url: string;
  }[];
  relatedQuestions?: string[]; // Question IDs from practice sheet
}

export interface RoadmapLevel {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  topics: Topic[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: 'dsa-fundamentals' | 'interview-prep' | 'competitive-programming';
  totalEstimatedWeeks: number;
  levels: RoadmapLevel[];
}

// DSA Fundamentals Roadmap
export const dsaFundamentalsRoadmap: Roadmap = {
  id: 'dsa-fundamentals',
  title: 'DSA Fundamentals',
  description: 'A comprehensive path from beginner to advanced Data Structures and Algorithms',
  category: 'dsa-fundamentals',
  totalEstimatedWeeks: 16,
  levels: [
    {
      id: 'beginner',
      title: 'Beginner Level',
      description: 'Foundation concepts and basic data structures',
      difficulty: 'Beginner',
      estimatedWeeks: 6,
      topics: [
        {
          id: 'arrays-basics',
          title: 'Arrays & Basic Operations',
          description: 'Learn array fundamentals, traversal, and basic operations',
          estimatedHours: 8,
          resources: [
            {
              type: 'article',
              title: 'Array Basics Guide',
              url: '/theory-cheatsheets#arrays'
            }
          ],
          relatedQuestions: ['1', '2', '3'] // Array questions from practice sheet
        },
        {
          id: 'strings',
          title: 'Strings & String Manipulation',
          description: 'String operations, pattern matching, and string algorithms',
          estimatedHours: 10,
          prerequisites: ['arrays-basics'],
          relatedQuestions: ['15', '16', '17']
        },
        {
          id: 'searching-sorting',
          title: 'Searching & Sorting Basics',
          description: 'Linear search, binary search, bubble sort, selection sort',
          estimatedHours: 12,
          prerequisites: ['arrays-basics'],
          relatedQuestions: ['25', '26', '27']
        },
        {
          id: 'recursion',
          title: 'Recursion Fundamentals',
          description: 'Understanding recursion, base cases, and recursive thinking',
          estimatedHours: 10,
          prerequisites: ['arrays-basics'],
          relatedQuestions: ['35', '36', '37']
        }
      ]
    },
    {
      id: 'intermediate',
      title: 'Intermediate Level',
      description: 'Advanced data structures and algorithmic thinking',
      difficulty: 'Intermediate',
      estimatedWeeks: 6,
      topics: [
        {
          id: 'linked-lists',
          title: 'Linked Lists',
          description: 'Singly, doubly linked lists, and common operations',
          estimatedHours: 12,
          prerequisites: ['recursion'],
          relatedQuestions: ['45', '46', '47']
        },
        {
          id: 'stacks-queues',
          title: 'Stacks & Queues',
          description: 'Stack and queue implementations, applications',
          estimatedHours: 10,
          prerequisites: ['linked-lists'],
          relatedQuestions: ['55', '56', '57']
        },
        {
          id: 'trees-basics',
          title: 'Binary Trees & BST',
          description: 'Tree traversals, binary search trees, tree operations',
          estimatedHours: 15,
          prerequisites: ['recursion', 'stacks-queues'],
          relatedQuestions: ['65', '66', '67']
        },
        {
          id: 'hashing',
          title: 'Hashing & Hash Tables',
          description: 'Hash functions, collision handling, applications',
          estimatedHours: 8,
          prerequisites: ['arrays-basics'],
          relatedQuestions: ['75', '76', '77']
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Level',
      description: 'Complex algorithms and optimization techniques',
      difficulty: 'Advanced',
      estimatedWeeks: 4,
      topics: [
        {
          id: 'graphs',
          title: 'Graph Algorithms',
          description: 'Graph representation, BFS, DFS, shortest paths',
          estimatedHours: 20,
          prerequisites: ['trees-basics', 'stacks-queues'],
          relatedQuestions: ['85', '86', '87']
        },
        {
          id: 'dynamic-programming',
          title: 'Dynamic Programming',
          description: 'DP concepts, memoization, tabulation, optimization',
          estimatedHours: 25,
          prerequisites: ['recursion', 'arrays-basics'],
          relatedQuestions: ['95', '96', '97']
        },
        {
          id: 'advanced-trees',
          title: 'Advanced Tree Structures',
          description: 'Heaps, tries, segment trees, advanced operations',
          estimatedHours: 15,
          prerequisites: ['trees-basics'],
          relatedQuestions: ['105', '106', '107']
        },
        {
          id: 'greedy-algorithms',
          title: 'Greedy Algorithms',
          description: 'Greedy approach, optimization problems',
          estimatedHours: 12,
          prerequisites: ['dynamic-programming'],
          relatedQuestions: ['115', '116', '117']
        }
      ]
    }
  ]
};

// Interview Preparation Roadmap
export const interviewPrepRoadmap: Roadmap = {
  id: 'interview-prep',
  title: 'Interview Preparation',
  description: 'Focused preparation for technical interviews at top companies',
  category: 'interview-prep',
  totalEstimatedWeeks: 12,
  levels: [
    {
      id: 'interview-basics',
      title: 'Interview Fundamentals',
      description: 'Essential patterns and problem-solving techniques',
      difficulty: 'Beginner',
      estimatedWeeks: 4,
      topics: [
        {
          id: 'two-pointers',
          title: 'Two Pointers Technique',
          description: 'Master the two-pointers pattern for array problems',
          estimatedHours: 8,
          relatedQuestions: ['120', '121', '122']
        },
        {
          id: 'sliding-window',
          title: 'Sliding Window',
          description: 'Sliding window technique for substring/subarray problems',
          estimatedHours: 10,
          relatedQuestions: ['125', '126', '127']
        }
      ]
    },
    {
      id: 'interview-intermediate',
      title: 'Core Interview Topics',
      description: 'Most commonly asked interview topics',
      difficulty: 'Intermediate',
      estimatedWeeks: 5,
      topics: [
        {
          id: 'tree-traversals',
          title: 'Tree Interview Problems',
          description: 'Common tree problems in interviews',
          estimatedHours: 15,
          prerequisites: ['trees-basics'],
          relatedQuestions: ['130', '131', '132']
        },
        {
          id: 'graph-interview',
          title: 'Graph Interview Problems',
          description: 'Essential graph algorithms for interviews',
          estimatedHours: 18,
          prerequisites: ['graphs'],
          relatedQuestions: ['135', '136', '137']
        }
      ]
    },
    {
      id: 'interview-advanced',
      title: 'Advanced Interview Prep',
      description: 'Hard problems and system design basics',
      difficulty: 'Advanced',
      estimatedWeeks: 3,
      topics: [
        {
          id: 'hard-problems',
          title: 'Hard Algorithm Problems',
          description: 'Practice with challenging interview questions',
          estimatedHours: 25,
          prerequisites: ['dynamic-programming', 'graphs'],
          relatedQuestions: ['140', '141', '142']
        }
      ]
    }
  ]
};

export const allRoadmaps: Roadmap[] = [
  dsaFundamentalsRoadmap,
  interviewPrepRoadmap
];

export const getRoadmapById = (id: string): Roadmap | undefined => {
  return allRoadmaps.find(roadmap => roadmap.id === id);
};

export const getTopicById = (roadmapId: string, topicId: string): Topic | undefined => {
  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) return undefined;
  
  for (const level of roadmap.levels) {
    const topic = level.topics.find(t => t.id === topicId);
    if (topic) return topic;
  }
  return undefined;
};
