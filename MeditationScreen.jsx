import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Dimensions, 
  ImageBackground,
  Animated,
  StatusBar,
  SafeAreaView,
  TextInput
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

// Enhanced meditation data
const meditationSessions = [
  { 
    id: "1", 
    title: "10-Minute Relaxation", 
    description: "A short session to help you relax and reset during a busy day",
    duration: "10 min", 
    category: "relaxation",
    level: "Beginner",
    plays: 1243,
    rating: 4.8,
    isFeatured: true,
    image: require("../assets/meditation1.jpg") 
  },
  { 
    id: "2", 
    title: "Deep Breathing", 
    description: "Learn proper breathing techniques to calm your nervous system",
    duration: "15 min", 
    category: "breathing",
    level: "All Levels",
    plays: 856,
    rating: 4.7,
    isFeatured: true,
    image: require("../assets/meditation2.jpg") 
  },
  { 
    id: "3", 
    title: "Mindfulness Meditation", 
    description: "Practice present moment awareness with guided mindfulness techniques",
    duration: "20 min", 
    category: "mindfulness",
    level: "Intermediate",
    plays: 1567,
    rating: 4.9,
    isFeatured: true,
    image: require("../assets/meditation3.jpg") 
  },
  { 
    id: "4", 
    title: "Stress Relief", 
    description: "Release tension and worry with this calming guided meditation",
    duration: "10 min", 
    category: "stress",
    level: "Beginner",
    plays: 2143,
    rating: 4.6,
    isFeatured: false,
    image: require("../assets/meditation4.jpg") 
  },
  { 
    id: "5", 
    title: "Sleep Better", 
    description: "Gentle meditation to help you fall asleep naturally and peacefully",
    duration: "30 min", 
    category: "sleep",
    level: "All Levels",
    plays: 3421,
    rating: 4.9,
    isFeatured: false,
    image: require("../assets/meditation1.jpg") 
  },
  { 
    id: "6", 
    title: "Morning Energizer", 
    description: "Start your day with positivity and intention",
    duration: "8 min", 
    category: "morning",
    level: "Beginner",
    plays: 987,
    rating: 4.5,
    isFeatured: false,
    image: require("../assets/meditation2.jpg") 
  },
  { 
    id: "7", 
    title: "Body Scan Relaxation", 
    description: "Systematically release tension throughout your body",
    duration: "15 min", 
    category: "relaxation",
    level: "Intermediate",
    plays: 1456,
    rating: 4.7,
    isFeatured: false,
    image: require("../assets/meditation3.jpg") 
  },
  { 
    id: "8", 
    title: "Gratitude Practice", 
    description: "Cultivate appreciation and positive emotions",
    duration: "12 min", 
    category: "mindfulness",
    level: "All Levels",
    plays: 1230,
    rating: 4.8,
    isFeatured: false,
    image: require("../assets/meditation4.jpg") 
  },
];

// Meditation categories
const categories = [
  { id: "all", name: "All" },
  { id: "relaxation", name: "Relaxation" },
  { id: "breathing", name: "Breathing" },
  { id: "mindfulness", name: "Mindfulness" },
  { id: "sleep", name: "Sleep" },
  { id: "stress", name: "Stress Relief" },
  { id: "morning", name: "Morning" },
];

// Mood-based recommendations
const moods = [
  { id: "stressed", emoji: "😓", name: "Stressed" },
  { id: "anxious", emoji: "😰", name: "Anxious" },
  { id: "tired", emoji: "😴", name: "Tired" },
  { id: "sad", emoji: "😔", name: "Sad" },
  { id: "unfocused", emoji: "🤔", name: "Unfocused" },
  { id: "calm", emoji: "😌", name: "Calm" },
];

// User progress data
const userProgress = {
  streak: 5,
  minutesMeditated: 137,
  lastSession: "Yesterday",
  sessionsCompleted: 12,
  progress: 68
};

const MeditationScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredSessions, setFilteredSessions] = useState(meditationSessions);
  const [selectedMood, setSelectedMood] = useState(null);
  const [featuredScrollX] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState("");
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useFocusEffect(
    React.useCallback(() => {
      // Set header options
      navigation.setOptions({
        headerTitle: "Meditation",
        headerStyle: {
          backgroundColor: '#4c669f',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      });
      
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: userProgress.progress / 100,
        duration: 1500,
        useNativeDriver: false
      }).start();
      
      // Set status bar style
      StatusBar.setBarStyle('light-content');
      
      return () => {
        // Reset when leaving screen
        StatusBar.setBarStyle('default');
      };
    }, [navigation, progressAnim])
  );
  
  // Update filtered sessions when category or search changes
  useEffect(() => {
    let filtered = meditationSessions;
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(session => session.category === selectedCategory);
    }
    
    // Apply mood filter if selected
    if (selectedMood) {
      // Simple mapping of moods to recommended categories
      const moodMap = {
        stressed: ["relaxation", "breathing"],
        anxious: ["breathing", "mindfulness"],
        tired: ["morning", "energizing"],
        sad: ["mindfulness", "gratitude"],
        unfocused: ["mindfulness", "breathing"],
        calm: ["meditation", "mindfulness"]
      };
      
      const recommendedCategories = moodMap[selectedMood] || [];
      if (recommendedCategories.length > 0) {
        filtered = filtered.filter(session => 
          recommendedCategories.includes(session.category)
        );
      }
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(query) ||
        session.description.toLowerCase().includes(query) ||
        session.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredSessions(filtered);
  }, [selectedCategory, selectedMood, searchQuery]);

  const startMeditation = (session) => {
    navigation.navigate("MeditationPlayer", { session });
  };
  
  const handleMoodSelect = (moodId) => {
    setSelectedMood(selectedMood === moodId ? null : moodId);
  };
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  const renderFeaturedItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    
    const scale = featuredScrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });
    
    const opacity = featuredScrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    });
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => startMeditation(item)}
      >
        <Animated.View
          style={[
            styles.featuredCard,
            { transform: [{ scale }], opacity },
          ]}
        >
          <ImageBackground
            source={item.image}
            style={styles.featuredImage}
            imageStyle={{ borderRadius: 16 }}
          >
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>Featured</Text>
              </View>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>{item.title}</Text>
                <Text style={styles.featuredDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                  <Text style={styles.levelText}>{item.level}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => startMeditation(item)}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.sessionImage} />
      <View style={styles.sessionContent}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <Text style={styles.sessionDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.sessionMeta}>
          <Text style={styles.sessionDuration}>{item.duration}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>My Journey</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {userProgress.streak} days</Text>
            </View>
          </View>
          
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProgress.minutesMeditated}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProgress.sessionsCompleted}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProgress.lastSession}</Text>
              <Text style={styles.statLabel}>Last Session</Text>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View 
                style={[
                  styles.progressBarFill, 
                  { width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    }) 
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {userProgress.progress}% toward weekly goal
            </Text>
          </View>
        </View>
      
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search meditations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      
        {/* How are you feeling? */}
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <View style={styles.moodContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {moods.map(mood => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodButton,
                  selectedMood === mood.id && styles.selectedMood
                ]}
                onPress={() => handleMoodSelect(mood.id)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodText,
                  selectedMood === mood.id && styles.selectedMoodText
                ]}>
                  {mood.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Meditations */}
        <Text style={styles.sectionTitle}>Featured Meditations</Text>
        <Animated.FlatList
          data={meditationSessions.filter(s => s.isFeatured)}
          keyExtractor={(item) => `featured-${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: featuredScrollX } } }],
            { useNativeDriver: true }
          )}
          renderItem={renderFeaturedItem}
        />

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderCategoryItem}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Filtered Meditations */}
        <View style={styles.sessionsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedMood 
              ? `Recommended for ${moods.find(m => m.id === selectedMood)?.name}`
              : selectedCategory === "all" 
                ? "All Meditations" 
                : `${categories.find(c => c.id === selectedCategory)?.name} Meditations`
            }
          </Text>
          {filteredSessions.length > 0 ? (
            filteredSessions.map(session => (
              <View key={session.id}>
                {renderSessionItem({ item: session })}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No meditations found</Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSelectedCategory("all");
                  setSelectedMood(null);
                  setSearchQuery("");
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  progressContainer: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  streakBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4c669f",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4c669f",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 5,
    color: "#333",
  },
  moodContainer: {
    marginLeft: 8,
    marginBottom: 20,
  },
  moodButton: {
    alignItems: "center",
    margin: 8,
    width: 80,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMood: {
    backgroundColor: "#4c669f",
  },
  moodEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  moodText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
  selectedMoodText: {
    color: "#fff",
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 6,
    paddingBottom: 8,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: 180,
    marginRight: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  featuredOverlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "space-between",
  },
  featuredBadge: {
    backgroundColor: "rgba(76, 102, 159, 0.9)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 12,
  },
  featuredBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  featuredContent: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  featuredDescription: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  levelText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  categoriesContainer: {
    marginVertical: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: "#4c669f",
  },
  categoryText: {
    color: "#555",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  sessionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  sessionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sessionImage: {
    width: 100,
    height: 100,
  },
  sessionContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionDuration: {
    color: "#4c669f",
    fontSize: 14,
    fontWeight: "500",
  },
  ratingContainer: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    color: "#ff9800",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "#4c669f",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  }
});

export default MeditationScreen;
