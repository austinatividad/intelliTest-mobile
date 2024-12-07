import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { ExamSchema, RubricSchema } from "./types";
import { z } from "zod";
import { ChatCompletionContentPartImage, ChatCompletionContentPartText } from "openai/resources";
import { ImageURL } from "openai/resources/beta/threads/messages";
import { Rubric } from "./supabaseQueries";
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
  async function generateExam(notes?: string, imageB64s?: string[]) : Promise<z.infer<typeof ExamSchema>> {

      // Check if both notes and images are missing
      if (!notes && (!imageB64s || imageB64s.length === 0)) {
        throw new Error("Insufficient data: Both notes and images are missing. Provide at least one input.");
    }

    // Process notes if provided
    const notesContent = notes ? `The notes are: ${notes}` : "No textual notes provided.";

    // Process images if provided

    //! FIX: This does not work; tried to make a test with images of physics equations, and it ended up making a quiz about base64 encoding

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
    // console.info(imgUrlObjects);
    const prompt = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: "system", content: "You are a Departmental Mock Exam Generator. Generate the maximum amount of possible questions based on the following provided contents, with a minimum of 30 questions. The questions should be divided into three equal point-wise parts as follows: Knowledge (Multiple Choice), Process (Modified True or False - Multiple choice format, Options are set to \"Statement A is True\", \"Statement B is true\", \"Both Statements are True\", \"Both Statements are False\"), Understanding (Essay to test the ). For the Knowledge and Process Questions, provide the correct answer along with the list of choices. For the Understanding questions, provide a rubric that would guide the user on how they are graded. Follow the ExamFormat in generating the exam."
        },
        {
          role: "user", content: [
            {type: 'text', text:`${notesContent}`},
            ...imgUrlObjects
          ]
        }
      ],
      response_format: zodResponseFormat(ExamSchema, 'ExamFormat')
    });

    const exam = ExamSchema.parse(prompt.choices[0].message.parsed);
    return exam;
  }
  

  async function evaluateEssay(essay: string, rubrics: Rubric[], question: string) {
    const prompt = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a teacher grading an essay. The question is: "${question}". Using the Rubric Array as the reference, grade the essay of the student. This is the rubrics array: ${rubrics}. Each element in the array is a criteria required to achieve the highest points for the essay, you have to give a grade for every criteria based on the essay that is provided. Follow the RubricFormat for the grading wherein the "points" property is the amount of points the essay deserves for that criteria.`
        },

        {
          role: 'user',
          content: `${essay}`
        }
      ],
      response_format: zodResponseFormat(RubricSchema, 'RubricFormat')
    });

    return prompt.choices[0].message.parsed;
  }
  export { promptList, getPrompt, generateExam, evaluateEssay };
  