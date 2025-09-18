// Utility functions for fetching questions from the API

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Fetch all topics with questions from the API
 */
export async function fetchAllTopics(): Promise<ApiResponse<any[]>> {
    try {
        const response = await fetch('/api/questions');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch topics');
        }

        return data;
    } catch (error: any) {
        console.error('Error fetching topics:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch topics'
        };
    }
}

/**
 * Fetch a specific topic by ID
 */
export async function fetchTopicById(topicId: number): Promise<ApiResponse<any>> {
    try {
        const response = await fetch(`/api/questions?topicId=${topicId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch topic');
        }

        return data;
    } catch (error: any) {
        console.error('Error fetching topic:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch topic'
        };
    }
}

/**
 * Fetch questions filtered by difficulty
 */
export async function fetchQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<ApiResponse<any[]>> {
    try {
        const response = await fetch(`/api/questions?difficulty=${difficulty}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch questions');
        }

        return data;
    } catch (error: any) {
        console.error('Error fetching questions by difficulty:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch questions'
        };
    }
}

/**
 * Fetch questions filtered by company
 */
export async function fetchQuestionsByCompany(company: string): Promise<ApiResponse<any[]>> {
    try {
        const response = await fetch(`/api/questions?company=${encodeURIComponent(company)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch questions');
        }

        return data;
    } catch (error: any) {
        console.error('Error fetching questions by company:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch questions'
        };
    }
}

/**
 * Create or update a topic with questions
 */
export async function saveTopicData(topicData: any): Promise<ApiResponse<any>> {
    try {
        const response = await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topicData }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to save topic');
        }

        return data;
    } catch (error: any) {
        console.error('Error saving topic:', error);
        return {
            success: false,
            error: error.message || 'Failed to save topic'
        };
    }
}