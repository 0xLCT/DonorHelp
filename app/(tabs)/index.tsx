import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Alert,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import * as Calendar from "expo-calendar";
import DatePicker from "../../components/DatePicker";
import { strings } from "../locales/strings";

// Componente principal da tela inicial
export default function TelaInicial() {
  // Estados para armazenar a data selecionada
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const anoAtual = new Date().getFullYear(); // Obtém o ano atual

  // Solicita permissão para acessar o calendário ao carregar o componente
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(strings.alerts.permissionDenied);
      }
    })();
  }, []);

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

  // Função para criar um evento no calendário
  const criarEvento = async () => {
    if (!dia || !mes || !ano) {
      Alert.alert(strings.alerts.selectDate);
      return;
    }

    // Cria o objeto de data e define para meio-dia para evitar problemas de fuso horário
    const eventDate = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      12,
      0,
      0
    );

    // Cria as datas de início e fim para o evento
    const startDate = new Date(eventDate);
    const endDate = new Date(eventDate);
    endDate.setHours(23, 59, 59);

    try {
      // Obtém os calendários disponíveis
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const defaultCalendar = calendars.find((cal) => cal.allowsModifications);

      if (!defaultCalendar) {
        Alert.alert("Calendário padrão não encontrado");
        return;
      }

      // Cria o evento no calendário padrão
      await Calendar.createEventAsync(defaultCalendar.id, {
        title: "Marcar doação de sangue",
        startDate,
        endDate,
        allDay: true,
        timeZone: "GMT",
      });
      Alert.alert(strings.alerts.eventCreated);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert(strings.alerts.eventError, errorMessage);
    }
  };

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.secao}>
        <Button title={strings.buttons.findBloodBank} onPress={buscarBancos} />
      </View>
      <View style={estilos.secao}>
        <DatePicker
          dia={dia}
          setDia={setDia}
          mes={mes}
          setMes={setMes}
          ano={ano}
          setAno={setAno}
          anoAtual={anoAtual}
        />
        <Button title={strings.buttons.createEvent} onPress={criarEvento} />
      </View>
    </SafeAreaView>
  );
}

// Estilos para os componentes
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  secao: {
    margin: 20,
  },
});
