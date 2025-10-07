// app/api/generate-quiz/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Make sure your GOOGLE_API_KEY is in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);



export async function GET() {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
     



    const prompt = `
      Generate 5 unique, beginner-level quiz questions about data structures and algorithms.
      The topics should be similar to binary search, stacks, queues, sorting algorithms, and basic graph traversal.
      Respond ONLY with a valid JSON array. Do not include markdown formatting like \`\`\`json or any other text outside the JSON array.
      Each object in the array must have this exact structure:
      {
        "question": "The question text.",
        "options": ["An array of 4 string options."],
        "answer": "A string that exactly matches one of the 4 options."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Sometimes the model might still wrap the output in markdown, so we clean it.
    const cleanedText = text.replace(/^```json\s*|```\s*$/g, '').trim();

    const questions = JSON.parse(cleanedText);
    // sanity check
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid or empty quiz array");
    }
    return NextResponse.json(questions, { status: 200 });

  } catch (error) {
    console.error("Error generating quiz questions:", error);
   
    // Fallback static questions (so the quiz still works)
    // const fallback = [
    //   {
    //     question: "What is the time complexity of binary search?",
    //     options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    //     answer: "O(log n)",
    //   },
    //   {
    //     question: "Which data structure uses FIFO order?",
    //     options: ["Stack", "Queue", "Tree", "Graph"],
    //     answer: "Queue",
    //   },
    //   {
    //     question: "Which algorithm is not a sorting algorithm?",
    //     options: ["Merge Sort", "Quick Sort", "Dijkstra’s", "Bubble Sort"],
    //     answer: "Dijkstra’s",
    //   },
    // ];

    // return NextResponse.json(fallback, { status: 200 });
    return NextResponse.json({ error: "Failed to generate quiz questions." }, { status: 500 });
  }
}
