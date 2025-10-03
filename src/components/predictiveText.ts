
import { pipeline } from '@huggingface/transformers';

interface Template {
  id: number;
  name: string;
  content: string;
  category: string;
}

let textGenerator: any = null;
let isInitializing = false;

const initializeModel = async () => {
  if (textGenerator || isInitializing) return textGenerator;
  
  isInitializing = true;
  try {
    console.log('Initializing text generation model...');
    textGenerator = await pipeline('text-generation', 'Xenova/distilgpt2');
    console.log('Text generation model initialized successfully');
    return textGenerator;
  } catch (error) {
    console.error('Failed to initialize text generation model:', error);
    textGenerator = null;
    return null;
  } finally {
    isInitializing = false;
  }
};

export const getPredictiveText = async (text: string, templates: Template[] = []): Promise<string[]> => {
  // If text is too short, return empty suggestions
  if (!text.trim() || text.length < 3) {
    return [];
  }

  try {
    // Initialize model if not already done
    const generator = await initializeModel();
    
    if (!generator) {
      console.log('Model not available, using fallback suggestions');
      return getFallbackSuggestions(text);
    }

    console.log('Generating AI predictions for:', text.slice(-20));
    
    // Use the last few words as context for better predictions
    const words = text.trim().split(/\s+/);
    const contextWords = Math.min(words.length, 8);
    const context = words.slice(-contextWords).join(' ');
    
    // Generate text completions
    const result = await generator(context, {
      max_new_tokens: 15,
      num_return_sequences: 3,
      temperature: 0.7,
      do_sample: true,
      pad_token_id: 50256,
      return_full_text: false,
    });

    console.log('AI generation result:', result);

    if (result && Array.isArray(result)) {
      const suggestions = result
        .map((item: any) => {
          const generatedText = item.generated_text || '';
          
          // Clean up the generated text
          let cleanText = generatedText
            .trim()
            .split(/[.!?]/)[0] // Take only the first sentence
            .replace(/^\W+/, '') // Remove leading non-word characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          // Create a complete sentence by combining original text with AI completion
          const completion = text + (text.endsWith(' ') ? '' : ' ') + cleanText;
          return completion;
        })
        .filter((suggestion: string) => {
          return suggestion.length > text.length && 
                 suggestion.length < text.length + 100 && 
                 !suggestion.toLowerCase().includes('undefined') &&
                 suggestion.trim().length > 0;
        })
        .slice(0, 3);

      console.log('Final AI suggestions:', suggestions);
      
      if (suggestions.length > 0) {
        return suggestions;
      }
    }
    
    // Fallback if AI doesn't generate good results
    return getFallbackSuggestions(text);
    
  } catch (error) {
    console.error('Error generating AI predictions:', error);
    return getFallbackSuggestions(text);
  }
};

const getFallbackSuggestions = (text: string): string[] => {
  const lowerText = text.toLowerCase();
  
  // Context-aware fallback suggestions
  if (lowerText.includes('thank')) {
    return [
      text + ' you for your time and consideration.',
      text + ' you for reaching out to us.',
      text + ' you for your patience.'
    ];
  } else if (lowerText.includes('please')) {
    return [
      text + ' let me know if you need anything else.',
      text + ' feel free to contact us anytime.',
      text + ' don\'t hesitate to reach out.'
    ];
  } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
    return [
      text + ', hope you\'re doing well today.',
      text + ', thanks for getting in touch.',
      text + ', great to hear from you.'
    ];
  } else {
    return [
      text + ' and I look forward to your response.',
      text + '. Please let me know if you have questions.',
      text + '. Thank you for your time.'
    ];
  }
};
