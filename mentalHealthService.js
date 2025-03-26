/**
 * Mental Health Service
 * Contains utilities for mental health assessments, resources, and recommendations
 */

// Mental health resources by category
export const mentalHealthResources = {
  anxiety: [
    {
      name: "Breathing Techniques",
      description: "Simple breathing exercises to reduce anxiety",
      type: "exercise",
      duration: "5 min",
    },
    {
      name: "Grounding Exercise",
      description: "5-4-3-2-1 sensory awareness technique",
      type: "exercise",
      duration: "3 min",
    },
    {
      name: "Progressive Muscle Relaxation",
      description: "Relieve tension through muscle relaxation",
      type: "exercise",
      duration: "10 min",
    }
  ],
  depression: [
    {
      name: "Mood Journal",
      description: "Track your mood patterns over time",
      type: "tool",
      duration: "ongoing",
    },
    {
      name: "Behavioral Activation",
      description: "Simple activities to boost your mood",
      type: "exercise",
      duration: "varies",
    },
    {
      name: "Self-Compassion Meditation",
      description: "Practice being kind to yourself",
      type: "meditation",
      duration: "10 min",
    }
  ],
  sleep: [
    {
      name: "Sleep Hygiene Tips",
      description: "Evidence-based practices for better sleep",
      type: "guide",
      duration: "5 min read",
    },
    {
      name: "Bedtime Meditation",
      description: "Gentle meditation to prepare for sleep",
      type: "meditation",
      duration: "15 min",
    },
    {
      name: "Sleep Journal",
      description: "Track sleep patterns to identify issues",
      type: "tool",
      duration: "ongoing",
    }
  ],
  stress: [
    {
      name: "Quick Stress Reducer",
      description: "Box breathing technique for immediate relief",
      type: "exercise",
      duration: "2 min",
    },
    {
      name: "Body Scan Meditation",
      description: "Release tension throughout your body",
      type: "meditation",
      duration: "15 min",
    },
    {
      name: "Stress Management Plan",
      description: "Create a personalized stress reduction strategy",
      type: "guide",
      duration: "20 min",
    }
  ],
  general: [
    {
      name: "Daily Mindfulness",
      description: "Simple mindfulness practices for everyday life",
      type: "guide",
      duration: "varies",
    },
    {
      name: "Gratitude Practice",
      description: "Cultivate appreciation for the positive aspects of life",
      type: "exercise",
      duration: "5 min",
    },
    {
      name: "Values Reflection",
      description: "Connect with what matters most to you",
      type: "exercise",
      duration: "15 min",
    }
  ]
};

// Crisis resources
export const crisisResources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    description: "24/7 support for anyone in suicidal crisis or emotional distress",
    website: "https://988lifeline.org/"
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "24/7 support via text message for any type of crisis",
    website: "https://www.crisistextline.org/"
  },
  {
    name: "SAMHSA National Helpline",
    number: "1-800-662-4357",
    description: "Treatment referral and information service for mental health and substance use disorders",
    website: "https://www.samhsa.gov/find-help/national-helpline"
  }
];

/**
 * Analyze text for potential mental health concerns
 * @param {string} text - The user's message
 * @returns {Object} - Analysis results with detected concerns and recommendations
 */
export const analyzeText = (text) => {
  const lowerText = text.toLowerCase();
  
  // Define patterns to match for different mental health concerns
  const patterns = {
    anxiety: ['anxious', 'anxiety', 'worry', 'worried', 'nervous', 'panic', 'stress', 'stressed', 'fear', 'afraid'],
    depression: ['depressed', 'depression', 'sad', 'sadness', 'hopeless', 'worthless', 'empty', 'numb', 'tired', 'exhausted'],
    sleep: ['sleep', 'insomnia', 'tired', 'fatigue', 'rest', 'awake', 'nightmare', 'dream'],
    crisis: ['suicide', 'kill myself', 'die', 'end it', 'no point', 'not worth living', 'hurt myself', 'self harm']
  };
  
  // Check for matches in each category
  const concerns = Object.keys(patterns).filter(concern => 
    patterns[concern].some(keyword => lowerText.includes(keyword))
  );
  
  // Crisis detection takes highest priority
  if (concerns.includes('crisis')) {
    return {
      hasCrisis: true,
      concerns,
      severity: 'high',
      crisisResources,
      recommendedResources: crisisResources,
      responseType: 'crisis',
      message: "I'm concerned about what you're sharing. If you're thinking about harming yourself, please reach out to a crisis resource immediately. Would you like me to share some crisis support options?"
    };
  }
  
  // If no specific concerns were detected
  if (concerns.length === 0) {
    return {
      hasCrisis: false,
      concerns: ['general'],
      severity: 'low',
      recommendedResources: mentalHealthResources.general,
      responseType: 'general',
      message: null
    };
  }
  
  // Get resources for the first detected concern
  const primaryConcern = concerns[0];
  
  return {
    hasCrisis: false,
    concerns,
    severity: concerns.length > 1 ? 'moderate' : 'low',
    recommendedResources: mentalHealthResources[primaryConcern] || mentalHealthResources.general,
    responseType: primaryConcern,
    message: null
  };
};

/**
 * Generate personalized mental health tips based on concern
 * @param {string} concern - The type of mental health concern
 * @returns {string} - A personalized tip
 */
export const getPersonalizedTip = (concern) => {
  const tips = {
    anxiety: [
      "Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7, and exhale for 8.",
      "Grounding can help with anxiety. Try naming 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      "When anxiety hits, try to identify and challenge catastrophic thinking patterns."
    ],
    depression: [
      "Even small movements can help - try taking a 5-minute walk or stretching.",
      "Set one small, achievable goal for today, and celebrate when you complete it.",
      "Connect with nature, even just looking at trees or plants can help improve mood."
    ],
    sleep: [
      "Try to maintain a consistent sleep schedule, even on weekends.",
      "Limit screen time at least one hour before bed to improve sleep quality.",
      "Create a relaxing bedtime routine to signal to your body that it's time to wind down."
    ],
    stress: [
      "Take short 'micro-breaks' throughout your day - even 30 seconds of deep breathing helps.",
      "Try progressive muscle relaxation by tensing and releasing each muscle group.",
      "Identify your stress triggers and develop specific strategies for each one."
    ],
    general: [
      "Practice mindfulness by fully focusing on a routine activity like eating or walking.",
      "Spend a few minutes each day writing down three things you're grateful for.",
      "Remember that your feelings are valid, even if they're uncomfortable."
    ]
  };
  
  const concernTips = tips[concern] || tips.general;
  return concernTips[Math.floor(Math.random() * concernTips.length)];
}; 