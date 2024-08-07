import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import DatePicker from "./DatePicker";
import { strings } from "../app/locales/strings";

interface ReminderModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  date: { dia: string; mes: string; ano: string };
  setDate: (date: { dia: string; mes: string; ano: string }) => void;
  onSubmit: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  visible,
  setVisible,
  date,
  setDate,
  onSubmit,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={() => setVisible(false)}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Pressable style={styles.closeButton} onPress={() => setVisible(false)}>
          <Text style={styles.closeButtonText}>X</Text>
        </Pressable>
        <Text style={styles.label}>{strings.datePickerLabel}</Text>
        <DatePicker
          dia={date.dia}
          setDia={(dia) => setDate({ ...date, dia })}
          mes={date.mes}
          setMes={(mes) => setDate({ ...date, mes })}
          ano={date.ano}
          setAno={(ano) => setDate({ ...date, ano })}
          anoAtual={new Date().getFullYear()}
        />
        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>{strings.buttons.createEvent}</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  // ... copy relevant styles from the original file ...
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  label: {
    fontSize: 20,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ReminderModal;
