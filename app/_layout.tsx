import React, { useState, useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeModal from "@/components/WelcomeModal";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <WelcomeModal visible={modalVisible} onClose={handleCloseModal} />
      </View>
    </ThemeProvider>
  );
}
