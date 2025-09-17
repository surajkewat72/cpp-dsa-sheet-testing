import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../db/config";
import { Topic } from "../../../models/Question.model";

export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        await connect();
        console.log("Connected to MongoDB successfully");

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const topicId = searchParams.get('topicId');
        const difficulty = searchParams.get('difficulty');
        const company = searchParams.get('company');

        let query: any = {};

        // If topicId is provided, filter by specific topic
        if (topicId) {
            query.id = parseInt(topicId);
        }

        console.log("Query:", query);

        // Check what collection Mongoose is using
        console.log("Collection name:", Topic.collection.name);

        // Try to count documents first
        const count = await Topic.countDocuments({});
        console.log("Total documents in collection:", count);

        // Try finding without any query first
        let allTopics = await Topic.find({}).lean() as any;
        console.log("All topics found:", allTopics.length);

        // If no results with 'id' field, try finding all documents to see structure
        if (allTopics.length === 0) {
            console.log("No topics found with current schema, checking raw collection...");
            const rawTopics = await Topic.collection.find({}).toArray();
            console.log("Raw documents in collection:", rawTopics.length);
            if (rawTopics.length > 0) {
                console.log("First raw document:", JSON.stringify(rawTopics[0], null, 2));
            }
        }

        // Fetch topics with questions based on query
        let topics = await Topic.find(query).lean() as any;
        console.log("Topics found with query:", topics.length);
        if (topics.length > 0) {
            console.log("First topic:", JSON.stringify(topics[0], null, 2));
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

        // If fetching a specific topic, return just that topic
        if (topicId && topics.length > 0) {
            return NextResponse.json({
                success: true,
                data: topics[0]
            });
        }

        // Return all topics
        return NextResponse.json({
            success: true,
            data: topics
        });

    } catch (error: any) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch questions",
                message: error.message
            },
            { status: 500 }
        );
    }
}

