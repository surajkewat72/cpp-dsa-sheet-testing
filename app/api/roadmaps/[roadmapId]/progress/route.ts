import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/db/config';
import { RoadmapProgress, RoadmapUserStats } from '@/models/RoadmapProgress.model';
import { getRoadmapById } from '@/data/roadmaps';
import jwt from 'jsonwebtoken';

// Helper function to get user ID from token
async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET: Fetch user's progress for a roadmap
export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    await connect();
    
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const roadmap = getRoadmapById(params.roadmapId);
    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Roadmap not found' },
        { status: 404 }
      );
    }

    // Get user's progress for all topics in this roadmap
    const progress = await RoadmapProgress.find({
      userId,
      roadmapId: params.roadmapId
    }).sort({ createdAt: 1 });

    // Get or create user stats
    let userStats = await RoadmapUserStats.findOne({
      userId,
      roadmapId: params.roadmapId
    });

    if (!userStats) {
      // Calculate total topics
      const totalTopics = roadmap.levels.reduce((sum, level) => sum + level.topics.length, 0);
      
      userStats = new RoadmapUserStats({
        userId,
        roadmapId: params.roadmapId,
        totalTopics,
        currentLevel: roadmap.levels[0].id,
        completedTopics: 0,
        inProgressTopics: 0,
        totalTimeSpent: 0,
        completionPercentage: 0,
        streak: 0
      });
      await userStats.save();
    }

    return NextResponse.json({
      success: true,
      progress,
      stats: userStats,
      roadmap
    });
  } catch (error) {
    console.error('Error fetching roadmap progress:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST: Update progress for a specific topic
export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    await connect();
    
    const userId = await getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { topicId, levelId, status, timeSpent, notes } = body;

    if (!topicId || !levelId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update or create topic progress
    const progressUpdate: any = {
      status,
      timeSpent: timeSpent || 0,
      notes: notes || ''
    };

    if (status === 'in-progress' && !await RoadmapProgress.exists({ userId, roadmapId: params.roadmapId, topicId })) {
      progressUpdate.startedAt = new Date();
    }

    if (status === 'completed') {
      progressUpdate.completedAt = new Date();
    }

    const progress = await RoadmapProgress.findOneAndUpdate(
      {
        userId,
        roadmapId: params.roadmapId,
        topicId
      },
      {
        ...progressUpdate,
        levelId
      },
      {
        upsert: true,
        new: true
      }
    );

    // Update user stats
    await updateUserStats(userId, params.roadmapId);

    return NextResponse.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Error updating roadmap progress:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

// Helper function to update user statistics
async function updateUserStats(userId: string, roadmapId: string) {
  const allProgress = await RoadmapProgress.find({ userId, roadmapId });
  
  const completedTopics = allProgress.filter(p => p.status === 'completed').length;
  const inProgressTopics = allProgress.filter(p => p.status === 'in-progress').length;
  const totalTimeSpent = allProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  
  const roadmap = getRoadmapById(roadmapId);
  const totalTopics = roadmap ? roadmap.levels.reduce((sum, level) => sum + level.topics.length, 0) : 1;
  
  const completionPercentage = Math.round((completedTopics / totalTopics) * 100);

  // Determine current level and topic
  let currentLevel = roadmap?.levels[0].id || '';
  let currentTopic = undefined;

  if (roadmap) {
    for (const level of roadmap.levels) {
      const levelProgress = allProgress.filter(p => p.levelId === level.id);
      const levelCompleted = levelProgress.filter(p => p.status === 'completed').length;
      
      if (levelCompleted < level.topics.length) {
        currentLevel = level.id;
        // Find next incomplete topic
        const incompleteTopic = level.topics.find(topic => 
          !levelProgress.some(p => p.topicId === topic.id && p.status === 'completed')
        );
        currentTopic = incompleteTopic?.id;
        break;
      }
    }
  }

  await RoadmapUserStats.findOneAndUpdate(
    { userId, roadmapId },
    {
      completedTopics,
      inProgressTopics,
      totalTimeSpent,
      completionPercentage,
      currentLevel,
      currentTopic,
      lastActivityDate: new Date()
    },
    { upsert: true }
  );
}
