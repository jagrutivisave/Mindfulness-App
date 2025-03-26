import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import Dashboard from "./screens/Dashboard";
import ChatbotScreen from "./screens/ChatbotScreen";
import MeditationScreen from "./screens/MeditationScreen";
import MeditationPlayer from "./screens/MeditationPlayer";
import GamesScreen from "./screens/GamesScreen";
import ProfileScreen from "./screens/ProfileScreen";
// import SelfHelpExercisesScreen from "./screens/SelfHelpExercisesScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4c669f',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Chatbot" component={ChatbotScreen} />
          <Stack.Screen name="Meditation" component={MeditationScreen} />
          <Stack.Screen name="MeditationPlayer" component={MeditationPlayer} />
          <Stack.Screen name="Games" component={GamesScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          {/* <Stack.Screen name="SelfHelpExercises" component={SelfHelpExercisesScreen} />  */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
