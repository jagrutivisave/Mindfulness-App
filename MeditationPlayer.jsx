import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import Sound from "react-native-sound";

// Set category to allow playback
Sound.setCategory("Playback");

const MeditationPlayer = ({ route, navigation }) => {
  const { session } = route.params;
  const [sound, setSound] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load the sound file only once
    const meditationSound = new Sound(
      require("../assets/meditation_audio.mp3"),
      (error) => {
        if (error) {
          console.log("Error loading sound:", error);
          return;
        }
        setSound(meditationSound);
      }
    );

    return () => {
      if (meditationSound) {
        meditationSound.release();
      }
    };
  }, []);

  const playSound = () => {
    if (!sound) {
      console.log("Sound not loaded yet.");
      return;
    }

    setLoading(true);

    sound.play((success) => {
      if (success) {
        console.log("Playback finished successfully");
      } else {
        console.log("Playback failed due to audio decoding errors");
      }
      setPlaying(false);
      setLoading(false);
    });

    setPlaying(true);
  };

  const stopSound = () => {
    if (sound) {
      sound.stop(() => {
        setPlaying(false);
        setLoading(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Meditation Image */}
      <Image source={require("../assets/meditation_image.jpg")} style={styles.image} />

      {/* Meditation Title */}
      <Text style={styles.title}>{session.title}</Text>

      {/* Play & Stop Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, playing && styles.activeButton]}
          onPress={playSound}
          disabled={playing || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>▶ Play</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={stopSound}>
          <Text style={styles.buttonText}>⏹ Stop</Text>
        </TouchableOpacity>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>🔙 Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "50%", // Covers half screen
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  activeButton: {
    backgroundColor: "#2E7D32",
  },
  backButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MeditationPlayer;
