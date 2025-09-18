// Example usage of the questions API
// You can use these examples in your components

import { fetchAllTopics, fetchTopicById, fetchQuestionsByDifficulty, saveTopicData } from "@/lib/questionsApi";

/**
 * Example: How to use the API in a React component
 */

// 1. Fetch all topics and questions
export async function getAllQuestionsExample() {
    const result = await fetchAllTopics();

    if (result.success && result.data) {
        console.log("All topics:", result.data);
        return result.data;
    } else {
        console.error("Failed to fetch topics:", result.error);
        return [];
    }
}

// 2. Fetch specific topic
export async function getSpecificTopicExample() {
    const result = await fetchTopicById(1); // Basics of Programming

    if (result.success && result.data) {
        console.log("Topic:", result.data);
        return result.data;
    } else {
        console.error("Failed to fetch topic:", result.error);
        return null;
    }
}

// 3. Fetch questions by difficulty
export async function getEasyQuestionsExample() {
    const result = await fetchQuestionsByDifficulty('easy');

    if (result.success && result.data) {
        console.log("Easy questions:", result.data);
        return result.data;
    } else {
        console.error("Failed to fetch easy questions:", result.error);
        return [];
    }
}

// 4. Replace your existing mock data usage
// Instead of importing from data/questions.ts, use:
/*
// OLD WAY:
import { questionsData } from "@/data/questions";

// NEW WAY:
const questionsData = await fetchAllTopics();
if (questionsData.success) {
  // Use questionsData.data
}
*/

// 5. React Hook example
/*
import { useState, useEffect } from 'react';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadQuestions() {
      const result = await fetchAllTopics();
      
      if (result.success) {
        setQuestions(result.data);
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    }

    loadQuestions();
  }, []);

  return { questions, loading, error };
}
*/