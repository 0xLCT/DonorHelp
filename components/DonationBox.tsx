import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const DonationBox = ({ donation, onRemove }) => (
  <View style={styles.item}>
    <Text style={styles.text}>Número: {donation.number}</Text>
    <Text style={styles.text}>Data: {donation.date}</Text>
    <Pressable style={styles.button} onPress={onRemove}>
      <Text style={styles.buttonText}>Remover</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#333",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  text: { color: "white" },
  button: {
    backgroundColor: "#f44",
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DonationBox;
