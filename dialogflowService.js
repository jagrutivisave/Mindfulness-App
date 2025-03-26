/**
 * Mock implementation of Dialogflow integration for development
 * In production, you would replace this with actual Dialogflow API calls
 */

import { 
  searchAppContent, 
  getRecommendations, 
  getContentList 
} from './appContentService';

// Replace these values with your own Dialogflow project credentials
const PROJECT_ID = 'your-project-id';
const SESSION_ID = 'mental-health-session';
const LANGUAGE_CODE = 'en-US';

let initialized = false;

/**
 * Setup and initialize Dialogflow with authentication
 */
export const setupDialogflow = async () => {
  // For actual implementation, you'll need to set up authentication with Google Cloud
  // This might involve creating a service account and using the @google-cloud/dialogflow package
  console.log('Dialogflow initialized');
  initialized = true;
  return true;
};

/**
 * Send a message to Dialogflow and get a response
 * @param {string} text - The message to send to Dialogflow
 * @returns {Promise<Object>} - The response from Dialogflow
 */
export const sendToDialogflow = async (text) => {
  if (!initialized) {
    throw new Error('Dialogflow not initialized. Call setupDialogflow first.');
  }

  try {
    // In a real implementation, this would call the Dialogflow API
    // For now, we'll simulate a response based on keywords in the text
    const response = await simulateDialogflowResponse(text);
    return response;
  } catch (error) {
    console.error('Dialogflow error:', error);
    throw error;
  }
};

/**
 * Formats app content into a readable message
 * @param {Array} items - Array of content items
 * @param {string} contentType - Type of content (music, meditation, etc.)
 * @returns {string} - Formatted message
 */
const formatContentList = (items, contentType) => {
  if (!items || items.length === 0) {
    return `No ${contentType} content found matching your request.`;
  }
  
  // Limit to 3 items to avoid overwhelming the user
  const limitedItems = items.slice(0, 3);
  
  let message = `Here are some ${contentType} suggestions for you:\n\n`;
  
  limitedItems.forEach((item, index) => {
    message += `${index + 1}. **${item.title}**\n   ${item.description}\n   ${item.details}\n\n`;
  });
  
  return message;
};

/**
 * Temporary function to simulate Dialogflow responses for mental health topics
 * Replace this with actual Dialogflow API calls when you have your credentials
 */
