import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LevelIndicatorProps {
  level: number;
  emoji: string;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level, emoji }) => (
  <View style={styles.levelIndicator}>
    <Text style={styles.levelText}>Nível</Text>
    <Text style={styles.levelNumber}>{level}</Text>
    <Text style={styles.emoji}>{emoji}</Text>
  </View>
);

interface DonationItemProps {
  item: string;
  index: number;
  totalDonations: number;
  onDelete: (index: number) => void;
}

const DonationItem: React.FC<DonationItemProps> = ({
  item,
  index,
  totalDonations,
  onDelete,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onDeletePressIn = () => {
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const onDeletePressOut = () => {
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedPressable
      style={[styles.donationRow, { transform: [{ scale: scaleValue }] }]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Text style={styles.text}>
        #{totalDonations - index} {new Date(item).toLocaleDateString("en-GB")}
      </Text>
      <Pressable
        onPress={() => onDelete(index)}
        onPressIn={onDeletePressIn}
        onPressOut={onDeletePressOut}
        style={styles.deleteButton}
        android_ripple={{
          color: "rgba(255, 255, 255, 0.3)",
          borderless: true,
          radius: 28,
        }}
      >
        <Ionicons name="trash-outline" size={24} color="#FF4136" />
        <Animated.View
          style={[styles.rippleEffect, { opacity: opacityValue }]}
        />
      </Pressable>
    </AnimatedPressable>
  );
};

export default function TelaInicial() {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [donations, setDonations] = useState<string[]>([]);
  const [reminderDate, setReminderDate] = useState(new Date());

  useEffect(() => {
    AsyncStorage.getItem("donations").then((storedDonations) => {
      if (storedDonations) setDonations(JSON.parse(storedDonations));
    });
  }, []);

  const addDonation = useCallback(async () => {
    const newDonations = [...donations, date.toISOString()].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    setDonations(newDonations);
    await AsyncStorage.setItem("donations", JSON.stringify(newDonations));
    setModalVisible(false);
  }, [donations, date]);

  const deleteDonation = useCallback(
    async (index: number) => {
      const newDonations = donations.filter((_, i) => i !== index);
      setDonations(newDonations);
      await AsyncStorage.setItem("donations", JSON.stringify(newDonations));
    },
    [donations]
  );

  const getLevelEmoji = useCallback(() => {
    if (donations.length >= 100) return "🏆";
    if (donations.length >= 50) return "🥇";
    if (donations.length >= 25) return "🥈";
    if (donations.length >= 10) return "🥉";
    return "🩸";
  }, [donations.length]);

  const scheduleNotification = useCallback(() => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Doação de Sangue",
        body: "Está na hora de doar sangue!",
      },
      trigger: { seconds: 10 },
    });
    setNotificationModalVisible(false);
  }, []);

  const scheduleCustomNotification = useCallback(() => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Doação de Sangue",
        body: "Está na hora de doar sangue!",
      },
      trigger: { date: reminderDate },
    });
    setNotificationModalVisible(false);
  }, [reminderDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LevelIndicator level={donations.length} emoji={getLevelEmoji()} />
        <AnimatedPressable
          style={styles.addButton}
          onPress={() => setNotificationModalVisible(true)}
        >
          <Ionicons name="notifications" size={24} color="white" />
          <Text style={styles.addButtonText}>Lembrete de Doação</Text>
        </AnimatedPressable>
        <AnimatedPressable
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Adicionar doação</Text>
        </AnimatedPressable>

        <FlatList
          style={styles.list}
          data={donations}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <DonationItem
              item={item}
              index={index}
              totalDonations={donations.length}
              onDelete={deleteDonation}
            />
          )}
        />
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nova Doação</Text>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={24} color="#BB86FC" />
                <Text style={styles.dateButtonText}>
                  {date.toLocaleDateString("pt-BR")}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                  textColor="#FFFFFF"
                />
              )}
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={addDonation}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={notificationModalVisible}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Lembrar de Doar</Text>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={24} color="#BB86FC" />
                <Text style={styles.dateButtonText}>
                  {reminderDate.toLocaleDateString("pt-BR")}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={reminderDate}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setReminderDate(selectedDate);
                  }}
                  textColor="#FFFFFF"
                />
              )}
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setNotificationModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={scheduleNotification}
                >
                  <Text style={styles.confirmButtonText}>Teste de 10s</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.confirmButton]}
                  onPress={scheduleCustomNotification}
                >
                  <Text style={styles.confirmButtonText}>Confirmar Data</Text>
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
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingBottom: 60, // Add this line
  },
  levelIndicator: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 40, // Increased horizontal padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  levelText: { fontSize: 18, fontWeight: "600", color: "#E0E0E0" },
  levelNumber: { fontSize: 48, fontWeight: "bold", color: "#BB86FC" },
  emoji: { fontSize: 36, marginTop: 10 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#BB86FC",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  list: { width: "100%" },
  donationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  text: { color: "#E0E0E0", fontWeight: "500", fontSize: 16 },
  deleteButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 28,
  },
  rippleEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 28,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#E0E0E0",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#2C2C2C",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#BB86FC",
    marginLeft: 10,
  },
  cancelButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#E0E0E0",
  },
  confirmButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#121212",
  },
});
