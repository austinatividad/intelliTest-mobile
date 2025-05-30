import { runOnJS } from 'react-native-reanimated';
import { z } from 'zod';

export enum fileTypes {
    'text',
    'image',
    // Add other file types as needed
  }
  
export interface Document {
    id: string;
    fileName: string;
    fileType: fileTypes;
    uri: string;
    isRemoved: boolean;
    base64? : string | null;
}

// Enum for Question Types
export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  IDENTIFICATION = "identification",
  ESSAY = "essay",
}


// the interface for the exam input content, will be used to store the content of the exam input and pass it to the next page
export interface ExamInputContent {
    inputText: string;
    documents: Document[];
}

export interface AdditionalExamPromptOptions {
  gradeLevel: string,
  additional_instructions: string
}
export const QuestionTypeSchema = z.enum([QuestionType.ESSAY, QuestionType.MULTIPLE_CHOICE, QuestionType.IDENTIFICATION]);

export const MultipleChoiceOptionSchema = z.object({
  option_text: z.string(),
  is_correct: z.boolean(),
});

export const RubricSchema = z.object({
  criteria: z.string(),
  description: z.string(),
  points: z.number()
});

export const EssayReviewSchema = z.object({
  criteria: z.string(),
  attained_score: z.number(),
  rubric_comment: z.string(),
})

export const EssayReviewSchemaList = z.object({
  reviews: z.array(EssayReviewSchema),
});

export const QuestionSchema = z.object({
  question: z.string(),
  type: QuestionTypeSchema,
  points: z.number(),
  options: z.array(MultipleChoiceOptionSchema),
  rubric: z.array(RubricSchema),
});

export const PartSchema = z.object({
  part_name: z.string(),
  part_description: z.string(),
  questions: z.array(QuestionSchema),
});

export const ExamStatusSchema = z.enum(['Not Yet Answered', 'Complete']);

export const ExamSchema = z.object({
  exam_name: z.string(),
  exam_description: z.string(),
  status: ExamStatusSchema,
  created_at: z.string(),
  attempt_count: z.number(),
  score: z.number(),
  total_score: z.number(),
  part: z.array(PartSchema),
});

export const SuggestionSchema = z.object({
  suggestion_title: z.string(),
  suggestion_content: z.string(),
})
