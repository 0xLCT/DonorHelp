import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { strings } from "../locales/strings";
import InfoBox from "../../components/InfoBox";

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
          <Text style={styles.label}>Perguntas frequentes</Text>
          <Text style={styles.labelsmall}>Antes da doação</Text>
          <InfoBox
            title="O que devo fazer antes da doação?"
            content="Antes da doação, descanse bem, alimente-se de forma saudável (evite alimentos gordurosos por pelo menos 3 horas) e hidrate-se bem."
          />
          <InfoBox
            title="Quem pode doar sangue?"
            content="Pessoas entre 16 e 69 anos, com peso acima de 50 kg e em boas condições de saúde. Menores de 18 anos precisam de consentimento dos responsáveis.."
          />
          <InfoBox
            title="Tenho que ficar de jejum?"
            content="Você não deve estar em jejum. Coma algo leve e evite alimentos gordurosos por pelo menos 3 horas antes da doação."
          />
          <Text style={styles.labelsmall}>Durante a doação</Text>
          <InfoBox
            title="O que devo fazer durante a doação?"
            content="Durante a doação, fique relaxado, siga as instruções do profissional, mantenha o braço imóvel e respire calmamente."
          />
          <InfoBox
            title="Quanto tempo dura uma doação?"
            content="A doação de sangue dura, em média, de 40 a 60 minutos, incluindo o processo de triagem e recuperação. A coleta em si leva cerca de 15 minutos."
          />
          <Text style={styles.labelsmall}>Depois da doação</Text>
          <InfoBox
            title="O que devo fazer depois da doação?"
            content="Após a doação, descanse por alguns minutos, beba líquidos, evite esforço físico por pelo menos 12 horas e mantenha uma alimentação saudável para ajudar na reposição do sangue."
          />
          <InfoBox
            title="Quando posso doar novamente?"
            content="Homens podem doar a cada 3 meses, até 4 vezes ao ano. Mulheres podem doar a cada 4 meses, até 3 vezes ao ano."
          />
          <InfoBox
            title="Quais os benefícios da doação?"
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
  labelsmall: {
    fontSize: 22,
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
});
