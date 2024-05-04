import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./components/SplashScreen";
import Login from "./components/Login";
import { LenderHome, BorrowerHome } from "./components/Home";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { BackHandler } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const Stack = createStackNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        BackHandler.exitApp();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LenderHome" component={LenderHome} />
        <Stack.Screen name="BorrowerHome" component={BorrowerHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
