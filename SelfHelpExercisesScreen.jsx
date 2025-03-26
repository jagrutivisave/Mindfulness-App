import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const SelfHelpExercisesScreen = () => {
  const [mood, setMood] = useState(null);
  const [goal, setGoal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // OpenAI API Call for AI Suggestions
  const getSuggestions = async () => {
    if (!mood || !goal) return alert("Please select a mood and set a goal!");

    setLoading(true);
    try {
      const response = await fetch("http://192.168.3.186:5000/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${YOUR_OPENAI_API_KEY}`, // Replace with your OpenAI API Key
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ 
            role: "system", 
            content: `Suggest three self-help exercises for a person feeling ${mood} who wants to achieve: ${goal}`
          }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setSuggestions(data.choices[0].message.content.split("\n"));
      } else {
        alert("No suggestions received. Try again!");
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      alert("Failed to get suggestions. Try again later.");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Self-Help Exercises</Text>

      {/* Mood Selection */}
      <Text style={styles.label}>How are you feeling today?</Text>
      <DropDownPicker
        items={[
          { label: "Happy 😊", value: "happy" },
          { label: "Sad 😢", value: "sad" },
          { label: "Anxious 😟", value: "anxious" },
          { label: "Angry 😡", value: "angry" },
          { label: "Stressed 😰", value: "stressed" },
        ]}
        defaultValue={mood}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdown}
        onChangeItem={(item) => setMood(item.value)}
      />

      {/* Goal Input */}
      <Text style={styles.label}>What is your goal today?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your goal"
        value={goal}
        onChangeText={(text) => setGoal(text)}
      />

      {/* Get AI Suggestions */}
      <TouchableOpacity style={styles.button} onPress={getSuggestions} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get Suggestions</Text>}
      </TouchableOpacity>

      {/* Display AI Suggestions */}
      <View style={styles.suggestionsContainer}>
        {suggestions.length > 0 && <Text style={styles.label}>Recommended Exercises:</Text>}
        {suggestions.map((exercise, index) => (
          <Text key={index} style={styles.suggestion}>{exercise}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#F0F8FF", padding: 20, alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  dropdownContainer: { width: "100%", marginBottom: 20 },
  dropdown: { backgroundColor: "#ffffff" },
  input: { width: "100%", padding: 12, borderWidth: 1, borderRadius: 10, marginTop: 10, backgroundColor: "#fff" },
  button: { backgroundColor: "#4CAF50", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  suggestionsContainer: { marginTop: 20, width: "100%", alignItems: "center" },
  suggestion: { backgroundColor: "#E3F2FD", padding: 10, borderRadius: 8, marginTop: 5, textAlign: "center", width: "100%" },
});

export default SelfHelpExercisesScreen