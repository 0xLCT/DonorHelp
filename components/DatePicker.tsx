import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";

// Definição das propriedades esperadas pelo componente DatePicker
interface DatePickerProps {
  dia: string;
  setDia: (value: string) => void;
  mes: string;
  setMes: (value: string) => void;
  ano: string;
  setAno: (value: string) => void;
  anoAtual: number;
}

// Componente funcional DatePicker
const DatePicker: React.FC<DatePickerProps> = ({
  dia,
  setDia,
  mes,
  setMes,
  ano,
  setAno,
  anoAtual,
}) => {
  return (
    <View style={estilos.containerPicker}>
      {/* Picker para selecionar o dia */}
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

      {/* Picker para selecionar o mês */}
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

      {/* Picker para selecionar o ano */}
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
  );
};

// Estilos para o componente DatePicker
const estilos = StyleSheet.create({
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

export default DatePicker;
