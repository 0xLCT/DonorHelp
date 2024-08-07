import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import DatePicker from "./DatePicker";

interface DonationModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  date: { dia: string; mes: string; ano: string };
  setDate: (date: { dia: string; mes: string; ano: string }) => void;
  donationNumber: number;
  onSubmit: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({
  visible,
  setVisible,
  date,
  setDate,
  donationNumber,
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
        <Text style={styles.label}>Adicionar Doação</Text>
        <DatePicker
          dia={date.dia}
          setDia={(dia) => setDate({ ...date, dia })}
          mes={date.mes}
          setMes={(mes) => setDate({ ...date, mes })}
          ano={date.ano}
          setAno={(ano) => setDate({ ...date, ano })}
          anoAtual={new Date().getFullYear()}
        />
        <Text style={styles.donationNumberText}>
          Número da doação: {donationNumber}
        </Text>
        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Adicionar Doação</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
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
  donationNumberText: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
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

export default DonationModal;
