import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { AdditionalExamPromptOptions, EssayReviewSchema, ExamSchema, RubricSchema, EssayReviewSchemaList, SuggestionSchema } from "./types";
import { z } from "zod";
import { ChatCompletionContentPartImage, ChatCompletionContentPartText } from "openai/resources";
import { ImageURL } from "openai/resources/beta/threads/messages";
import { Rubric, EssayReview } from './supabaseQueries';
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '', // Ensure your API key is stored securely
});

type ImageObject = {
  type: string;
  image_url: string;
}

const promptList = new Map<string, string>([
    // Prompts list
    // if we want to replace a {key} with a value, we can use the formatPrompt function
    ['generateTest', 'Prompt'],
    ['evaluatePrompt', 'Your task is to evaluate if the given prompt is spam or not. The prompt is: {prompt}'],
    ['evaluateNotes', 'Your task is to evaluate the given notes. Output in JSON of valid_notes (bool) if the notes contain enough context to make a 50-item exam. The notes are: {notes}'],
    ['generateRubric', 'Prompt'],
    ['evaluateEssay', 'Prompt'],
    ['testPrompt', 'Your name is {name} and you are a {profession}.'],
    ['imageTestPrompt', 'I have attached an image. Tell me what you see.'],
  ]);
  
  function getPrompt(promptName: string, replacements: Record<string, string>): string {
    const promptText = promptList.get(promptName);
    if (!promptText) {
      throw new Error(`Prompt with name "${promptName}" not found.`);
    }
    return formatPrompt(promptText, replacements);
  }

  function formatPrompt(prompt: string, replacements: Record<string, string>): string {
    return prompt.replace(/{(\w+)}/g, (_, key) => {
      if (key in replacements) {
        return replacements[key];
      } else {
        throw new Error(`Missing replacement value for key: ${key}`);
      }
    });
  }
  
  //TODO: Add options...
  async function generateExam(notes?: string, imageB64s?: string[], options?: AdditionalExamPromptOptions) : Promise<z.infer<typeof ExamSchema>> {

      // Check if both notes and images are missing
      if (!notes && (!imageB64s || imageB64s.length === 0)) {
        throw new Error("Insufficient data: Both notes and images are missing. Provide at least one input.");
    }

    // Process notes if provided
    const notesContent = notes ? `The notes are: ${notes}` : "No textual notes provided.";
    let includedOptions = "";
    // Process images if provided

    let imageDescriptions = "";
    let imgUrlObjects: ChatCompletionContentPartImage[] = [];
    if (imageB64s && imageB64s.length > 0) {
      imgUrlObjects = imageB64s.map((imageB64) => {
          try {
              const validatedUrl = new URL(imageB64); // Validates the URL format
              return {
                  type: 'image_url',
                  image_url: { url: validatedUrl.href } // Wrap the validated URL as an object
              };
          } catch (error) {
              console.error(`Invalid image URL: ${imageB64}`, error);
              return null; // Skip invalid URLs
          }
      }).filter((obj): obj is ChatCompletionContentPartImage => obj !== null);
    }

    console.info("Done parsing Image URLs")
    console.info(`Options: ${options}`)
    if (options) {
      includedOptions += "Options: [\n"
      if (options.additional_instructions != "") {
        includedOptions += "Additional Instructions: " + options.additional_instructions + "\n";
      }
      if (options.gradeLevel != "") {
        includedOptions += "Grade Level: " + options.gradeLevel + "\n";
      }

      includedOptions += "]\n"
    }

    console.info(includedOptions);
    const prompt = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "system", content: "You are a Departmental Mock Exam Generator. Generate the maximum amount of possible questions based on the following provided contents, with a minimum of 30 questions. The questions should be divided into three equal point-wise parts as follows: Knowledge (Multiple Choice (1pt)), Process (Modified True or False - Multiple choice format, Question is formatted to: Statement A: {statement} StatementB: {statement} ; Options are set to \"Statement A is True\", \"Statement B is true\", \"Both Statements are True\", \"Both Statements are False\"), Understanding (Essay). For the Knowledge and Process Questions, provide the correct answer along with the list of choices. For the Understanding questions, provide a rubric that would guide the user on how they are graded. The total points of all the points in the rubrics combined must be equivalent to the max points attainable for that question. Follow the ExamFormat in generating the exam. Use the options (if it is applicable) to modify the difficulty of the exam. Grade Level in the options pertains to the K-12 Philippine curriculum standard."
        },
        {
          role: "user", content: [
            {type: `text`, text:includedOptions},
            {type: 'text', text:`Notes: ${notesContent}`},
            ...imgUrlObjects
          ]
        }
      ],
      response_format: zodResponseFormat(ExamSchema, 'ExamFormat')
    });

    const exam = ExamSchema.parse(prompt.choices[0].message.parsed);

    // Double check and validate total_score with the contents of the exam,
    // as there are cases where it is innacurate
    let totalScore = 0;
    exam.part.forEach((p) => {
      p.questions.forEach((question) => {
        totalScore += question.points;
      });
    });

    if (totalScore !== exam.total_score) {
      //changed to log because warn shows in the device
      console.log(`Total score mismatch: ${totalScore} (calculated) vs ${exam.total_score} (prompt)`);
      exam.total_score = totalScore;
    }

    return exam;
  }
  

  async function evaluateEssay(essay: string, rubrics: Rubric[], question: string) {
    const prompt = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a very polite and understanding teacher grading an essay. Maximum 20 words. Do not be too strict. Give 0 points if unrelated. Only allow integer for attributed_score. The question is: "${question}". Using the Rubric Array as the reference, grade the essay of the student. This is the rubrics array: ${JSON.stringify(rubrics)}. Each element in the array has a criteria required to achieve the highest points for the essay; provide a grade for every criteria based on the essay that is provided. Follow the format for the grading wherein the "attained_score" property is the amount of points the essay deserves for each criteria.`
        },

        {
          role: 'user',
          content: `${essay}`
        }
      ],
      response_format: zodResponseFormat(EssayReviewSchemaList, 'EssayReviewSchemaFormat')
    });
    const review = EssayReviewSchemaList.parse(prompt.choices[0].message.parsed);
    return review;
  }
  export { promptList, getPrompt, generateExam, evaluateEssay };
  
  export async function suggestNewExam(latestExams: any[]) {
    const prompt = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Recommend a new exam for them to generate based on the 3 latest exams they made. suggestionContent is the prompt / context of the exam that would act as notes for generating the suggested exams. suggestionTitle should be the identifying name of an exam, not a prompt or action. If there were no exams made, provide a random suggestion.`
        },
          
          {
            role: 'user',
            content: JSON.stringify(latestExams)
          }
      ],
      response_format: zodResponseFormat(SuggestionSchema, 'SuggestionSchemaFormat')
    });
    const suggestion = SuggestionSchema.parse(prompt.choices[0].message.parsed);
    return suggestion;
  }