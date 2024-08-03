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
  const renderPicker = (
    value: string,
    setValue: (value: string) => void,
    label: string,
    items: number | string[]
  ) => (
    <View style={estilos.pickerWrapper}>
      <Picker
        selectedValue={value}
        style={estilos.picker}
        onValueChange={setValue}
      >
        <Picker.Item label={label} value="" />
        {Array.isArray(items)
          ? items.map((item) => (
              <Picker.Item key={item} label={`${item}`} value={`${item}`} />
            ))
          : [...Array(items).keys()].map((i) => (
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
  );

  const years = Array.from({ length: 6 }, (_, i) => (anoAtual + i).toString());

  return (
    <View style={estilos.containerPicker}>
      {renderPicker(dia, setDia, "Dia", 31)}
      {renderPicker(mes, setMes, "Mês", 12)}
      {renderPicker(ano, setAno, "Ano", years)}
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
