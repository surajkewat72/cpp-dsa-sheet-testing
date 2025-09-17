import { Schema, model, models, Document } from "mongoose";

export interface IQuestion extends Document {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  isSolved: boolean;
  isMarkedForRevision: boolean;
  links: {
    leetcode?: string;
    gfg?: string;
    hackerrank?: string;
    spoj?: string;
    ninja?: string;
    code?: string;
    custom?: string;
  };
  solutionLink?: string;
  companies?: string[];
}

export interface ITopic extends Document {
  id: number;
  name: string;
  questions: IQuestion[];
}

const QuestionSchema = new Schema<IQuestion>(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    isSolved: { type: Boolean, default: false },
    isMarkedForRevision: { type: Boolean, default: false },
    links: {
      leetcode: { type: String },
      gfg: { type: String },
      hackerrank: { type: String },
      spoj: { type: String },
      ninja: { type: String },
      code: { type: String },
      custom: { type: String },
    },
    solutionLink: { type: String },
    companies: [{ type: String }],
  },
  { _id: false } 
);

const TopicSchema = new Schema<ITopic>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    questions: [QuestionSchema],
  },
  {
    timestamps: true,
    collection: "questions", 
  }
);

export const Topic =
  models.Topic || model<ITopic>("Topic", TopicSchema);
