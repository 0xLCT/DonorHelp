import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { Platform, StatusBar } from "react-native";

export default function TelaInicial() {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [donations, setDonations] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("donations").then((storedDonations) => {
      if (storedDonations) setDonations(JSON.parse(storedDonations));
    });
  }, []);

  const addDonation = async () => {
    const newDonations = [...donations, date.toISOString()].sort(
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

  const getLevelEmoji = () => {
    if (donations.length >= 100) return "🏆";
    if (donations.length >= 50) return "🥇";
    if (donations.length >= 25) return "🥈";
    if (donations.length >= 10) return "🥉";
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.levelIndicator}>
          <Text style={styles.levelText}>Nível</Text>
          <Text style={styles.levelNumber}>{donations.length}</Text>
          <Text style={styles.emoji}>{getLevelEmoji()}</Text>
        </View>
        <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Adicionar doação</Text>
        </Pressable>
        <FlatList
          style={styles.list}
          data={[...donations].reverse()}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.donationRow}>
              <Text style={styles.text}>
                #{donations.length - index} {formatDate(item)}
              </Text>
              <Pressable onPress={() => deleteDonation(index)}>
                <Icon name="trash" size={25} color="white" />
              </Pressable>
            </View>
          )}
        />
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable
                style={styles.button}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.buttonText}>Escolher uma data</Text>
              </Pressable>
              <Text style={styles.datePreview}>
                {date.toLocaleDateString("pt-BR")}
              </Text>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
              <View style={styles.buttonRow}>
                <Pressable
                  style={styles.button}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={addDonation}>
                  <Text style={styles.buttonText}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  levelIndicator: { alignItems: "center", marginVertical: 10 },
  levelText: { fontSize: 20, fontWeight: "bold", color: "white" },
  levelNumber: { fontSize: 40, fontWeight: "bold", color: "white" },
  emoji: { fontSize: 30, marginTop: 5 },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  list: { width: "100%", height: "50%" },
  donationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: { color: "white", fontWeight: "bold" },
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
  datePreview: { marginVertical: 10, fontSize: 16, color: "black" },
});
