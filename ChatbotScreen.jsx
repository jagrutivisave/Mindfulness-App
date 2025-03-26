import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  Image,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  FlatList
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { setupDialogflow, sendToDialogflow } from "../services/dialogflowService";
import { analyzeText, getPersonalizedTip } from "../services/mentalHealthService";
import { formatMessage } from "../services/helpers";
import { 
  searchAppContent, 
  getRecommendations, 
  getContentList 
} from "../services/appContentService";

const { width, height } = Dimensions.get("window");

// Mental health-focused quick reply suggestions based on context
const quickReplies = {
  initial: [
    "I'm feeling anxious today",
    "Help me sleep better",
    "Breathing exercises",
    "Daily meditation tips"
  ],
  anxiety: [
    "Breathing techniques",
    "Quick meditation",
    "Grounding exercises",
    "Talk to a professional"
  ],
  sleep: [
    "Bedtime routine",
    "Relaxation techniques",
    "Sleep meditation",
    "Sleep sounds"
  ],
  meditation: [
    "Beginner meditation",
    "Guided meditation",
    "Mindfulness practice",
    "Deep focus"
  ],
  depression: [
    "Mood-lifting activities",
    "Self-care ideas",
    "Talk about depression",
    "Connect with others"
  ],
  stress: [
    "Stress reduction",
    "Work-life balance",
    "Relaxation techniques",
    "Time management"
  ],
  crisis: [
    "Crisis resources",
    "Grounding exercise",
    "Reasons to stay",
    "Contact support"
  ]
};

// Enhanced mental health chatbot responses
const mentalHealthResponses = {
  // Greetings
  "hi|hello|hey|greetings": {
    text: "Hello! I'm your mental health assistant. How are you feeling today?",
    suggestions: "initial"
  },
  "how are you|how are you doing": {
    text: "I'm here and ready to support you. More importantly, how are you doing today?",
    suggestions: "initial"
  },
  "thanks|thank you": {
    text: "You're welcome! I'm here anytime you need support with your mental wellbeing.",
    suggestions: "initial"
  },
  "bye|goodbye|see you": {
    text: "Take care of yourself. Remember, I'm here whenever you need to talk.",
    suggestions: "initial"
  },

  // Anxiety responses
  "anxious|anxiety|worried|panic|stress|stressed": {
    text: "I notice you're feeling anxious. Anxiety is a common experience. Would you like to try a breathing exercise to help calm your nervous system?",
    suggestions: "anxiety"
  },
  "breathing|breathe": {
    text: "Try this simple breathing technique: Breathe in for 4 counts, hold for 2, and exhale for 6. Would you like me to guide you through it?",
    suggestions: "anxiety"
  },
  "grounding": {
    text: "A helpful grounding exercise is the 5-4-3-2-1 technique. Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    suggestions: "anxiety"
  },

  // Depression responses
  "sad|depressed|depression|unhappy|low|down": {
    text: "I'm sorry to hear you're feeling low. Depression and sadness are normal emotions that everyone experiences. Would you like to explore some gentle activities that might help lift your mood?",
    suggestions: "depression"
  },
  "no motivation|can't get up|tired|exhausted": {
    text: "Starting small can help when motivation is low. Could you think of one tiny step you could take in the next 5 minutes? Even getting a glass of water counts.",
    suggestions: "depression"
  },

  // Sleep responses
  "sleep|insomnia|tired|rest|sleepy|awake": {
    text: "Sleep difficulties can really affect our mental well-being. Would you like some evidence-based tips for improving your sleep quality?",
    suggestions: "sleep"
  },
  "sleep hygiene|sleep better": {
    text: "Good sleep hygiene includes keeping a consistent schedule, avoiding screens before bed, creating a relaxing bedtime routine, and ensuring your sleeping environment is comfortable and dark.",
    suggestions: "sleep"
  },

  // Meditation responses
  "meditation|meditate|mindful|mindfulness": {
    text: "Meditation and mindfulness are powerful practices for mental health. Would you like to explore different meditation techniques that might work for you?",
    suggestions: "meditation"
  },
  "how to meditate|meditation technique": {
    text: "A simple way to start meditating is to focus on your breath. Find a comfortable position, close your eyes, and notice the sensation of breathing in and out. When your mind wanders, gently bring your attention back to your breath.",
    suggestions: "meditation"
  },

  // Crisis responses
  "suicide|kill myself|die|end it|not worth living|hurt myself|harm": {
    text: "I'm concerned about what you're sharing. If you're in crisis or having thoughts of harming yourself, please reach out to a crisis helpline immediately. In the US, you can text HOME to 741741 or call 988 to reach the Suicide & Crisis Lifeline.",
    suggestions: "crisis"
  }
};

