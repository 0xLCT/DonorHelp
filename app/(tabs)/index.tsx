import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import * as Calendar from "expo-calendar";
import DatePicker from "../../components/DatePicker";
import { strings } from "../locales/strings";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Donation {
  date: string;
  number: number;
}

export default function TelaInicial() {
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const anoAtual = new Date().getFullYear();
  const [donations, setDonations] = useState<Donation[]>([]);

  // Load donations from AsyncStorage when the component mounts
  useEffect(() => {
    (async () => {
      const storedDonations = await AsyncStorage.getItem("donations");
      if (storedDonations) {
        setDonations(JSON.parse(storedDonations));
      }
    })();
  }, []);

  // Save donations to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem("donations", JSON.stringify(donations));
  }, [donations]);

  // Solicita permissão para acessar o calendário ao carregar o componente
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(strings.alerts.permissionDenied);
      }
    })();
  }, []);

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

  const addDonation = () => {
    if (!dia || !mes || !ano) {
      Alert.alert("Por favor, selecione uma data");
      return;
    }
    const newDonation = {
      date: `${dia}/${mes}/${ano}`,
      number: donations.length + 1,
    };
    setDonations([...donations, newDonation]);
    setDonationModalVisible(false);
    setDia("");
    setMes("");
    setAno("");
  };

  const removeDonation = (index: number) => {
    setDonations(donations.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.buttonContainer}>
        <Pressable
          style={estilos.button}
          onPress={() => setReminderModalVisible(true)}
        >
          <Text style={estilos.buttonText}>Marcar lembrete</Text>
        </Pressable>
        <Pressable
          style={estilos.button}
          onPress={() => setDonationModalVisible(true)}
        >
          <Text style={estilos.buttonText}>Adicionar doação</Text>
        </Pressable>
      </View>

      <ScrollView style={estilos.donationList}>
        <Text style={estilos.donationListTitle}>Doações:</Text>
        {donations.map((donation, index) => (
          <View key={index} style={estilos.donationItem}>
            <Text style={estilos.donationText}>Data: {donation.date}</Text>
            <Text style={estilos.donationText}>Número: {donation.number}</Text>
            <Pressable
              style={estilos.removeButton}
              onPress={() => removeDonation(index)}
            >
              <Text style={estilos.removeButtonText}>Remover</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Reminder Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reminderModalVisible}
        onRequestClose={() => setReminderModalVisible(false)}
      >
        <View style={estilos.centeredView}>
          <View style={estilos.modalView}>
            <Pressable
              style={estilos.closeButton}
              onPress={() => setReminderModalVisible(false)}
            >
              <Text style={estilos.closeButtonText}>X</Text>
            </Pressable>
            <Text style={estilos.label}>{strings.datePickerLabel}</Text>
            <DatePicker
              dia={dia}
              setDia={setDia}
              mes={mes}
              setMes={setMes}
              ano={ano}
              setAno={setAno}
              anoAtual={anoAtual}
            />
            <Pressable style={estilos.button} onPress={criarEvento}>
              <Text style={estilos.buttonText}>
                {strings.buttons.createEvent}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Donation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={donationModalVisible}
        onRequestClose={() => setDonationModalVisible(false)}
      >
        <View style={estilos.centeredView}>
          <View style={estilos.modalView}>
            <Pressable
              style={estilos.closeButton}
              onPress={() => setDonationModalVisible(false)}
            >
              <Text style={estilos.closeButtonText}>X</Text>
            </Pressable>
            <Text style={estilos.label}>Adicionar Doação</Text>
            <DatePicker
              dia={dia}
              setDia={setDia}
              mes={mes}
              setMes={setMes}
              ano={ano}
              setAno={setAno}
              anoAtual={anoAtual}
            />
            <Text style={estilos.donationNumberText}>
              Número da doação: {donations.length + 1}
            </Text>
            <Pressable style={estilos.button} onPress={addDonation}>
              <Text style={estilos.buttonText}>Adicionar Doação</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5, // for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 20,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  donationList: {
    width: "100%",
    maxHeight: 200,
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 10,
  },
  donationListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  donationItem: {
    backgroundColor: "#333",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  donationText: {
    color: "white",
  },
  donationNumberText: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
  },
  removeButton: {
    backgroundColor: "#ff4444",
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
