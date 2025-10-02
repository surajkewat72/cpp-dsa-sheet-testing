import mongoose, { Schema, Document } from 'mongoose';

export interface IRoadmapProgress extends Document {
  userId: string;
  roadmapId: string;
  levelId: string;
  topicId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  timeSpent?: number; // in minutes
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoadmapUserStats extends Document {
  userId: string;
  roadmapId: string;
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  totalTimeSpent: number; // in minutes
  currentLevel: string;
  currentTopic?: string;
  completionPercentage: number;
  streak: number; // consecutive days of activity
  lastActivityDate: Date;
  startedAt: Date;
  estimatedCompletionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapProgressSchema = new Schema<IRoadmapProgress>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  roadmapId: {
    type: String,
    required: true,
    index: true
  },
  levelId: {
    type: String,
    required: true
  },
  topicId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'skipped'],
    default: 'not-started'
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

const RoadmapUserStatsSchema = new Schema<IRoadmapUserStats>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  roadmapId: {
    type: String,
    required: true,
    index: true
  },
  totalTopics: {
    type: Number,
    required: true
  },
  completedTopics: {
    type: Number,
    default: 0
  },
  inProgressTopics: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  currentLevel: {
    type: String,
    required: true
  },
  currentTopic: {
    type: String
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  estimatedCompletionDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
RoadmapProgressSchema.index({ userId: 1, roadmapId: 1 });
RoadmapProgressSchema.index({ userId: 1, roadmapId: 1, topicId: 1 }, { unique: true });
RoadmapUserStatsSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

export const RoadmapProgress = mongoose.models.RoadmapProgress || 
  mongoose.model<IRoadmapProgress>('RoadmapProgress', RoadmapProgressSchema);

export const RoadmapUserStats = mongoose.models.RoadmapUserStats || 
  mongoose.model<IRoadmapUserStats>('RoadmapUserStats', RoadmapUserStatsSchema);
