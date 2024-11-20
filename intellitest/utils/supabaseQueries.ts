import { supabase } from "@/lib/supabase";
import * as auth from "@/utils/auth";
import { err } from "react-native-svg";
import * as Crypto from 'expo-crypto';
import { Document } from "./types";
import { decode } from 'base64-arraybuffer'
import { convertImageToBase64 } from "./imageUtil";

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
        .eq('user_id', id);
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