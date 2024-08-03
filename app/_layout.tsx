import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeModal from "@/components/WelcomeModal";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkUserAccepted = async () => {
      const userAccepted = await AsyncStorage.getItem("userAccepted");
      if (!userAccepted) {
        setModalVisible(true);
      } else {
        SplashScreen.hideAsync();
      }
    };

    if (loaded) {
      checkUserAccepted();
    }
  }, [loaded]);

  const handleCloseModal = () => {
    setModalVisible(false);
    SplashScreen.hideAsync();
  };

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#151718" }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <WelcomeModal visible={modalVisible} onClose={handleCloseModal} />
    </View>
  );
}
