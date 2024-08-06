import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import { strings } from "../locales/strings";

// Função para abrir o mapa e buscar hemocentros
const buscarBancos = () => {
  const url = Platform.select({
    ios: "maps:0,0?q=hemocentro",
    android: "geo:0,0?q=hemocentro",
  });
  if (url) {
    Linking.openURL(url);
  } else {
    Alert.alert("Não foi possível determinar a URL específica da plataforma");
  }
};

const InfoBox = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.infoBox}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.infoBoxHeader}
      >
        <Text style={styles.infoBoxTitle}>{title}</Text>
        <Text>{isExpanded ? "▲" : "▼"}</Text>
      </Pressable>
      {isExpanded && <Text style={styles.infoBoxContent}>{content}</Text>}
    </View>
  );
};

export default function TabThreeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.secao}>
        <Text style={styles.label}>Hemocentros próximos</Text>
        <Pressable style={styles.button} onPress={buscarBancos}>
          <Text style={styles.buttonText}>{strings.buttons.findBloodBank}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  secao: {
    margin: 20,
  },
  label: {
    fontSize: 20,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  infoBox: {
    width: "90%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 5,
  },
  infoBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1E1E1E",
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  infoBoxContent: {
    padding: 10,
    color: "white",
  },
});
