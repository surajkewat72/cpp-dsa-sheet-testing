import { NextRequest, NextResponse } from 'next/server';
import { getRoadmapById } from '@/data/roadmaps';

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const roadmap = getRoadmapById(params.roadmapId);
    
    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: 'Roadmap not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch roadmap' },
      { status: 500 }
    );
  }
}
