import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Linking, 
  ScrollView, 
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  ImageBackground 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const SPACING = 10;

// Game data with expanded properties
const gamesList = [
  {
    id: "1",
    name: "Calm Puzzle",
    description: "Solve relaxing puzzles to clear your mind and reduce stress",
    image: require("../assets/game1.jpg"),
    category: "puzzle",
    rating: 4.8,
    difficulty: "Easy",
    duration: "5-10 min",
    benefits: ["Stress Relief", "Focus", "Cognitive Skills"],
    featured: true,
    link: "https://play.google.com/store/apps/details?id=com.calm.puzzle",
  },
  {
    id: "2",
    name: "Mindful Coloring",
    description: "Express yourself through colors while practicing mindfulness",
    image: require("../assets/game2.jpg"),
    category: "creative",
    rating: 4.6,
    difficulty: "Easy",
    duration: "Any time",
    benefits: ["Creativity", "Calm", "Expression"],
    featured: true,
    link: "https://play.google.com/store/apps/details?id=com.mindful.coloring",
  },
  {
    id: "3",
    name: "Relaxing Music Game",
    description: "Create beautiful melodies to help you unwind and relax",
    image: require("../assets/game3.jpg"),
    category: "music",
    rating: 4.7,
    difficulty: "Medium",
    duration: "10-15 min",
    benefits: ["Relaxation", "Creativity", "Auditory Skills"],
    featured: false,
    link: "https://play.google.com/store/apps/details?id=com.relax.music.game",
  },
  {
    id: "4",
    name: "Meditation Journey",
    description: "An interactive journey through guided meditation exercises",
    image: require("../assets/meditation1.jpg"),
    category: "meditation",
    rating: 4.9,
    difficulty: "Medium",
    duration: "15-20 min",
    benefits: ["Deep Relaxation", "Mindfulness", "Emotional Balance"],
    featured: true,
    link: "https://play.google.com/store/apps/details?id=com.meditation.journey",
  },
  {
    id: "5",
    name: "Mindful Maze",
    description: "Navigate peaceful mazes at your own pace to promote mindfulness",
    image: require("../assets/game1.jpg"),
    category: "puzzle",
    rating: 4.5,
    difficulty: "Medium",
    duration: "5-15 min",
    benefits: ["Concentration", "Patience", "Problem-solving"],
    featured: false,
    link: "https://play.google.com/store/apps/details?id=com.mindful.maze",
  },
  {
    id: "6",
    name: "Breath Pacer",
    description: "Follow the visual guides to regulate your breathing patterns",
    image: require("../assets/meditation1.jpg"),
    category: "breathing",
    rating: 4.8,
    difficulty: "Easy",
    duration: "3-5 min",
    benefits: ["Stress Reduction", "Better Breathing", "Relaxation"],
    featured: false,
    link: "https://play.google.com/store/apps/details?id=com.breath.pacer",
  },
];

// Available categories
const categories = [
  { id: "all", name: "All Games" },
  { id: "puzzle", name: "Puzzles" },
  { id: "creative", name: "Creative" },
  { id: "music", name: "Music" },
  { id: "meditation", name: "Meditation" },
  { id: "breathing", name: "Breathing" },
];

// Mock user data for achievements
const achievements = {
  gamesPlayed: 12,
  timeSpent: "3h 45m",
  favorites: 3,
  streak: 5
};

const GamesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredGames, setFilteredGames] = useState(gamesList);
  const [featuredScrollX] = useState(new Animated.Value(0));
  
  // Update filtered games when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredGames(gamesList);
    } else {
      setFilteredGames(gamesList.filter(game => game.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  useFocusEffect(
    React.useCallback(() => {
      // Set header options
      navigation.setOptions({
        headerTitle: "Mindfulness Games",
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
      
      // Set status bar style
      StatusBar.setBarStyle('light-content');
      
      return () => {
        // Reset when leaving screen
        StatusBar.setBarStyle('default');
      };
    }, [navigation])
  );

  const openGameLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
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
        onPress={() => openGameLink(item.link)}
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
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>{item.name}</Text>
                <Text style={styles.featuredDescription}>{item.description}</Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>★ {item.rating}</Text>
                  </View>
                  <Text style={styles.featuredDuration}>
                    {item.duration}
                  </Text>
                </View>
                <View style={styles.tagsContainer}>
                  {item.benefits.map((benefit, idx) => (
                    <View key={idx} style={styles.tagBadge}>
                      <Text style={styles.tagText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderGameItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => openGameLink(item.link)}
      activeOpacity={0.9}
    >
      <Image source={item.image} style={styles.gameImage} />
      <View style={styles.gameContent}>
        <Text style={styles.gameTitle}>{item.name}</Text>
        <Text style={styles.gameDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.gameMetaRow}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
          <Text style={styles.gameDuration}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{achievements.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{achievements.timeSpent}</Text>
            <Text style={styles.statLabel}>Time Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{achievements.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Featured Games */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Games</Text>
          <Animated.FlatList
            data={gamesList.filter(game => game.featured)}
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
        </View>

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

        {/* Game List */}
        <View style={styles.gameListContainer}>
          <Text style={styles.sectionTitle}>{
            selectedCategory === "all" 
              ? "All Games" 
              : `${categories.find(cat => cat.id === selectedCategory)?.name}`
          }</Text>
          <View style={styles.gameList}>
            {filteredGames.map(game => (
              <View key={game.id} style={{ width: "100%" }}>
                {renderGameItem({ item: game })}
              </View>
            ))}
          </View>
        </View>

        {/* Daily Challenge */}
        <View style={styles.challengeContainer}>
          <View style={styles.challengeCard}>
            <View style={styles.challengeLeft}>
              <Text style={styles.challengeTitle}>Daily Challenge</Text>
              <Text style={styles.challengeDescription}>
                Complete a 5-minute mindfulness puzzle today
              </Text>
              <TouchableOpacity style={styles.challengeButton}>
                <Text style={styles.challengeButtonText}>Start Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.challengeRight}>
              <View style={styles.challengeBadge}>
                <Text style={styles.challengeBadgeText}>+10 pts</Text>
              </View>
            </View>
          </View>
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
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4c669f",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 12,
    color: "#333",
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: 220,
    marginRight: SPACING,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  featuredOverlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  featuredContent: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    backgroundColor: "rgba(255, 193, 7, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  ratingText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
  featuredDuration: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagBadge: {
    backgroundColor: "rgba(76, 102, 159, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    color: "#666",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  gameListContainer: {
    marginTop: 10,
  },
  gameList: {
    paddingHorizontal: 16,
  },
  gameCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  gameImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    margin: 8,
  },
  gameContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  gameMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  difficultyBadge: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    color: "#333",
    fontSize: 11,
    fontWeight: "500",
  },
  gameDuration: {
    fontSize: 11,
    color: "#666",
  },
  challengeContainer: {
    marginHorizontal: 16,
    marginVertical: 15,
  },
  challengeCard: {
    flexDirection: "row",
    backgroundColor: "#4c669f",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  challengeLeft: {
    flex: 3,
  },
  challengeRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
  },
  challengeButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  challengeButtonText: {
    color: "#4c669f",
    fontWeight: "bold",
    fontSize: 14,
  },
  challengeBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  challengeBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default GamesScreen;