const simulateDialogflowResponse = async (text) => {
  // Convert to lowercase for easier matching
  const lowerText = text.toLowerCase();
  
  // Check for app content related queries
  if (lowerText.includes('music') || lowerText.includes('play') || lowerText.match(/song|audio|sound/)) {
    // User is asking about music
    let results;
    let suggestions = ["Relaxing music", "Sleep music", "Focus music", "Show all music"];
    
    if (lowerText.includes('relax') || lowerText.includes('calm') || lowerText.includes('stress')) {
      // User wants relaxing music
      results = getRecommendations('mood', 'relaxation');
      return {
        text: formatContentList(getContentList('music').filter(item => 
          item.description.toLowerCase().includes('relax')
        ), 'music'),
        intent: 'music.relaxation',
        confidence: 0.9,
        suggestions,
        contentType: 'music'
      };
    } else if (lowerText.includes('sleep') || lowerText.includes('night') || lowerText.includes('bed')) {
      // User wants sleep music
      results = getRecommendations('mood', 'sleep');
      return {
        text: formatContentList(getContentList('music').filter(item => 
          item.description.toLowerCase().includes('sleep')
        ), 'music'),
        intent: 'music.sleep',
        confidence: 0.9,
        suggestions,
        contentType: 'music'
      };
    } else if (lowerText.includes('focus') || lowerText.includes('concentrate') || lowerText.includes('study')) {
      // User wants focus music
      results = getRecommendations('mood', 'focus');
      return {
        text: formatContentList(getContentList('music').filter(item => 
          item.description.toLowerCase().includes('focus')
        ), 'music'),
        intent: 'music.focus',
        confidence: 0.9,
        suggestions,
        contentType: 'music'
      };
    } else {
      // General music request
      return {
        text: formatContentList(getContentList('music'), 'music'),
        intent: 'music.list',
        confidence: 0.9,
        suggestions,
        contentType: 'music'
      };
    }
  }
  
  // Check for meditation related queries
  else if (lowerText.includes('meditation') || lowerText.includes('meditate')) {
    let suggestions = ["Beginner meditation", "Sleep meditation", "Stress meditation", "Show all meditations"];
    
    if (lowerText.includes('beginner') || lowerText.includes('start') || lowerText.includes('new')) {
      // User wants beginner meditations
      return {
        text: formatContentList(getContentList('meditations').filter(item => 
          item.description.toLowerCase().includes('beginner')
        ), 'meditation'),
        intent: 'meditation.beginner',
        confidence: 0.9,
        suggestions,
        contentType: 'meditation'
      };
    } else if (lowerText.includes('sleep')) {
      // User wants sleep meditations
      return {
        text: formatContentList(getContentList('meditations').filter(item => 
          item.description.toLowerCase().includes('sleep')
        ), 'meditation'),
        intent: 'meditation.sleep',
        confidence: 0.9,
        suggestions,
        contentType: 'meditation'
      };
    } else {
      // General meditation request
      return {
        text: formatContentList(getContentList('meditations'), 'meditation'),
        intent: 'meditation.list',
        confidence: 0.9,
        suggestions,
        contentType: 'meditation'
      };
    }
  }
  
  // Check for game related queries
  else if (lowerText.includes('game') || lowerText.includes('play game') || lowerText.match(/puzzle|activity/)) {
    let suggestions = ["Relaxing games", "Puzzle games", "Mindfulness games", "Show all games"];
    
    if (lowerText.includes('puzzle')) {
      return {
        text: formatContentList(getContentList('games').filter(item => 
          item.description.toLowerCase().includes('puzzle')
        ), 'games'),
        intent: 'games.puzzle',
        confidence: 0.9,
        suggestions,
        contentType: 'games'
      };
    } else {
      // General games request
      return {
        text: formatContentList(getContentList('games'), 'games'),
        intent: 'games.list',
        confidence: 0.9,
        suggestions,
        contentType: 'games'
      };
    }
  }
  
  // Check for breathing exercise related queries
  else if (lowerText.includes('breathing') || lowerText.includes('breath') || lowerText.match(/breathe|breath exercise/)) {
    return {
      text: formatContentList(getContentList('breathing'), 'breathing exercises'),
      intent: 'breathing.list',
      confidence: 0.9,
      suggestions: ["Box breathing", "4-7-8 breathing", "Diaphragmatic breathing", "More exercises"],
      contentType: 'breathing'
    };
  }
  
  // Define response patterns for mental health topics
  const responses = [
    {
      keywords: ['anxious', 'anxiety', 'worried', 'stress', 'stressed'],
      response: "I notice you're feeling anxious. Anxiety is a common experience. Would you like to try a quick breathing exercise to help calm your nervous system?",
      followupSuggestions: ["Breathing exercise", "Grounding techniques", "Anxiety music", "Calming meditation"]
    },
    {
      keywords: ['sad', 'depressed', 'depression', 'unhappy', 'low', 'down'],
      response: "I'm sorry to hear you're feeling low. Depression and sadness are normal emotions that everyone experiences. Would you like to explore some gentle activities that might help lift your mood?",
      followupSuggestions: ["Mood-lifting activities", "Self-care ideas", "Talk about depression", "Relaxing music"]
    },
    {
      keywords: ['sleep', 'insomnia', 'tired', 'rest', 'sleepy', 'awake'],
      response: "Sleep difficulties can really affect our mental well-being. Would you like some evidence-based tips for improving your sleep quality?",
      followupSuggestions: ["Sleep meditation", "Bedtime music", "Sleep hygiene tips", "Not now"]
    },
    {
      keywords: ['focus', 'concentrate', 'attention', 'distracted', 'mind wandering'],
      response: "Having trouble focusing can be frustrating. I can recommend some mindfulness techniques or concentration-enhancing content that might help you improve your focus.",
      followupSuggestions: ["Focus music", "Concentration meditation", "Mindfulness games", "Not now"]
    },
    {
      keywords: ['help', 'therapy', 'therapist', 'counseling', 'professional', 'doctor'],
      response: "It's really brave to consider seeking professional help. Therapy and counseling can be very effective for many mental health concerns. Would you like some information about finding mental health support?",
      followupSuggestions: ["Types of therapy", "Finding a therapist", "Crisis resources", "Self-help options"]
    },
    {
      keywords: ['crisis', 'suicide', 'kill', 'harm', 'emergency', 'die'],
      response: "I'm concerned about what you're sharing. If you're in crisis or having thoughts of harming yourself, please reach out to a crisis helpline immediately. In the US, you can text HOME to 741741 or call 988 to reach the Suicide & Crisis Lifeline. Would you like me to provide more crisis resources?",
      followupSuggestions: ["Crisis resources", "Grounding exercise", "Reasons to stay", "Contact support"]
    }
  ];

  // Check for matching keywords
  for (const pattern of responses) {
    if (pattern.keywords.some(keyword => lowerText.includes(keyword))) {
      // Return a response object that mimics Dialogflow's structure
      return {
        text: pattern.response,
        intent: pattern.keywords[0], // Using first keyword as mock intent
        confidence: 0.9,
        suggestions: pattern.followupSuggestions
      };
    }
  }

  // Default responses for greetings and general questions
  if (lowerText.match(/hi|hello|hey|greetings/)) {
    return {
      text: "Hello! I'm here to support your mental health journey. How are you feeling today?",
      intent: "greeting",
      confidence: 0.95,
      suggestions: ["I'm feeling anxious", "I need music to relax", "Show me meditations", "Tell me about games"]
    };
  }
  
  if (lowerText.includes('how are you')) {
    return {
      text: "I'm here and ready to support you. More importantly, how are you doing today?",
      intent: "greeting.how_are_you",
      confidence: 0.9,
      suggestions: ["I'm doing well", "I need a meditation", "Recommend music", "Breathing exercises"]
    };
  }
  
  if (lowerText.match(/thank|thanks/)) {
    return {
      text: "You're welcome! I'm here anytime you need support or someone to talk to about your mental health.",
      intent: "gratitude",
      confidence: 0.9,
      suggestions: ["More mental health tips", "Meditation suggestions", "Anxiety help", "Show music"]
    };
  }
  
  // Fallback response
  return {
    text: "I'm here to help with your mental health and provide recommendations for content in our app. You can ask about music, meditations, games, or breathing exercises!",
    intent: "fallback",
    confidence: 0.7,
    suggestions: ["Show me relaxing music", "I need a meditation", "Games for relaxation", "Breathing exercises"]
  };
}; 