"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Clock, Target, Users } from "lucide-react";
import Link from "next/link";
import RoadmapProgress from "@/components/roadmap/RoadmapProgress";
import TopicCard from "@/components/roadmap/TopicCard";
import { Roadmap, Topic } from "@/data/roadmaps";
import { toast } from "react-hot-toast";
import axios from "axios";

interface TopicProgress {
  topicId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  timeSpent: number;
}

interface User {
  _id: string;
  full_name: string;
  email: string;
  avatar: string;
}

export default function RoadmapDetailPage() {
  const params = useParams<{ roadmapId: string }>();
  const roadmapId = params?.roadmapId ?? "";
  
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [userProgress, setUserProgress] = useState<TopicProgress[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/check-auth");
        if (res.status === 200) {
          setUser(res.data?.user);
        }
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 503) {
          setUser(null);
        } else {
          setUser(null);
        }
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (roadmapId && authChecked) {
      fetchRoadmapData();
    }
  }, [roadmapId, authChecked]);

  const fetchRoadmapData = async () => {
    try {
      // Fetch roadmap details
      const roadmapResponse = await fetch(`/api/roadmaps/${roadmapId}`);
      const roadmapData = await roadmapResponse.json();
      
      if (roadmapData.success) {
        setRoadmap(roadmapData.roadmap);
      }

      // Fetch user progress only if user is authenticated
      if (user) {
        try {
          const progressResponse = await fetch(`/api/roadmaps/${roadmapId}/progress`);
          const progressData = await progressResponse.json();
          
          if (progressData.success) {
            setUserProgress(progressData.progress || []);
            setUserStats(progressData.stats);
          }
        } catch (progressError) {
          console.log('No user progress available');
        }
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const updateTopicProgress = async (topicId: string, status: 'in-progress' | 'completed') => {
    try {
      const topic = getTopicById(topicId);
      if (!topic) return;

      const response = await fetch(`/api/roadmaps/${roadmapId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId,
          levelId: getLevelIdByTopicId(topicId),
          status,
          timeSpent: 0 // You can implement time tracking later
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setUserProgress(prev => {
          const existing = prev.find(p => p.topicId === topicId);
          if (existing) {
            return prev.map(p => 
              p.topicId === topicId 
                ? { ...p, status }
                : p
            );
          } else {
            return [...prev, { topicId, status, timeSpent: 0 }];
          }
        });
        
        toast.success(`Topic marked as ${status}`);
        // Refresh stats
        fetchRoadmapData();
      } else {
        toast.error(data.message || 'Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Please sign in to track progress');
    }
  };

  const getTopicById = (topicId: string): Topic | undefined => {
    if (!roadmap) return undefined;
    
    for (const level of roadmap.levels) {
      const topic = level.topics.find(t => t.id === topicId);
      if (topic) return topic;
    }
    return undefined;
  };

  const getLevelIdByTopicId = (topicId: string): string => {
    if (!roadmap) return '';
    
    for (const level of roadmap.levels) {
      if (level.topics.some(t => t.id === topicId)) {
        return level.id;
      }
    }
    return '';
  };

  const getTopicStatus = (topicId: string): 'not-started' | 'in-progress' | 'completed' | 'locked' => {
    const progress = userProgress.find(p => p.topicId === topicId);
    if (progress) return progress.status;

    // Check if topic is locked (prerequisites not met)
    const topic = getTopicById(topicId);
    if (topic?.prerequisites) {
      const prerequisitesMet = topic.prerequisites.every(prereqId => {
        const prereqProgress = userProgress.find(p => p.topicId === prereqId);
        return prereqProgress?.status === 'completed';
      });
      
      if (!prerequisitesMet) return 'locked';
    }

    return 'not-started';
  };

  if (loading || !authChecked) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white dark:bg-background text-gray-900 dark:text-white px-4 md:px-12 py-24 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!roadmap) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white dark:bg-background text-gray-900 dark:text-white px-4 md:px-12 py-24 transition-colors duration-300 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Roadmap Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The roadmap you're looking for doesn't exist.
            </p>
            <Link href="/roadmap">
              <Button>Browse All Roadmaps</Button>
            </Link>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-background text-gray-900 dark:text-white transition-colors duration-300">
        {/* Header */}
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 md:px-12 py-4">
            <div className="flex items-center gap-4">
              <Link href="/roadmap">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Roadmaps
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{roadmap.title}</h1>
                <p className="text-muted-foreground">{roadmap.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {roadmap.totalEstimatedWeeks} weeks
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  {roadmap.levels.reduce((sum, level) => sum + level.topics.length, 0)} topics
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About This Roadmap</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{roadmap.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {roadmap.levels.length}
                        </div>
                        <div className="text-sm text-blue-700">Levels</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {roadmap.levels.reduce((sum, level) => sum + level.topics.length, 0)}
                        </div>
                        <div className="text-sm text-green-700">Topics</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {roadmap.totalEstimatedWeeks}
                        </div>
                        <div className="text-sm text-purple-700">Weeks</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Levels Overview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Learning Path</h3>
                  {roadmap.levels.map((level, index) => (
                    <Card key={level.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">{level.title}</h4>
                            <Badge variant="outline">{level.difficulty}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{level.topics.length} topics</span>
                            <span>{level.estimatedWeeks} weeks</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-8">
                {roadmap.levels.map((level, levelIndex) => (
                  <div key={level.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {levelIndex + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{level.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{level.difficulty}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {level.topics.length} topics • {level.estimatedWeeks} weeks
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {level.topics.map((topic) => (
                        <TopicCard
                          key={topic.id}
                          topic={topic}
                          status={getTopicStatus(topic.id)}
                          onStatusChange={updateTopicProgress}
                          timeSpent={userProgress.find(p => p.topicId === topic.id)?.timeSpent || 0}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {user && userStats && (
              <RoadmapProgress
                stats={userStats}
                roadmapTitle={roadmap.title}
                levels={roadmap.levels}
              />
            )}

            {!user && (
              <Card className="p-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Track Your Progress
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to track your learning progress and unlock achievements
                </p>
                <Link href="/sign-in">
                  <Button size="sm">Sign In</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
