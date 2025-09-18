import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../db/config";
import { Topic } from "../../../models/Question.model";
import { sampleTopics } from "../../../data/questions";
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const topicId = searchParams.get('topicId');
        const difficulty = searchParams.get('difficulty');
        const company = searchParams.get('company');

        let topics: any[] = [];
        let usingFallback = false;

        try {
            // Try to connect to MongoDB
            await connect();
            console.log("Connected to MongoDB successfully");
            
            // Try to fetch from database
            const count = await Topic.countDocuments({});
            console.log("Total documents in collection:", count);

            if (count > 0) {
                let query: any = {};
                if (topicId) {
                    query.id = parseInt(topicId);
                }
                topics = await Topic.find(query).lean() as any;
                console.log("Topics found in database:", topics.length);
            } else {
                console.log("No data in database, using sample data");
                usingFallback = true;
                topics = sampleTopics;
            }
        } catch (dbError: any) {
            console.log("Database error, falling back to sample data:", dbError.message);
            usingFallback = true;
            topics = sampleTopics;
        }

        // Apply filters if provided
        if (difficulty || company) {
            topics = topics.map((topic: any) => ({
                ...topic,
                questions: topic.questions.filter((question: any) => {
                    let matches = true;

                    if (difficulty && question.difficulty !== difficulty) {
                        matches = false;
                    }

                    if (company && (!question.companies || !question.companies.includes(company))) {
                        matches = false;
                    }

                    return matches;
                })
            }));
        }

        // Filter by topicId if provided
        if (topicId) {
            const topicIdNum = parseInt(topicId);
            topics = topics.filter(topic => topic.id === topicIdNum);
            
            if (topics.length > 0) {
                return NextResponse.json({
                    success: true,
                    data: topics[0],
                    usingFallback
                });
            }
        }

        // Return all topics
        return NextResponse.json({
            success: true,
            data: topics,
            usingFallback
        });

    } catch (error: any) {
        console.error("Error fetching questions:", error);
        // Final fallback - return sample data even if everything fails
        return NextResponse.json({
            success: true,
            data: sampleTopics,
            usingFallback: true,
            message: "Using sample data due to database issues"
        });
    }
}

