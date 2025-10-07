
import { NextResponse } from "next/server";
import { connect } from "@/db/config";
import { Progress } from "@/models/Progress.model";
import { Badge } from "@/models/Badge.model";
import { awardBadges } from "@/lib/awardBadges";

interface TopicProgress {
  topicName: string;
  solvedCount: number;
  totalQuestions?: number;
}


export async function POST(req: Request) {
  try {
    await connect();
    const { userId, questionDifficulty, questionId, isSolved, topicName, topicCompleted,isMarkedForRevision } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ message: "UserId required" }, { status: 400 });
    }

    // --- Fetch or create progress ---
    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId });

    // --- Streak Update ---
    const today = new Date();
    if (progress.lastVisited) {
      const diff = Math.floor((today.getTime() - progress.lastVisited.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) progress.streakCount += 1;
      else if (diff > 1) progress.streakCount = 1;
    } else progress.streakCount = 1;
    progress.lastVisited = today;

//  markedforrevision
// if(isMarkedForRevision){
//   progress.markedForRevision+=1
// }
// else{
//   progress.markedForRevision=Math.max(0,progress.markedForRevision-1)
// }

    // --- Difficulty Counters ---
    if (questionDifficulty) {
      const prevSolved = await Progress.exists({ userId, [`questions.${questionId}`]: true });
      if (isSolved && !prevSolved) {
        if (questionDifficulty === "easy") progress.easySolved += 1;
        if (questionDifficulty === "medium") progress.mediumSolved += 1;
        if (questionDifficulty === "hard") progress.hardSolved += 1;
      } else if (!isSolved && !prevSolved) {
        if (questionDifficulty === "easy") progress.easySolved = Math.max(0, progress.easySolved - 1);
        if (questionDifficulty === "medium") progress.mediumSolved = Math.max(0, progress.mediumSolved - 1);
        if (questionDifficulty === "hard") progress.hardSolved = Math.max(0, progress.hardSolved - 1);
      }
    }

    progress.totalSolved =
      Number(progress.easySolved ?? 0) +
      Number(progress.mediumSolved ?? 0) +
      Number(progress.hardSolved ?? 0);

      
    // // --- Topic-wise Progress ---
    if (topicName) {
      const topicIndex = progress.topicsProgress.findIndex((t: TopicProgress) => t.topicName === topicName);

      // if (topicIndex > -1) {
      //   if (isSolved) {
      //     progress.topicsProgress[topicIndex].solvedCount += 1;
      //   } else {
      //     progress.topicsProgress[topicIndex].solvedCount = Math.max(
      //       0,
      //       progress.topicsProgress[topicIndex].solvedCount - 1
      //     );
      //   }
      // }
      if (topicIndex===-1){
        progress.topicsProgress.push({
          topicName, solvedCount: 1, totalQuestions: 5,
          revisionCount: 0,
        });
      }
      const id=progress.topicsProgress.findIndex((t: TopicProgress) => t.topicName === topicName);
      const topic=progress.topicsProgress[id];
      if(typeof isSolved==="boolean"){
        if(isSolved){
          topic.solvedCount = (topic.solvedCount || 0) + 1;
        } else {
          topic.solvedCount = Math.max(0, (topic.solvedCount || 0) - 1);
        }
      }
      if(typeof isMarkedForRevision==="boolean"){
        const prevTopicRevision = topic.revisionCount || 0;
        if(isMarkedForRevision){
          topic.revisionCount = prevTopicRevision + 1;
          progress.markedForRevision = (progress.markedForRevision || 0) + 1;
        } else {
          topic.revisionCount = Math.max(0, prevTopicRevision - 1);
          progress.markedForRevision = Math.max(0, (progress.markedForRevision || 0) - 1);
        }
      }
    }

    // --- Topic Completion ---
    if (!progress.topicsCompleted) progress.topicsCompleted = [];

    // Manual completion from frontend
    if (topicCompleted && !progress.topicsCompleted.includes(topicCompleted)) {
      progress.topicsCompleted.push(topicCompleted);
    }

    // Auto-complete topics if solvedCount >= totalQuestions
    progress.topicsProgress.forEach((topic) => {
      const total = topic.totalQuestions || 5;
      if (topic.solvedCount >= total && !progress.topicsCompleted.includes(topic.topicName)) {
        progress.topicsCompleted.push(topic.topicName);
      }
    });
  
    await progress.save();

    // --- Badges ---
    const badgeDoc = await Badge.findOne({ userId });
    const currentBadges = badgeDoc?.badges || [];

    await awardBadges(userId, { ...progress.toObject(), badges: currentBadges });
    const updatedBadges = await Badge.findOne({ userId });

    return NextResponse.json({
      message: "Progress updated",
      progress,
      badges: updatedBadges?.badges || []
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
function max(arg0: number, arg1: number): number {
  throw new Error("Function not implemented.");
}

