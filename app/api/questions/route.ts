import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../db/config";
import { Topic } from "../../../models/Question.model";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from "../../../models/User.model";

export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        await connect();
        console.log("Connected to MongoDB successfully");
        console.log('Mongoose connection readyState:', mongoose.connection.readyState);

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
        if (error && error.stack) console.error(error.stack);
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

// Helper: verify session cookie and ensure requester is admin
async function getSessionUserId(req: NextRequest) {
    const token = req.cookies.get("session")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        return decoded?.id || null;
    } catch (e) {
        return null;
    }
}

function validateQuestion(q: any) {
    if (!q) return "Question object is required";
    if (typeof q.id !== 'number') return "question.id must be a number";
    if (typeof q.title !== 'string' || q.title.trim() === '') return "question.title must be a non-empty string";
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) return "question.difficulty must be one of: easy, medium, hard";
    if (q.links && typeof q.links !== 'object') return "question.links must be an object";
    if (q.companies && !Array.isArray(q.companies)) return "question.companies must be an array of strings";
    return null;
}

export async function POST(request: NextRequest) {
    try {
        await connect();

        // Admin check: require a logged-in user and ADMIN_EMAIL to match
        const userId = await getSessionUserId(request);
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId).lean() as any;
        if (!user) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();

        // Support adding either a full topic or a question to an existing topic
        // If body.topic is present, expect { id, name, questions }
        if (body.topic) {
            const t = body.topic;
            if (typeof t.id !== 'number' || typeof t.name !== 'string' || !Array.isArray(t.questions)) {
                return NextResponse.json({ success: false, error: 'Invalid topic payload' }, { status: 400 });
            }

            // Validate each question
            for (const q of t.questions) {
                const err = validateQuestion(q);
                if (err) return NextResponse.json({ success: false, error: err }, { status: 400 });
            }

            // Upsert topic by id
            const updated = await Topic.findOneAndUpdate({ id: t.id }, { $set: { name: t.name, questions: t.questions } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
            return NextResponse.json({ success: true, data: updated }, { status: 200 });
        }

        // If body.question + topicId provided, add question to existing topic
        if (body.question && typeof body.topicId === 'number') {
            const q = body.question;
            const err = validateQuestion(q);
            if (err) return NextResponse.json({ success: false, error: err }, { status: 400 });

            const topic = await Topic.findOne({ id: body.topicId });
            if (!topic) return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });

            // prevent duplicate question id
            if (topic.questions.some((qq: any) => qq.id === q.id)) {
                return NextResponse.json({ success: false, error: 'Question with this id already exists in topic' }, { status: 409 });
            }

            topic.questions.push(q);
            await topic.save();
            return NextResponse.json({ success: true, data: topic }, { status: 201 });
        }

        return NextResponse.json({ success: false, error: 'Invalid payload. Provide either { topic } or { topicId, question }' }, { status: 400 });

    } catch (error: any) {
        console.error('Error in POST /api/questions', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}

