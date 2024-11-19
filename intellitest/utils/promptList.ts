

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
  
  
  
  export { promptList, getPrompt };
  