// Custom Send Icon Component
const SendIcon = ({ color }) => {
  return (
    <View style={{ width: 20, height: 20 }}>
      <View style={[styles.sendIconContainer, { borderColor: color }]}>
        <View style={[styles.sendIconArrow, { borderColor: color }]} />
      </View>
    </View>
  );
};

const ChatbotScreen = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState("initial");
  const [typingAnimation] = useState(new Animated.Value(0));
  const [isActive, setIsActive] = useState(true);
  const [contentRecommendations, setContentRecommendations] = useState(null);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationOptions, setNavigationOptions] = useState([]);
  const scrollViewRef = useRef();
  const inputRef = useRef();

  // Set up header and status bar
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerTitle: "Mental Health Assistant",
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#fff',
        },
        headerStyle: {
          backgroundColor: '#4c669f',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
      });

      StatusBar.setBarStyle('light-content');
      
      return () => {
        StatusBar.setBarStyle('default');
      };
    }, [navigation])
  );

  useEffect(() => {
    initializeDialogflow();
  }, []);

  const initializeDialogflow = async () => {
    try {
      await setupDialogflow();
      const welcomeMessage = { 
        sender: "bot", 
        text: "Hi there! I'm your mental health assistant. How are you feeling today?",
        timestamp: new Date() 
      };
      setMessages([welcomeMessage]);
      animateTyping();
      setIsActive(true);
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Failed to connect to the mental health assistant. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  const animateTyping = () => {
    typingAnimation.setValue(0);
    Animated.timing(typingAnimation, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handleMentalHealthInput = (userText) => {
    // Check for bad words
    const badWords = ["fuck", "bad", "stupid", "useless", "bitch", "crazy", "nonsense"];
    if (badWords.some(word => userText.toLowerCase().includes(word))) {
      return {
        text: "I understand you may be frustrated, but please try to express your feelings without using harmful language. How else can I support you today?",
        suggestions: "initial"
      };
    }

    // Check for content requests (music, meditation, games, etc.)
    const lowerText = userText.toLowerCase();
    
    // Check for navigation keywords and set navigation options
    const navOptions = [];
    
    if (lowerText.includes('meditation') || lowerText.match(/meditate|mindfulness session/i)) {
      navOptions.push({
        title: "Go to Meditations",
        screen: "Meditation",
        icon: "🧘"
      });
    }
    
    if (lowerText.includes('game') || lowerText.match(/play game|games|puzzle/i)) {
      navOptions.push({
        title: "Go to Games",
        screen: "Games",
        icon: "🎮"
      });
    }
    
    if (lowerText.includes('music') || lowerText.match(/song|play music|listen/i)) {
      navOptions.push({
        title: "Music Library",
        screen: "Music",
        icon: "🎵",
        action: () => {
          Alert.alert(
            "Music Library",
            "In a complete app, this would take you to the music library.",
            [{ text: "OK" }]
          );
        }
      });
    }
    
    // If we found navigation options, set them to display
    if (navOptions.length > 0) {
      setNavigationOptions(navOptions);
      setShowNavigationButtons(true);
    }
    
    if (lowerText.includes('music') || lowerText.match(/song|play music|listen/i)) {
      // Return something to trigger the dialogflow content response
      return {
        text: "I'd be happy to suggest some music. Let me find the right options for you.",
        suggestions: "initial",
        contentRequest: true,
        contentType: "music"
      };
    }
    
    if (lowerText.includes('meditation') || lowerText.match(/meditate|mindfulness session/i)) {
      return {
        text: "I'd be happy to suggest some meditation sessions. Let me find the right options for you.",
        suggestions: "initial",
        contentRequest: true,
        contentType: "meditation"
      };
    }
    
    if (lowerText.includes('game') || lowerText.match(/play game|games|puzzle/i)) {
      return {
        text: "I'd be happy to suggest some mindfulness games. Let me find the right options for you.",
        suggestions: "initial",
        contentRequest: true,
        contentType: "games"
      };
    }

    // Analyze the text for mental health concerns
    const analysis = analyzeText(userText);
    
    // If crisis is detected, this takes priority
    if (analysis.hasCrisis) {
      return {
        text: analysis.message || "I'm concerned about what you're saying. If you're in crisis, please reach out to a professional immediately. Would you like me to share some crisis resources?",
        suggestions: "crisis"
      };
    }

    // Check for pattern matches in our response database
    for (const pattern in mentalHealthResponses) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(userText)) {
        return mentalHealthResponses[pattern];
      }
    }

    // If no pattern matches but we detected concerns, provide a tailored response
    if (analysis.concerns.length > 0 && analysis.concerns[0] !== 'general') {
      const primaryConcern = analysis.concerns[0];
      const tip = getPersonalizedTip(primaryConcern);
      return {
        text: `It sounds like you might be dealing with some ${primaryConcern}-related concerns. ${tip} Would you like to explore more resources for ${primaryConcern}?`,
        suggestions: primaryConcern
      };
    }

    // Default fallback response
    return {
      text: "I'm here to listen and support you with your mental health. Could you tell me more about how you're feeling today?",
      suggestions: "initial"
    };
  };

  const handleContentRecommendation = (contentType, userQuery) => {
    // Get appropriate content based on the type and query
    let result;
    if (contentType === "music") {
      result = getContentList("music");
    } else if (contentType === "meditation") {
      result = getContentList("meditations");
    } else if (contentType === "games") {
      result = getContentList("games");
    } else if (contentType === "breathing") {
      result = getContentList("breathing");
    } else {
      // Handle general recommendations based on mood/needs
      if (userQuery.toLowerCase().includes("relax") || userQuery.toLowerCase().includes("stress")) {
        result = getRecommendations("mood", "relaxation");
      } else if (userQuery.toLowerCase().includes("sleep")) {
        result = getRecommendations("mood", "sleep");
      } else if (userQuery.toLowerCase().includes("focus")) {
        result = getRecommendations("mood", "focus");
      } else {
        // Default recommendations
        result = {
          meditations: getContentList("meditations").slice(0, 2),
          music: getContentList("music").slice(0, 2)
        };
      }
    }
    
    setContentRecommendations(result);
    return result;
  };

  const navigateToContent = (contentType, itemId) => {
    // Navigate to appropriate screen based on content type
    if (contentType === "meditation") {
      navigation.navigate("Meditation", { selectedItemId: itemId });
    } else if (contentType === "game") {
      navigation.navigate("Games", { selectedItemId: itemId });
    } else if (contentType === "music") {
      // Since we don't have a music screen, we could create a modal or alert
      Alert.alert(
        "Music Selection",
        "In a complete app, this would take you to the music player for the selected track.",
        [{ text: "OK" }]
      );
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = formatMessage(message.trim(), "user");
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      // First process with our mental health logic
      const response = handleMentalHealthInput(userMessage.text);
      
      // If this is a content request, also get dialogflow's interpretation
      if (response.contentRequest) {
        // Pass to dialogflow for a more sophisticated response
        const dialogflowResponse = await sendToDialogflow(userMessage.text);
        
        // Simulate typing delay for a more natural interaction
        setTimeout(() => {
          const botMessage = formatMessage(dialogflowResponse.text, "bot");
          setMessages(prev => [...prev, botMessage]);
          
          // Set content recommendations if available from dialogflow
          if (dialogflowResponse.contentType) {
            handleContentRecommendation(dialogflowResponse.contentType, userMessage.text);
          }
          
          setCurrentSuggestions(dialogflowResponse.suggestions ? "dialogflow" : "initial");
          if (dialogflowResponse.suggestions) {
            setQuickReplies(prevReplies => ({
              ...prevReplies,
              dialogflow: dialogflowResponse.suggestions
            }));
          }
          
          setLoading(false);
          animateTyping();
        }, 1500);
      } else {
        // Regular mental health response
        setTimeout(() => {
          const botMessage = formatMessage(response.text, "bot");
          setMessages(prev => [...prev, botMessage]);
          setCurrentSuggestions(response.suggestions || "initial");
          setContentRecommendations(null); // Clear any previous recommendations
          setLoading(false);
          animateTyping();
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to get response from the mental health assistant.");
    }
  };

  // Add quick reply state to handle dialogflow suggestions
  const [quickReplies, setQuickReplies] = useState({
    initial: [
      "I'm feeling anxious today",
      "Help me sleep better",
      "Breathing exercises",
      "Daily meditation tips"
    ],
    anxiety: [
      "Breathing techniques",
      "Quick meditation",
      "Grounding exercises",
      "Talk to a professional"
    ],
    sleep: [
      "Bedtime routine",
      "Relaxation techniques",
      "Sleep meditation",
      "Sleep sounds"
    ],
    meditation: [
      "Beginner meditation",
      "Guided meditation",
      "Mindfulness practice",
      "Deep focus"
    ],
    depression: [
      "Mood-lifting activities",
      "Self-care ideas",
      "Talk about depression",
      "Connect with others"
    ],
    stress: [
      "Stress reduction",
      "Work-life balance",
      "Relaxation techniques",
      "Time management"
    ],
    crisis: [
      "Crisis resources",
      "Grounding exercise",
      "Reasons to stay",
      "Contact support"
    ],
    dialogflow: [] // This will be populated dynamically
  });

  // Handle quick reply selection
  const handleQuickReply = (reply) => {
    setMessage(reply);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  // Render content recommendations
  const renderContentRecommendations = () => {
    if (!contentRecommendations) return null;
    
    return (
      <View style={styles.contentRecommendationsContainer}>
        <Text style={styles.contentRecommendationsTitle}>Recommended Content:</Text>
        
        {contentRecommendations.meditations && contentRecommendations.meditations.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.contentSectionTitle}>Meditations</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {contentRecommendations.meditations.slice(0, 3).map((item, index) => (
                <TouchableOpacity 
                  key={`meditation-${index}`}
                  style={styles.contentCard}
                  onPress={() => navigateToContent("meditation", item.id)}
                >
                  <Text style={styles.contentCardTitle}>{item.title}</Text>
                  <Text style={styles.contentCardDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {contentRecommendations.music && contentRecommendations.music.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.contentSectionTitle}>Music</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {contentRecommendations.music.slice(0, 3).map((item, index) => (
                <TouchableOpacity 
                  key={`music-${index}`}
                  style={styles.contentCard}
                  onPress={() => navigateToContent("music", item.id)}
                >
                  <Text style={styles.contentCardTitle}>{item.title}</Text>
                  <Text style={styles.contentCardDescription}>
                    {item.artist} • {item.duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {contentRecommendations.games && contentRecommendations.games.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.contentSectionTitle}>Games</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {contentRecommendations.games.slice(0, 3).map((item, index) => (
                <TouchableOpacity 
                  key={`game-${index}`}
                  style={styles.contentCard}
                  onPress={() => navigateToContent("game", item.id)}
                >
                  <Text style={styles.contentCardTitle}>{item.name}</Text>
                  <Text style={styles.contentCardDescription}>
                    {item.difficulty} • {item.duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {contentRecommendations.breathing && contentRecommendations.breathing.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.contentSectionTitle}>Breathing Exercises</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {contentRecommendations.breathing.slice(0, 3).map((item, index) => (
                <TouchableOpacity 
                  key={`breathing-${index}`}
                  style={styles.contentCard}
                  onPress={() => {
                    const botMessage = formatMessage(item.description, "bot");
                    setMessages(prev => [...prev, botMessage]);
                  }}
                >
                  <Text style={styles.contentCardTitle}>{item.name}</Text>
                  <Text style={styles.contentCardDescription}>{item.duration}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTypingIndicator = () => {
    const translateX = typingAnimation.interpolate({
      inputRange: [0, 0.3, 0.6, 1],
      outputRange: [0, 5, 10, 0]
    });

    return (
      <Animated.View 
        style={[
          styles.typingIndicator,
          { transform: [{ translateX }] }
        ]}
      >
        <View style={styles.typingDot} />
        <View style={styles.typingDot} />
        <View style={styles.typingDot} />
      </Animated.View>
    );
  };

  // Render navigation buttons based on user query
  const renderNavigationButtons = () => {
    if (!showNavigationButtons || navigationOptions.length === 0) return null;
    
    return (
      <View style={styles.navigationButtonsContainer}>
        <Text style={styles.navigationTitle}>Quick Access:</Text>
        <View style={styles.navigationButtonsRow}>
          {navigationOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navigationButton}
              onPress={() => {
                if (option.action) {
                  option.action();
                } else {
                  navigation.navigate(option.screen);
                }
                setShowNavigationButtons(false);
              }}
            >
              <Text style={styles.navigationButtonIcon}>{option.icon}</Text>
              <Text style={styles.navigationButtonText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusTitle}>Bot Status:</Text>
          <Text style={[styles.statusValue, isActive ? styles.statusActive : styles.statusInactive]}>
            {isActive ? "Active" : "Not Active"}
          </Text>
        </View>

        <ScrollView 
          ref={scrollViewRef} 
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Welcome background image */}
          {messages.length <= 2 && (
            <View style={styles.welcomeImageContainer}>
              <Image 
                source={require('../assets/meditation1.jpg')} 
                style={styles.welcomeImage} 
                resizeMode="cover"
              />
              <View style={styles.welcomeOverlay}>
                <Text style={styles.welcomeText}>
                  Mental Health Assistant
                </Text>
                <Text style={styles.welcomeSubtext}>
                  I'm here to support your mental wellbeing and suggest app content
                </Text>
              </View>
            </View>
          )}

          {messages.map((msg, index) => (
            <View key={index} style={styles.messageRow}>
              {/* Bot avatar */}
              {msg.sender === "bot" && (
                <View style={styles.avatarContainer}>
                  <Image 
                    source={require('../assets/meditation1.jpg')} 
                    style={styles.avatar} 
                  />
                </View>
              )}
              
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === "user" ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={[
                  styles.messageText,
                  msg.sender === "user" ? styles.userMessageText : styles.botMessageText,
                ]}>
                  {msg.text}
                </Text>
                <Text style={styles.timestamp}>
                  {formatTime(msg.timestamp)}
                </Text>
              </View>

              {/* Spacer for user messages to align right */}
              {msg.sender === "user" && <View style={styles.avatarContainer} />}
            </View>
          ))}
          
          {/* Display navigation buttons */}
          {renderNavigationButtons()}
          
          {/* Display content recommendations after messages */}
          {contentRecommendations && renderContentRecommendations()}
          
          {loading && (
            <View style={styles.messageRow}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={require('../assets/meditation1.jpg')} 
                  style={styles.avatar} 
                />
              </View>
              <View style={[styles.messageBubble, styles.botMessage, styles.typingBubble]}>
                {renderTypingIndicator()}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick replies */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickRepliesContainer}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {quickReplies[currentSuggestions].map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={(text) => {
              setMessage(text);
              // Hide navigation buttons when user starts typing a new message
              if (showNavigationButtons) {
                setShowNavigationButtons(false);
              }
            }}
            onSubmitEditing={sendMessage}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!message.trim() || loading}
          >
            <SendIcon color={message.trim() ? "#fff" : "#ccc"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  statusTitle: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusActive: {
    color: '#4CAF50',
  },
  statusInactive: {
    color: '#F44336',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 15,
    paddingBottom: 20,
  },
  welcomeImageContainer: {
    height: 200,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  welcomeImage: {
    width: '100%',
    height: '100%',
  },
  welcomeOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtext: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    marginRight: 8,
    marginLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: width * 0.65,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4c669f",
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
    opacity: 0.7,
    color: '#ccc',
  },
  typingIndicator: {
    flexDirection: 'row',
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'center', 
    height: 20,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4c669f',
    opacity: 0.6,
  },
  quickRepliesContainer: {
    maxHeight: 60,
    backgroundColor: '#f0f2f5',
    borderTopWidth: 1,
    borderColor: '#e1e8ed',
  },
  quickRepliesContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  quickReplyButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickReplyText: {
    color: '#4c669f',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#e1e8ed",
    backgroundColor: "#fff",
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 12,
    paddingTop: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 24,
    marginRight: 10,
    maxHeight: 100,
    minHeight: 46,
  },
  sendButton: {
    height: 46,
    width: 46,
    backgroundColor: "#4c669f",
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#f0f2f5",
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  // Custom send icon styles
  sendIconContainer: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }]
  },
  sendIconArrow: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: '45deg' }]
  },
  contentRecommendationsContainer: {
    marginVertical: 15,
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  contentRecommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c669f',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  contentSection: {
    marginBottom: 15,
  },
  contentSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  contentCard: {
    width: 170,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  contentCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  contentCardDescription: {
    fontSize: 12,
    color: '#666',
  },
  navigationButtonsContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f0f4ff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d0d9ff',
  },
  navigationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4c669f',
    marginBottom: 10,
  },
  navigationButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  navigationButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navigationButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  navigationButtonText: {
    color: '#4c669f',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default ChatbotScreen;
