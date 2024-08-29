import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  Platform,
  ScrollView,
  Animated,
  StatusBar,
} from "react-native";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { strings } from "../locales/strings";

const buscarBancos = async () => {
  const url = Platform.select({
    ios: "maps:0,0?q=hemocentro",
    android: "geo:0,0?q=hemocentro",
  });

  if (url) {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível abrir o mapa. Por favor, tente novamente."
      );
    }
  } else {
    Alert.alert(
      "Erro",
      "Não foi possível determinar a URL específica da plataforma"
    );
  }
};

const InfoBox = ({ title, content }: { title: string; content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];

  const toggleExpand = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    Animated.spring(animatedHeight, {
      toValue,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, animatedHeight]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500], // Adjust this value based on your content
  });

  return (
    <View style={styles.infoBox}>
      <Pressable onPress={toggleExpand} style={styles.infoBoxHeader}>
        <Text style={styles.infoBoxTitle}>{title}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#BB86FC"
        />
      </Pressable>
      <Animated.View style={[styles.infoBoxContent, { maxHeight }]}>
        <Text style={styles.infoBoxText}>{content}</Text>
      </Animated.View>
    </View>
  );
};

export default function TabThreeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.secao}>
            <Text style={styles.label}>Hemocentros próximos</Text>
            <Pressable style={styles.button} onPress={buscarBancos}>
              <Ionicons
                name="search-outline"
                size={24}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>
                {strings.buttons.findBloodBank}
              </Text>
            </Pressable>
          </View>

          <InfoBox
            title="Quem pode doar sangue?"
            content="Pessoas entre 16 e 69 anos, pesando mais de 50kg, em boas condições de saúde."
          />
          <InfoBox
            title="Frequência de doação"
            content="Homens podem doar a cada 2 meses, até 4 vezes ao ano. Mulheres podem doar a cada 3 meses, até 3 vezes ao ano."
          />
          <InfoBox
            title="Benefícios da doação"
            content="Além de salvar vidas, a doação de sangue oferece um check-up de saúde gratuito e ajuda a renovar o sangue do doador."
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
  },
  secao: {
    width: "90%",
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 24,
    color: "#E0E0E0",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BB86FC",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#121212",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoBox: {
    width: "90%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  infoBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2C2C2C",
  },
  infoBoxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  infoBoxContent: {
    overflow: "hidden",
  },
  infoBoxText: {
    padding: 15,
    color: "#E0E0E0",
    fontSize: 16,
    lineHeight: 24,
  },
});
