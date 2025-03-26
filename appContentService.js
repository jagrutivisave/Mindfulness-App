/**
 * App Content Service
 * Provides access to app content data for the chatbot to reference
 */

import { meditationSessions } from '../screens/MeditationScreen';
import { gamesList } from '../screens/GamesScreen';

// Export content from different parts of the app
// Note: Due to module structure, we're mocking these rather than directly importing
// In a real app, you'd structure this differently or use a context/state management solution

// Meditation sessions data (mocked based on MeditationScreen.jsx)
export const meditations = [
  { 
    id: "1", 
    title: "10-Minute Relaxation", 
    description: "A short session to help you relax and reset during a busy day",
    duration: "10 min", 
    category: "relaxation",
    level: "Beginner"
  },
  { 
    id: "2", 
    title: "Deep Breathing", 
    description: "Learn proper breathing techniques to calm your nervous system",
    duration: "15 min", 
    category: "breathing",
    level: "All Levels"
  },
  { 
    id: "3", 
    title: "Mindfulness Meditation", 
    description: "Practice present moment awareness with guided mindfulness techniques",
    duration: "20 min", 
    category: "mindfulness",
    level: "Intermediate"
  },
  { 
    id: "4", 
    title: "Stress Relief", 
    description: "Release tension and worry with this calming guided meditation",
    duration: "10 min", 
    category: "stress",
    level: "Beginner"
  },
  { 
    id: "5", 
    title: "Sleep Better", 
    description: "Gentle meditation to help you fall asleep naturally and peacefully",
    duration: "30 min", 
    category: "sleep",
    level: "All Levels"
  }
];

// Music data (mocked since there's no MusicScreen)
export const music = [
  {
    id: "1",
    title: "Peaceful Piano",
    artist: "Various Artists",
    duration: "120 min",
    category: "relaxation",
    description: "Gentle piano melodies for relaxation and focus"
  },
  {
    id: "2",
    title: "Nature Sounds",
    artist: "Nature's Symphony",
    duration: "60 min",
    category: "sleep",
    description: "Calming forest and water sounds for better sleep"
  },
  {
    id: "3",
    title: "Meditation Bowl Sounds",
    artist: "Zen Master",
    duration: "45 min",
    category: "meditation",
    description: "Tibetan singing bowls for deep meditation"
  },
  {
    id: "4",
    title: "Focus Beats",
    artist: "Study Mix",
    duration: "90 min",
    category: "focus",
    description: "Low-fi beats designed to improve concentration and productivity"
  },
  {
    id: "5",
    title: "Anxiety Relief",
    artist: "Calm Collective",
    duration: "30 min",
    category: "anxiety",
    description: "Specially composed music to reduce anxiety and stress"
  }
];

// Games data (mocked based on GamesScreen.jsx)
export const games = [
  {
    id: "1",
    name: "Calm Puzzle",
    description: "Solve relaxing puzzles to clear your mind and reduce stress",
    category: "puzzle",
    difficulty: "Easy",
    duration: "5-10 min",
    benefits: ["Stress Relief", "Focus", "Cognitive Skills"]
  },
  {
    id: "2",
    name: "Mindful Coloring",
    description: "Express yourself through colors while practicing mindfulness",
    category: "creative",
    difficulty: "Easy",
    duration: "Any time",
    benefits: ["Creativity", "Calm", "Expression"]
  },
  {
    id: "3",
    name: "Relaxing Music Game",
    description: "Create beautiful melodies to help you unwind and relax",
    category: "music",
    difficulty: "Medium",
    duration: "10-15 min",
    benefits: ["Relaxation", "Creativity", "Auditory Skills"]
  },
  {
    id: "4",
    name: "Meditation Journey",
    description: "An interactive journey through guided meditation exercises",
    category: "meditation",
    difficulty: "Medium",
    duration: "15-20 min",
    benefits: ["Deep Relaxation", "Mindfulness", "Emotional Balance"]
  }
];

