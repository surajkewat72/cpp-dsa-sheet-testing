import { NextRequest, NextResponse } from 'next/server';
import { allRoadmaps } from '@/data/roadmaps';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      roadmaps: allRoadmaps
    });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch roadmaps' },
      { status: 500 }
    );
  }
}
