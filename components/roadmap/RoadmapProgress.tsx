"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Flame
} from "lucide-react";

interface RoadmapProgressProps {
  stats: {
    totalTopics: number;
    completedTopics: number;
    inProgressTopics: number;
    totalTimeSpent: number;
    completionPercentage: number;
    streak: number;
    currentLevel: string;
    estimatedCompletionDate?: string;
  };
  roadmapTitle: string;
  levels: Array<{
    id: string;
    title: string;
    difficulty: string;
    topics: any[];
  }>;
}

export default function RoadmapProgress({ stats, roadmapTitle, levels }: RoadmapProgressProps) {
  const getCurrentLevelInfo = () => {
    return levels.find(level => level.id === stats.currentLevel);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const currentLevel = getCurrentLevelInfo();

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {roadmapTitle} Progress
            </h2>
            <Badge variant="outline" className="text-sm">
              {stats.completionPercentage}% Complete
            </Badge>
          </div>

          <Progress value={stats.completionPercentage} className="h-3" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Target className="h-4 w-4" />
                Completed
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedTopics}
              </div>
              <div className="text-xs text-muted-foreground">
                of {stats.totalTopics} topics
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                In Progress
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.inProgressTopics}
              </div>
              <div className="text-xs text-muted-foreground">topics</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Time Spent
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(stats.totalTimeSpent)}
              </div>
              <div className="text-xs text-muted-foreground">total</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Flame className="h-4 w-4" />
                Streak
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.streak}
              </div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Level Card */}
      {currentLevel && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Current Level
              </h3>
              <Badge 
                variant="outline" 
                className={`
                  ${currentLevel.difficulty === 'Beginner' ? 'border-green-200 text-green-700' : ''}
                  ${currentLevel.difficulty === 'Intermediate' ? 'border-yellow-200 text-yellow-700' : ''}
                  ${currentLevel.difficulty === 'Advanced' ? 'border-red-200 text-red-700' : ''}
                `}
              >
                {currentLevel.difficulty}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-foreground">{currentLevel.title}</h4>
              <p className="text-sm text-muted-foreground">
                {currentLevel.topics.length} topics in this level
              </p>
            </div>

            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Level Progress</span>
                <span className="text-foreground">
                  {/* Calculate level-specific progress */}
                  {Math.round((stats.completedTopics / currentLevel.topics.length) * 100)}%
                </span>
              </div>
              <Progress 
                value={(stats.completedTopics / currentLevel.topics.length) * 100} 
                className="h-2" 
              />
            </div>
          </div>
        </Card>
      )}

      {/* Achievements Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </h3>

          <div className="space-y-3">
            {stats.completedTopics >= 5 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <div>
                  <div className="font-medium text-yellow-800">Getting Started</div>
                  <div className="text-sm text-yellow-600">Completed 5 topics</div>
                </div>
              </div>
            )}

            {stats.streak >= 7 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600" />
                <div>
                  <div className="font-medium text-orange-800">Week Warrior</div>
                  <div className="text-sm text-orange-600">7-day learning streak</div>
                </div>
              </div>
            )}

            {stats.completionPercentage >= 50 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-800">Halfway Hero</div>
                  <div className="text-sm text-blue-600">50% roadmap completion</div>
                </div>
              </div>
            )}

            {(stats.completedTopics === 0 && stats.inProgressTopics === 0) && (
              <div className="text-center py-4">
                <div className="text-muted-foreground text-sm">
                  Start learning to unlock achievements! 🎯
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Estimated Completion */}
      {stats.estimatedCompletionDate && (
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-foreground">Estimated Completion</div>
              <div className="text-sm text-muted-foreground">
                {new Date(stats.estimatedCompletionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
