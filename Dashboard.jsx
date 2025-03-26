import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  Animated
} from "react-native";

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function Dashboard({ navigation }) {
  const [breathing, setBreathing] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const breathAnim = React.useRef(new Animated.Value(1)).current;
  const [quote, setQuote] = useState({
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh"
  });

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace("Login") }
      ]
    );
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // This removes the back arrow
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#4c669f',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitle: "Welcome Back!",
      headerTitleStyle: {
        fontSize: 28,
        fontWeight: 'bold',
      },
    });
  }, [navigation]);
  

  // Breathing animation control
  useEffect(() => {
    if (breathing) {
      const breathingCycle = async () => {
        // Inhale
        setBreathingStep(1);
        Animated.timing(breathAnim, {
          toValue: 1.5,
          duration: 4000,
          useNativeDriver: true
        }).start();
        
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Hold
        setBreathingStep(2);
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Exhale
        setBreathingStep(3);
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true
        }).start();
        
        await new Promise(resolve => setTimeout(resolve, 4000));
      };
      
      breathingCycle();
      const interval = setInterval(breathingCycle, 12000);
      return () => clearInterval(interval);
    } else {
      setBreathingStep(0);
      Animated.timing(breathAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  }, [breathing]);

  const getBreathingText = () => {
    switch(breathingStep) {
      case 1: return "Inhale...";
      case 2: return "Hold...";
      case 3: return "Exhale...";
      default: return "Start Breathing";
    }
  };

  const features = [
    {
      id: 1,
      title: "AI Chatbot",
      icon: "🤖",
      description: "Talk to our AI therapist",
      route: "Chatbot",
      color: "#FF9800",
    },
    {
      id: 2,
      title: "Meditation",
      icon: "🧘",
      description: "Find your inner peace",
      route: "Meditation",
      color: "#3B82F6",
    },
    {
      id: 3,
      title: "Games",
      icon: "🎮",
      description: "Play relaxing games",
      route: "Games",
      color: "#4CAF50",
    },
    {
      id: 4,
      title: "Profile",
      icon: "👤",
      description: "Manage your account",
      route: "Profile",
      color: "#9C27B0",
    }
  ];

  const recommendedContent = [
    {
      id: 1,
      title: "Stress Relief Meditation",
      type: "Meditation",
      duration: "10 min",
      image: "🌿"
    },
    {
      id: 2,
      title: "Sleep Better Tonight",
      type: "Guide",
      duration: "5 min read",
      image: "🌙"
    },
    {
      id: 3,
      title: "Morning Energizer",
      type: "Meditation",
      duration: "8 min",
      image: "☀️"
    }
  ];

  const upcomingReminders = [
    {
      id: 1,
      title: "Evening Meditation",
      time: "8:00 PM",
      day: "Today"
    },
    {
      id: 2,
      title: "Weekly Progress Review",
      time: "10:00 AM",
      day: "Tomorrow"
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>How are you feeling today?</Text>
        <View style={styles.moodContainer}>
          {["😊", "😐", "😔", "😡"].map((emoji, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.moodButton}
              onPress={() => Alert.alert("Mood Tracked", "Your mood has been recorded!")}
            >
              <Text style={styles.moodEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>Minutes Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Goals Set</Text>
        </View>
      </View>

      {/* Features Grid - Moved up */}
      <Text style={styles.sectionTitle}>Features</Text>
      <View style={styles.featuresGrid}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[styles.featureCard, { backgroundColor: feature.color }]}
            onPress={() => navigation.navigate(feature.route)}
          >
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{quote.text}"</Text>
        <Text style={styles.quoteAuthor}>- {quote.author}</Text>
      </View>

      {/* Weekly Progress Tracker */}
      <Text style={styles.sectionTitle}>Your Weekly Progress</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '65%' }]} />
        </View>
        <Text style={styles.progressText}>65% of weekly goal completed</Text>
        <View style={styles.dayTracker}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <View 
                style={[
                  styles.dayDot, 
                  index < 5 ? styles.dayCompleted : null
                ]} 
              />
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Breathing Exercise */}
      <Text style={styles.sectionTitle}>Quick Breathing</Text>
      <View style={styles.breathingContainer}>
        <TouchableOpacity 
          style={styles.breathingButton}
          onPress={() => setBreathing(!breathing)}
        >
          <Animated.View 
            style={[
              styles.breathingCircle,
              { transform: [{ scale: breathAnim }] }
            ]}
          />
          <Text style={styles.breathingText}>{getBreathingText()}</Text>
        </TouchableOpacity>
      </View>

      {/* Recommended For You Section */}
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.recommendedScrollView}
      >
        {recommendedContent.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.recommendedCard}
            onPress={() => Alert.alert("Coming Soon", "This content will be available soon!")}
          >
            <Text style={styles.recommendedImage}>{item.image}</Text>
            <Text style={styles.recommendedTitle}>{item.title}</Text>
            <View style={styles.recommendedDetails}>
              <Text style={styles.recommendedType}>{item.type}</Text>
              <Text style={styles.recommendedDuration}>• {item.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Upcoming Schedule/Reminders */}
      <Text style={styles.sectionTitle}>Upcoming</Text>
      <View style={styles.remindersContainer}>
        {upcomingReminders.map(reminder => (
          <View key={reminder.id} style={styles.reminderItem}>
            <View style={styles.reminderTimeContainer}>
              <Text style={styles.reminderTime}>{reminder.time}</Text>
              <Text style={styles.reminderDay}>{reminder.day}</Text>
            </View>
            <View style={styles.reminderDivider} />
            <Text style={styles.reminderTitle}>{reminder.title}</Text>
          </View>
        ))}
        <TouchableOpacity 
          style={styles.addReminderButton}
          onPress={() => Alert.alert("Add Reminder", "Reminder functionality coming soon!")}
        >
          <Text style={styles.addReminderText}>+ Add Reminder</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Daily Tip</Text>
        <Text style={styles.tipsText}>
          Take a few deep breaths when feeling overwhelmed. It helps reduce stress and anxiety.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  welcomeSection: {
    backgroundColor: '#4c669f',
    padding: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  moodButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: -30,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '28%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  quoteContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quoteText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: 10,
  },
  progressContainer: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4c669f',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  dayTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginBottom: 5,
  },
  dayCompleted: {
    backgroundColor: '#4CAF50',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  breathingButton: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 102, 159, 0.3)',
    position: 'absolute',
  },
  breathingText: {
    fontSize: 14,
    color: '#4c669f',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: cardWidth,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  recommendedScrollView: {
    paddingLeft: 15,
  },
  recommendedCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendedImage: {
    fontSize: 40,
    marginBottom: 10,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recommendedDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedType: {
    fontSize: 12,
    color: '#666',
  },
  recommendedDuration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  remindersContainer: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reminderTimeContainer: {
    width: 70,
    alignItems: 'center',
  },
  reminderTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  reminderDay: {
    fontSize: 12,
    color: '#666',
  },
  reminderDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  reminderTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  addReminderButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 5,
  },
  addReminderText: {
    fontSize: 14,
    color: '#4c669f',
    fontWeight: 'bold',
  },
  tipsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  logoutButton: {
    marginRight: 15,
  },
  logoutText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
