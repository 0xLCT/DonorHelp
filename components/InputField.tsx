import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  icon,
  onFocus,
  onBlur,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon as any}
        size={24}
        color="#BB86FC"
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        style={styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default InputField;
