import { supabase } from "@/lib/supabase";
import * as auth from "@/utils/auth";
import { err } from "react-native-svg";
import * as Crypto from 'expo-crypto';
import { Document, ExamSchema, MultipleChoiceOptionSchema, PartSchema, QuestionSchema, RubricSchema } from "./types";
import { decode } from 'base64-arraybuffer'
import { convertImageToBase64 } from "./imageUtil";

import { z } from 'zod';
import { types } from "@babel/core";

// exam details without the questions
export interface ExamListItem {
    examName: string;
    examStatus: string;
    score: number;
    totalScore: number;
    id: string;
  }

export interface Exam {
    id: string; // Unique identifier for the exam
    user_id: string; // User who created the exam
    exam_name: string; // Name of the exam
    exam_description: string; // Description of the exam
    status: string; // Enum for exam status (e.g., "Completed", "Not Yet Answered")
    created_at: string; // Timestamp when the exam was created
    attempt_count: number; // Number of attempts allowed
    score: number; // Score achieved in the exam
    total_score: number; // Maximum possible score
    part: Part[]; // Array of parts within the exam
}

export interface Part {
    id: string; // Unique identifier for the part
    exam_id: string; // Foreign key referencing the exam ID
    part_name: string; // Name of the part
    part_description: string; // Description of the part
    questions: Question[]; // Array of questions within the part
}

export interface Question {
    id: string; // Unique identifier for the question
    exam_id: string; // Foreign key referencing the exam ID
    part_id: string; // Foreign key referencing the part ID
    question: string; // The question text
    type: QuestionType; // Enum representing the type of question
    points: number; // Points allocated to the question
    options?: MultipleChoiceOption[]; // Array of options for multiple-choice questions
    rubric?: Rubric[]; // Array of rubric criteria for essay questions
}

export interface MultipleChoiceOption {
    id: string; // Unique identifier for the option
    question_id: string; // Foreign key referencing the question ID
    option_text: string; // Text of the multiple-choice option
    is_correct: boolean; // Indicates if this option is correct
}

export interface Identification {
    id: string; // Unique identifier for the identification question
    question_id: string; // Foreign key referencing the question ID
    answer: string; // The correct answer for the identification question
}

export interface Rubric {
    id: string; // Unique identifier for the rubric
    question_id: string; // Foreign key referencing the question ID
    criteria: string; // Rubric criteria
    description: string; // Description of the criteria
    points: number; // Points allocated to this rubric criteria
}

export interface Attempt {
    id: string; // Unique identifier for the attempt
    exam_id: string; // Foreign key referencing the exam ID
    user_id: string; // User who made the attempt
    attempt_number: number; // The attempt number
    score: number; // Score achieved in the attempt
    submitted: boolean; // Indicates if the attempt was submitted
    answers: Answer[]; // Array of answers for the attempt
}

export interface Answer {
    id: string; // Unique identifier for the answer
    attempt_id: string; // Foreign key referencing the attempt ID
    question_id: string; // Foreign key referencing the question ID
    answer: string | boolean; // The answer provided by the user
}

// Enum for Question Types
export enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    TRUE_FALSE = "true_false",
    IDENTIFICATION = "identification",
    ESSAY = "essay",
}

// Enum for Exam Status
export enum ExamStatus {
    NOT_YET_ANSWERED = "Not Yet Answered",
    COMPLETED = "Completed",
}


//gets the list of exams of the user
export async function getExams() {
    const session = await auth.getSession();
    const id = session.data.session?.user.id;
    console.log(id)
    const { data, error } = await supabase
        .from('exam')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
    console.log("finished getting exams");
    console.log(data);
    if (error) {
        console.error('Error getting exams:', error.message);
        return;
    }
    const ExamList: ExamListItem[] = data.map((exam: any) => {
        return {
            examName: exam.exam_name,
            examStatus: exam.status,
            score: exam.score,
            totalScore: exam.total_score,
            id: exam.id
        }
    });

    return ExamList;
}


export async function getExam(examId: string) {
    
    const { data, error } = await supabase
    .from('exam')
    .select(`
        *,
        part(*, question(*, rubric(*), multiple_choice(*)))
    `)
    .eq('id', examId);
    if (error) {
        console.error('Error getting exam:', error.message);
        return;
    }
    const res = data[0];
    return res;
}

