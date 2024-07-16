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
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";

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
        Alert.alert("Permissão de calendário não concedida");
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
      Alert.alert("Por favor, selecione uma data completa");
      return;
    }

    // Cria as datas de início e fim do evento
    const startDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    const endDate = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      23,
      59,
      59
    );

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
      Alert.alert("Evento criado com sucesso");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert("Erro ao criar evento", errorMessage);
    }
  };

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.secao}>
        <Button title="Buscar Hemocentro" onPress={buscarBancos} />
      </View>
      <View style={estilos.secao}>
        <View style={estilos.containerPicker}>
          <View style={estilos.pickerWrapper}>
            <Picker
              selectedValue={dia}
              style={estilos.picker}
              onValueChange={(itemValue) => setDia(itemValue)}
            >
              <Picker.Item label="Dia" value="" />
              {[...Array(31).keys()].map((i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
              ))}
            </Picker>
            <Icon
              name="arrow-drop-down"
              size={24}
              color="white"
              style={estilos.pickerIcon}
            />
          </View>
          <View style={estilos.pickerWrapper}>
            <Picker
              selectedValue={mes}
              style={estilos.picker}
              onValueChange={(itemValue) => setMes(itemValue)}
            >
              <Picker.Item label="Mês" value="" />
              {[...Array(12).keys()].map((i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
              ))}
            </Picker>
            <Icon
              name="arrow-drop-down"
              size={24}
              color="white"
              style={estilos.pickerIcon}
            />
          </View>
          <View style={estilos.pickerWrapper}>
            <Picker
              selectedValue={ano}
              style={estilos.picker}
              onValueChange={(itemValue) => setAno(itemValue)}
            >
              <Picker.Item label="Ano" value="" />
              {[...Array(10).keys()].map((i) => (
                <Picker.Item
                  key={i}
                  label={`${anoAtual + i}`}
                  value={`${anoAtual + i}`}
                />
              ))}
            </Picker>
            <Icon
              name="arrow-drop-down"
              size={24}
              color="white"
              style={estilos.pickerIcon}
            />
          </View>
        </View>
        <Button title="Criar Evento" onPress={criarEvento} />
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
  containerPicker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerWrapper: {
    position: "relative",
    width: 120,
  },
  picker: {
    height: 50,
    width: "100%",
    marginHorizontal: 0,
    textAlign: "center",
    color: "white",
    backgroundColor: "#212121",
  },
  pickerIcon: {
    position: "absolute",
    right: 10,
    top: 13,
    pointerEvents: "none",
  },
});
