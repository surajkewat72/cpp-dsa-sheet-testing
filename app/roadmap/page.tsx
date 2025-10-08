"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import RoadmapCard from "@/components/roadmap/RoadmapCard";
import { Roadmap } from "@/data/roadmaps";
import { MapPin, Target, Book, Code } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface User {
  _id: string;
  full_name: string;
  email: string;
  avatar: string;
}

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [userProgress, setUserProgress] = useState<any>({});
  const [loading, setLoading] = useState(true);
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
    if (authChecked) {
      fetchRoadmaps();
    }
  }, [authChecked]);

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch('/api/roadmaps');
      const data = await response.json();
      
      if (data.success) {
        setRoadmaps(data.roadmaps);
        // TODO: Fetch user progress for each roadmap if user is authenticated
        if (user) {
          // Fetch progress for each roadmap
          // This can be implemented later
        }
      }
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !authChecked) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white dark:bg-background text-gray-900 dark:text-white px-4 md:px-12 py-24 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-background text-gray-900 px-4 md:px-12 py-24 dark:text-white transition-colors duration-300">
        

        <div className="max-w-6xl mx-auto px-4 md:px-12  space-y-12">
        {/* Roadmaps Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Choose Your Path</h2>
            <p className="text-muted-foreground">
              Select a roadmap that matches your goals and current skill level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                progress={userProgress[roadmap.id]}
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold text-center text-foreground">
            Why Follow Our Roadmaps?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Structured Learning</h3>
              <p className="text-muted-foreground text-sm">
                Follow a logical progression from basics to advanced concepts
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Book className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Curated Resources</h3>
              <p className="text-muted-foreground text-sm">
                Hand-picked articles, videos, and tutorials for each topic
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Code className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Practice Integration</h3>
              <p className="text-muted-foreground text-sm">
                Direct links to relevant practice problems for each topic
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Choose a roadmap above and begin your structured learning path. 
              Track your progress, unlock achievements, and master DSA step by step.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sheet">
                <Button variant="outline">
                  Browse Practice Problems
                </Button>
              </Link>
              <Link href="/theory-cheatsheets">
                <Button variant="outline">
                  View Theory Guides
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        </div>
      </div>
    </>
  );
}
