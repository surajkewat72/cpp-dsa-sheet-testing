"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  Lock, 
  ExternalLink,
  FileText,
  Video,
  Code 
} from "lucide-react";
import { Topic } from "@/data/roadmaps";
import Link from "next/link";

interface TopicCardProps {
  topic: Topic;
  status: 'not-started' | 'in-progress' | 'completed' | 'locked';
  onStatusChange: (topicId: string, status: 'in-progress' | 'completed') => void;
  timeSpent?: number;
}

export default function TopicCard({ topic, status, onStatusChange, timeSpent = 0 }: TopicCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'locked':
        return 'border-border bg-muted';
      default:
        return 'border-border hover:border-blue-200 dark:hover:border-blue-600';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'practice':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleStart = () => {
    if (status === 'not-started') {
      onStatusChange(topic.id, 'in-progress');
    }
  };

  const handleComplete = () => {
    if (status === 'in-progress') {
      onStatusChange(topic.id, 'completed');
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${getStatusColor()} ${
      status === 'locked' ? 'opacity-60' : ''
    }`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {getStatusIcon()}
            <div className="space-y-1">
              <h4 className="font-medium text-foreground">{topic.title}</h4>
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            </div>
          </div>
          
          {status !== 'locked' && (
            <div className="flex items-center gap-2">
              {status === 'not-started' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStart}
                  className="text-xs"
                >
                  Start
                </Button>
              )}
              {status === 'in-progress' && (
                <Button
                  size="sm"
                  onClick={handleComplete}
                  className="text-xs bg-green-600 hover:bg-green-700"
                >
                  Complete
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {topic.estimatedHours}h estimated
          </div>
          {timeSpent > 0 && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {Math.round(timeSpent / 60)}h spent
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {topic.prerequisites && topic.prerequisites.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">Prerequisites:</p>
            <div className="flex flex-wrap gap-1">
              {topic.prerequisites.map((prereq) => (
                <Badge key={prereq} variant="outline" className="text-xs">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {topic.resources && topic.resources.length > 0 && status !== 'locked' && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Resources:</p>
            <div className="space-y-1">
              {topic.resources.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.url}
                  className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {getResourceIcon(resource.type)}
                  {resource.title}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Questions */}
        {topic.relatedQuestions && topic.relatedQuestions.length > 0 && status !== 'locked' && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Practice Questions:</p>
            <Link
              href={`/sheet?filter=${topic.relatedQuestions.join(',')}`}
              className="flex items-center gap-2 text-xs text-green-600 hover:text-green-800 hover:underline"
            >
              <Code className="h-3 w-3" />
              {topic.relatedQuestions.length} related problems
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
