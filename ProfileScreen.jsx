import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  ScrollView,
  Switch,
  Dimensions,
  Animated,
  SafeAreaView
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.92;

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [editing, setEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [progressValue] = useState(new Animated.Value(0));
  const [showProgress, setShowProgress] = useState(true);

  const stats = [
    { label: "Meditation", value: "24 hrs", icon: "🧘" },
    { label: "Completed", value: "18 sessions", icon: "✅" },
    { label: "Streak", value: "7 days", icon: "🔥" }
  ];

  const achievements = [
    { id: 1, name: "Early Bird", description: "Complete a morning meditation for 5 days", icon: "🌅", earned: true },
    { id: 2, name: "Focus Master", description: "Complete a 20-minute session", icon: "🧠", earned: true },
    { id: 3, name: "Consistency", description: "Maintain a 7-day streak", icon: "📆", earned: true },
    { id: 4, name: "Inner Peace", description: "Complete all beginner meditations", icon: "☮️", earned: false },
    { id: 5, name: "Mindfulness Guru", description: "Practice for 30 days", icon: "🏆", earned: false }
  ];

  const goals = [
    { id: 1, name: "Meditate for 10 minutes daily", progress: 70 },
    { id: 2, name: "Complete anxiety program", progress: 45 },
    { id: 3, name: "Practice deep breathing", progress: 90 }
  ];

  useFocusEffect(
    React.useCallback(() => {
      // Set header options
      navigation.setOptions({
        headerTitle: "My Profile",
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
    }, [navigation])
  );

  useEffect(() => {
    // Animate the progress bars when they're shown
    if (showProgress) {
      Animated.timing(progressValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false
      }).start();
    }
  }, [progressValue, showProgress]);

  const handleSave = () => {
    setEditing(false);
    Alert.alert("Profile Updated", "Your profile information has been updated successfully!");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace("Login") },
      ]
    );
  };

  const renderAchievements = () => {
    return achievements.map((achievement) => (
      <View key={achievement.id} style={[styles.achievementCard, !achievement.earned && styles.achievementLocked]}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementContent}>
          <Text style={styles.achievementName}>{achievement.name}</Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
        </View>
        {!achievement.earned && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>
    ));
  };

  const renderGoals = () => {
    return goals.map((goal) => {
      const progressWidth = progressValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', `${goal.progress}%`]
      });

      return (
        <View key={goal.id} style={styles.goalItem}>
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalText}>{goal.name}</Text>
            <Text style={styles.goalPercent}>{goal.progress}%</Text>
          </View>
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressWidth },
                goal.progress > 75 ? styles.progressHigh : 
                goal.progress > 40 ? styles.progressMedium : styles.progressLow
              ]}
            />
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <Image 
            source={require("../assets/profile.jpg")} 
            style={styles.profileImage} 
          />
          
          {editing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.email}>{email}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* My Progress Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Goals</Text>
            <TouchableOpacity onPress={() => setShowProgress(!showProgress)}>
              <Text style={styles.sectionAction}>
                {showProgress ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showProgress && (
            <View style={styles.goalsContainer}>
              {renderGoals()}
            </View>
          )}
        </View>

        {/* Achievements Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Text style={styles.badgeCount}>
              {achievements.filter(a => a.earned).length}/{achievements.length}
            </Text>
          </View>
          <View style={styles.achievementsContainer}>
            {renderAchievements()}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#ebebeb", true: "#a3c1ad" }}
              thumbColor={notificationsEnabled ? "#4CAF50" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#ebebeb", true: "#8f9bbc" }}
              thumbColor={darkModeEnabled ? "#4c669f" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Meditation Sounds</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#ebebeb", true: "#f5cba7" }}
              thumbColor={soundEnabled ? "#ff9800" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionLabel}>Privacy Settings</Text>
            <Text style={styles.optionAction}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionLabel}>Notification Preferences</Text>
            <Text style={styles.optionAction}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionLabel}>Change Password</Text>
            <Text style={styles.optionAction}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appVersion}>Mindfulness App v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2023 Mindfulness App</Text>
        </View>
      </ScrollView>
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
  headerSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 25,
    backgroundColor: "#4c669f",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#ffffff",
    marginBottom: 15,
  },
  infoContainer: {
    alignItems: "center",
  },
  editContainer: {
    width: "80%",
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
  },
  editButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4c669f",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionAction: {
    color: "#4c669f",
    fontWeight: "500",
  },
  badgeCount: {
    color: "#4c669f",
    fontWeight: "500",
  },
  goalsContainer: {
    marginTop: 5,
  },
  goalItem: {
    marginBottom: 15,
  },
  goalTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  goalText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  goalPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4c669f",
    marginLeft: 10,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressLow: {
    backgroundColor: "#ff9800",
  },
  progressMedium: {
    backgroundColor: "#03a9f4",
  },
  progressHigh: {
    backgroundColor: "#4CAF50",
  },
  achievementsContainer: {
    marginTop: 5,
  },
  achievementCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  achievementLocked: {
    borderLeftColor: "#ccc",
    opacity: 0.7,
  },
  achievementIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  achievementDescription: {
    fontSize: 12,
    color: "#666",
  },
  lockBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  lockIcon: {
    fontSize: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 16,
    color: "#444",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionLabel: {
    fontSize: 16,
    color: "#444",
  },
  optionAction: {
    fontSize: 18,
    color: "#bbb",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  appInfoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  appVersion: {
    fontSize: 12,
    color: "#999",
  },
  appCopyright: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  }
});

export default ProfileScreen;
