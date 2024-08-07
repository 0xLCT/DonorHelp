import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import * as Calendar from "expo-calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../locales/strings";
import DonationBox from "../../components/DonationBox";
import ReminderModal from "../../components/ReminderModal";
import DonationModal from "../../components/DonationModal";

interface Donation {
  date: string;
  number: number;
}

export default function TelaInicial() {
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [date, setDate] = useState({ dia: "", mes: "", ano: "" });
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") Alert.alert(strings.alerts.permissionDenied);

      const storedDonations = await AsyncStorage.getItem("donations");
      if (storedDonations) setDonations(JSON.parse(storedDonations));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("donations", JSON.stringify(donations));
  }, [donations]);

  const criarEvento = async () => {
    if (!date.dia || !date.mes || !date.ano) {
      Alert.alert(strings.alerts.selectDate);
      return;
    }

    const eventDate = new Date(
      parseInt(date.ano),
      parseInt(date.mes) - 1,
      parseInt(date.dia),
      12,
      0,
      0
    );

    const startDate = new Date(eventDate);
    const endDate = new Date(eventDate);
    endDate.setHours(23, 59, 59);

    try {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const defaultCalendar = calendars.find((cal) => cal.allowsModifications);

      if (!defaultCalendar) {
        Alert.alert("Calendário padrão não encontrado");
        return;
      }

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
    if (!date.dia || !date.mes || !date.ano) {
      Alert.alert("Por favor, selecione uma data");
      return;
    }
    const newDonation = {
      date: `${date.dia}/${date.mes}/${date.ano}`,
      number: donations.length + 1,
    };
    setDonations([...donations, newDonation]);
    setDonationModalVisible(false);
    setDate({ dia: "", mes: "", ano: "" });
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
          <DonationBox
            key={index}
            donation={donation}
            onRemove={() => removeDonation(index)}
          />
        ))}
      </ScrollView>

      <ReminderModal
        visible={reminderModalVisible}
        setVisible={setReminderModalVisible}
        date={date}
        setDate={setDate}
        onSubmit={criarEvento}
      />
      <DonationModal
        visible={donationModalVisible}
        setVisible={setDonationModalVisible}
        date={date}
        setDate={setDate}
        donationNumber={donations.length + 1}
        onSubmit={addDonation}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
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
});