export async function createBucket() {
    const uuid = await generateUUID();

    const {data, error} = await supabase.storage.createBucket(uuid, {
        public: true,
        allowedMimeTypes: ["image/*"]
    })

    if (error) throw error;
    console.info(`Bucket Created: ${data.name}`)
    return data
}

export async function uploadImagesToBucket(bucket: string, images: Document[]) {

    await Promise.all(images.map(async (image) => {
        console.info(`Uploading Image: ${image.fileName}`)
        const base64str = "base64" in image ? image.base64 : await convertImageToBase64(image.uri);
        const imageExtension = image.fileName.split('.').pop();
        console.log(imageExtension)
        if (!base64str) return;

        const res =  decode(base64str || '');
        const {data, error} = await supabase.storage.from(bucket).upload(`${image.fileName}`, res, {
            contentType: `image/${imageExtension}`
        });

        if (error) {
            console.error(`Error Uploading Image: ${image.fileName}`)
        }
    }))
}

const generateUUID = async (): Promise<string> => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    return [...randomBytes]
      .map((byte, index) => {
        const value = byte.toString(16).padStart(2, '0');
        if (index === 6) return (parseInt(value, 16) & 0x0f | 0x40).toString(16); // Set version to 4
        if (index === 8) return (parseInt(value, 16) & 0x3f | 0x80).toString(16); // Set variant
        return value;
      })
      .join('')
      .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5'); // Format as UUID
  };

  async function insertMultipleChoiceOptions(
    questionId: string,
    options: z.infer<typeof MultipleChoiceOptionSchema>[]
  ) {
    const formattedOptions = options.map((option) => ({
      question_id: questionId,
      option_text: option.option_text,
      is_correct: option.is_correct,
    }));
  
    const { error } = await supabase.from('multiple_choice').insert(formattedOptions);
  
    if (error) {
      console.error('Error inserting multiple-choice options:', error.message);
      throw error;
    }
  }
  
  async function insertRubrics(
    questionId: string,
    rubrics: z.infer<typeof RubricSchema>[]
  ) {
    const formattedRubrics = rubrics.map((rubric) => ({
      question_id: questionId,
      criteria: rubric.criteria,
      description: rubric.description,
      points: rubric.points
    }));
  
    const { error } = await supabase.from('rubric').insert(formattedRubrics);
  
    if (error) {
      console.error('Error inserting rubrics:', error.message);
      throw error;
    }
  }
  

  async function insertQuestions(
    partId: string,
    examId: string,
    questions: z.infer<typeof QuestionSchema>[]
  ) {
    for (const question of questions) {
      const { data, error } = await supabase
        .from('question')
        .insert({
          part_id: partId,
          exam_id: examId,
          question: question.question,
          type: question.type,
          points: question.points,
        })
        .select('id')
        .single();
  
      if (error) {
        console.error('Error inserting question:', error.message);
        throw error;
      }
  
      const questionId = data.id;
  
      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        await insertMultipleChoiceOptions(questionId, question.options || []);
      } else if (question.type === QuestionType.ESSAY) {
        await insertRubrics(questionId, question.rubric || []);
      }
    }
  }
  

  async function insertParts(
    examId: string,
    parts: z.infer<typeof PartSchema>[]
  ) {
    for (const part of parts) {
      const { data, error } = await supabase
        .from('part')
        .insert({
          exam_id: examId,
          part_name: part.part_name,
          part_description: part.part_description,
        })
        .select('id')
        .single();
  
      if (error) {
        console.error('Error inserting part:', error.message);
        throw error;
      }
  
      const partId = data.id;
  
      await insertQuestions(partId, examId, part.questions);
    }
  }
  

  export async function insertExam(exam: z.infer<typeof ExamSchema>) {
    try {
        const session = await auth.getSession();
        const id = session.data.session?.user.id;
      // Insert the exam
      const { data, error } = await supabase
        .from('exam')
        .insert({
            user_id: id,
            exam_name: exam.exam_name,
            exam_description: exam.exam_description,
            status: exam.status,
            created_at: new Date(),
            attempt_count: exam.attempt_count,
            score: exam.score,
            total_score: exam.total_score,
        })
        .select('id')
        .single();
  
      if (error) {
        console.error('Error inserting exam:', error);
        throw error;
      }
  
      const examId = data.id;
  
      // Insert parts and their questions
      await insertParts(examId, exam.part);
  
      console.log('Exam created successfully with all parts and questions!');
      return examId;
    } catch (error: any) {
      console.error('Error creating exam:', error);
      throw error;
    }
  }
  
  export async function createAttempt(exam_id: string, answers: Answer[]) {
    try {
      const session = await auth.getSession();
      const id = session.data.session?.user.id;

      // obtain the attempt number by querying the attempt_count of the number
      console.log("STATUS: OBTAINING ATTEMPT NUMBER") 
      const { data: attemptData, error: attemptDataError } = await supabase
        .from('exam')
        .select('attempt_count')
        .eq('id', exam_id)
        .single();

      if (attemptDataError) {
        console.error('Error fetching attempt count:', attemptDataError.message);
        throw attemptDataError;
      }
      console.log("STATUS: OBTAINING ATTEMPT COUNT") 
      const attemptCount: number = attemptData.attempt_count + 1;

      var accumulatedScore = 0; // apppended per item

      // to calculate the exam attempt, we first get the list of questions JOINED by the correct answer depending on their type of question. 
      //currently, we only need the following types: multiple_choice and essay
      console.log("STATUS: OBTAINING LIST OF QUESTIONS AND ANSWERS FROM THE EXAM")

      const { data: QuestionListData, error: QuestionListDataError} = await supabase
        .from('question')
        .select(`
          id, 
          question, 
          type,
          points, 
          multiple_choice:multiple_choice(id, option_text, is_correct), 
          rubric:rubric(id, criteria, description)
        `)
        .eq('exam_id', exam_id);

      if (QuestionListDataError) {
        console.error('Error retrieving exam details')
      }

      console.log("DEBUG: DATA FORMAT-----")
      console.log(QuestionListData)
      console.log("STATUS: ANSWERS RETRIEVED; NOW GRADING WORK: ")

      console.log("DEBUG: ANSWER FORMAT-----")
      console.log(answers)

      answers.forEach((answer) => {
        const question = QuestionListData.find((q) => q.id === answer.question_id);
        if (!question) return; // Skip if the question is not found

        if (question.type === "multiple_choice") {
          // **Multiple-Choice Grading**
          const correctOption = question.multiple_choice.find((opt) => opt.is_correct);
          if (correctOption && correctOption.option_text === answer.answer) {
            accumulatedScore += question.points || 0; // Add points for correct answers
            console.log(`Adding ${question.points} to the score!`)
          }
        } else if (question.type === "essay") {
          //TODO: ADD GRADING PROMPT HERE! TEMP FOR NOW
          accumulatedScore += 0;
          console.log("Essay Question Temporary Here ------------")
        }
      });

      console.log(`Final Score: ${accumulatedScore}`);

      console.log("STATUS: INSERTING ATTEMPT")
      const { data, error } = await supabase
        .from('attempt')
        .insert({
          exam_id: exam_id,
          user_id: id,
          attempt_number: attemptCount,
          score: accumulatedScore
        }).select('id').single();

      // update the attempt_count of the exam
      const { error: updateError } = await supabase
        .from('exam')
        .update({ attempt_count: attemptCount })
        .eq('id', exam_id);

      if (updateError) {
        console.error('Error updating attempt count:', updateError.message);
        throw updateError;
      }

      // batch insert the answers
      const attemptID = data?.id;

      const answersToInsert = answers.map((answer) => ({
        attempt_id: attemptID, // Reference to the attempt
        question_id: answer.question_id,
        answer: answer.answer,
      }));

      const {data: answerInsertData, error: answerInsertDataError} = await supabase
        .from('question')
        .insert(answersToInsert);

      if(answerInsertDataError) {
        console.error("Error inserting the questions: ", answerInsertDataError);
        throw answerInsertDataError
      }

      console.log("Success Final")
      console.log(answerInsertData)
      
      return true; // success
    } catch (error: any) {
      alert("Error uploading your attempt to the database")
      console.error(error)
      return false;
    }
  }