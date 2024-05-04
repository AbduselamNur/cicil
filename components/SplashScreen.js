import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../Style/GlobalStyles";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (await tokenIsValid(token)) {
        const userType = await AsyncStorage.getItem("userType");
        navigation.replace(
          userType === "Lender" ? "LenderHome" : "BorrowerHome"
        );
      } else {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userType");
        await AsyncStorage.removeItem("tokenExpiration");
        navigation.replace("Login");
      }
    };

    checkToken();
  }, []);

  const tokenIsValid = async (token) => {
    if (!token) {
      return false;
    } else if (await isTokenExpired()) {
      return false;
    } else {
      return true;
    }
  };

  const isTokenExpired = async () => {
    const expirationTimestamp = await AsyncStorage.getItem("tokenExpiration");
    const expired =
      expirationTimestamp && Date.now() > parseInt(expirationTimestamp);
    if (expired) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userType");
      await AsyncStorage.removeItem("tokenExpiration");
    }
    return expired;
  };

  return (
    <ImageBackground
      source={require("../assets/splash.png")}
      style={styles.container}
    >
      <ActivityIndicator size="large" color={Color.oRANGE50} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;
