import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../Style/GlobalStyles";

const Home = ({ userType }) => {
  const [userName, setUserName] = useState("");
  const [type, setType] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://sapi.cicil.biz.id:8443/kancil/user/oauth2/apis/v1/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("🚀 ~ fetchProfile ~ data:", data);
      setUserName(data.data.fullName);
      setType(data.data.userType);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userType");
    await AsyncStorage.removeItem("tokenExpiration");

    navigation.replace("Login");
  };
  const userTypeId = (id) => {
    if (id === 1) {
      return "Borrower";
    } else if (id === 2) {
      return "Lender";
    } else if (id === 3) {
      return "Lender Institution";
    } else if (id === 4) {
      return "Borrower Institution";
    } else {
      return "";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Welcome, {userTypeId(type)}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centered}>
        <Text style={styles.centeredText}>Hello, {userName}!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    fontSize: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: Color.oRANGE50,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export const LenderHome = () => <Home userType="Lender" />;
export const BorrowerHome = () => <Home userType="Borrower" />;
