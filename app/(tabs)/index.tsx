import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../locales/strings";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library

export default function TelaInicial() {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [donations, setDonations] = useState<Date[]>([]);

  useEffect(() => {
    const loadDonations = async () => {
      const storedDonations = await AsyncStorage.getItem("donations");
      if (storedDonations) {
        setDonations(JSON.parse(storedDonations));
      }
    };
    loadDonations();
  }, []);

  const addDonation = async () => {
    const newDonations = [...donations, date].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    setDonations(newDonations);
    await AsyncStorage.setItem("donations", JSON.stringify(newDonations));
    setModalVisible(false);
  };

  const deleteDonation = async (index: number) => {
    const newDonations = donations.filter((_, i) => i !== index);
    setDonations(newDonations);
    await AsyncStorage.setItem("donations", JSON.stringify(newDonations));
  };

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.contentContainer}>
        <Button title="Add donation" onPress={() => setModalVisible(true)} />
        <View style={estilos.scrollBlock}>
          <FlatList
            style={estilos.scrollContainer} // Added style for FlatList
            data={donations.slice().reverse()} // Reverse the donations for display
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={estilos.donationRow}>
                <Text style={estilos.text}>
                  {" "}
                  #{donations.length - index} {/* Adjusted numbering */}
                  {new Date(item).toLocaleDateString()}
                </Text>
                <TouchableOpacity onPress={() => deleteDonation(index)}>
                  <Icon name="trash" size={25} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <Button
              title="Pick a date"
              onPress={() => setShowDatePicker(true)}
            />
            <Text style={estilos.datePreview}>{date.toLocaleDateString()}</Text>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}
            <View style={estilos.buttonRow}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
              <Button title="Confirm" onPress={addDonation} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  text: {
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  donationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
  },
  datePreview: {
    marginVertical: 10,
    fontSize: 16,
    color: "black",
  },
  scrollContainer: {
    width: "100%",
  },
  scrollBlock: {
    height: "55%", // Occupy less than 50% of the vertical space
  },
});
