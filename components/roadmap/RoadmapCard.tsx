"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, TrendingUp } from "lucide-react";
import { Roadmap } from "@/data/roadmaps";
import Link from "next/link";

interface RoadmapCardProps {
  roadmap: Roadmap;
  progress?: {
    completionPercentage: number;
    completedTopics: number;
    totalTopics: number;
    currentLevel: string;
  };
}

export default function RoadmapCard({ roadmap, progress }: RoadmapCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dsa-fundamentals':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'interview-prep':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'competitive-programming':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCurrentLevelName = () => {
    if (!progress) return null;
    const level = roadmap.levels.find(l => l.id === progress.currentLevel);
    return level?.title;
  };

  return (
    <Link href={`/roadmap/${roadmap.id}`}>
      <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-blue-300 dark:hover:border-blue-600 group">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                {roadmap.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {roadmap.description}
              </p>
            </div>
            <Badge className={getCategoryColor(roadmap.category)}>
              {roadmap.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>

          {/* Progress Section */}
          {progress ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">
                  {progress.completedTopics}/{progress.totalTopics} topics
                </span>
              </div>
              <Progress value={progress.completionPercentage} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{progress.completionPercentage}% complete</span>
                {getCurrentLevelName() && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Current: {getCurrentLevelName()}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">Click to start your journey</p>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {roadmap.totalEstimatedWeeks} weeks
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {roadmap.levels.length} levels
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