// Breathing exercises data
export const breathingExercises = [
  {
    id: "1",
    name: "Box Breathing",
    description: "Breathe in for 4, hold for 4, out for 4, hold for 4",
    duration: "3-5 min",
    benefits: ["Stress reduction", "Improved focus", "Anxiety relief"]
  },
  {
    id: "2",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    duration: "5 min",
    benefits: ["Sleep improvement", "Anxiety reduction", "Calm nervous system"]
  },
  {
    id: "3",
    name: "Diaphragmatic Breathing",
    description: "Deep belly breathing to engage the diaphragm fully",
    duration: "5-10 min",
    benefits: ["Reduced stress", "Full oxygen exchange", "Lower heart rate"]
  }
];

/**
 * Search for content across the app based on query and type
 * @param {string} query - The search query
 * @param {string} type - Optional content type filter (meditation, music, game, breathing)
 * @returns {Object} Search results with matches from each content type
 */
export const searchAppContent = (query, type = null) => {
  const lowerQuery = query.toLowerCase();
  let results = {};
  
  // Function to search within an array based on fields
  const searchInArray = (array, searchFields) => {
    return array.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (Array.isArray(value)) {
          return value.some(v => v.toLowerCase().includes(lowerQuery));
        }
        return value && value.toLowerCase().includes(lowerQuery);
      });
    });
  };
  
  // Search meditations if requested or if no specific type
  if (!type || type === 'meditation') {
    results.meditations = searchInArray(meditations, ['title', 'description', 'category']);
  }
  
  // Search music if requested or if no specific type
  if (!type || type === 'music') {
    results.music = searchInArray(music, ['title', 'artist', 'description', 'category']);
  }
  
  // Search games if requested or if no specific type
  if (!type || type === 'game') {
    results.games = searchInArray(games, ['name', 'description', 'category', 'benefits']);
  }
  
  // Search breathing exercises if requested or if no specific type
  if (!type || type === 'breathing') {
    results.breathing = searchInArray(breathingExercises, ['name', 'description', 'benefits']);
  }
  
  return results;
};

/**
 * Get recommendations based on mood, activity, or health concern
 * @param {string} type - Type of recommendation (mood, activity, concern)
 * @param {string} value - Specific value (e.g., "anxious", "sleep", "focus")
 * @returns {Object} Recommendations from different content types
 */
export const getRecommendations = (type, value) => {
  const lowerValue = value.toLowerCase();
  let recommendations = {};
  
  // Mapping of common concerns/moods to content categories
  const categoryMappings = {
    anxious: ['anxiety', 'stress', 'breathing', 'relaxation'],
    stressed: ['stress', 'relaxation', 'breathing'],
    sad: ['mindfulness', 'creative'],
    tired: ['sleep', 'relaxation'],
    unfocused: ['focus', 'mindfulness'],
    sleep: ['sleep', 'relaxation'],
    focus: ['focus', 'mindfulness'],
    relax: ['relaxation', 'stress'],
    calm: ['relaxation', 'mindfulness', 'breathing']
  };
  
  // Get matching categories
  const categories = categoryMappings[lowerValue] || ['mindfulness'];
  
  // Filter content by matching categories
  recommendations.meditations = meditations.filter(item => 
    categories.includes(item.category)
  );
  
  recommendations.music = music.filter(item => 
    categories.includes(item.category)
  );
  
  recommendations.games = games.filter(item => 
    categories.includes(item.category) || 
    (item.benefits && item.benefits.some(b => 
      categories.some(c => b.toLowerCase().includes(c))
    ))
  );
  
  recommendations.breathing = breathingExercises;
  
  return recommendations;
};

/**
 * Get a formatted list of content by type
 * @param {string} type - Content type (meditations, music, games, breathing)
 * @returns {Array} Formatted content list
 */
export const getContentList = (type) => {
  switch(type) {
    case 'meditations':
      return meditations.map(item => ({
        title: item.title,
        description: `${item.duration} - ${item.level} - ${item.category}`,
        details: item.description
      }));
    case 'music':
      return music.map(item => ({
        title: item.title,
        description: `${item.artist} - ${item.duration} - ${item.category}`,
        details: item.description
      }));
    case 'games':
      return games.map(item => ({
        title: item.name,
        description: `${item.difficulty} - ${item.duration} - ${item.category}`,
        details: item.description
      }));
    case 'breathing':
      return breathingExercises.map(item => ({
        title: item.name,
        description: `${item.duration}`,
        details: item.description
      }));
    default:
      return [];
  }
}; 