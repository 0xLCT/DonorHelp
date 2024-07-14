import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Alert, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Linking from 'expo-linking';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TelaInicial() {
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const anoAtual = new Date().getFullYear(); // Obtém o ano atual

  // Função para buscar bancos no mapa
  const buscarBancos = () => {
    const url = Platform.select({
      ios: 'maps:0,0?q=hemocentro',
      android: 'geo:0,0?q=hemocentro',
    });
    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert('Não foi possível determinar a URL específica da plataforma');
    }
  };

  // Função para agendar um evento no calendário
  const agendarEvento = async () => {
    const dataInicio = new Date(`${ano}-${mes}-${dia}T10:00:00`);
    const dataFim = new Date(`${ano}-${mes}-${dia}T11:00:00`);

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const fonteCalendarioPadrao = Platform.OS === 'ios'
        ? await Calendar.getDefaultCalendarAsync()
        : { isLocalAccount: true, name: 'Calendário Expo' };

      const idCalendario = await Calendar.createCalendarAsync({
        title: 'Calendário Expo',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: fonteCalendarioPadrao.id,
        source: fonteCalendarioPadrao,
        name: 'nomeCalendarioInterno',
        ownerAccount: 'pessoal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      await Calendar.createEventAsync(idCalendario, {
        title: 'Evento Agendado',
        startDate: dataInicio,
        endDate: dataFim,
        timeZone: 'GMT',
        location: 'Banco',
      });

      Alert.alert('Evento agendado com sucesso!');
    } else {
      Alert.alert('Permissão para acessar o calendário não concedida');
    }
  };

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.secao}>
        <Button title="Buscar Hemocentro" onPress={buscarBancos} />
      </View>
      <View style={estilos.secao}>
        <View style={estilos.containerPicker}>
          <View style={estilos.pickerWrapper}>
            <Picker
              selectedValue={dia}
              style={estilos.picker}
              onValueChange={(itemValue) => setDia(itemValue)}
            >
              <Picker.Item label="Dia" value="" />
              {[...Array(31).keys()].map(i => (
                <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
              ))}
            </Picker>
            <Icon name="arrow-drop-down" size={24} color="white" style={estilos.pickerIcon} />
          </View>
          <View style={estilos.pickerWrapper}>
            <Picker
              selectedValue={mes}
              style={estilos.picker}
              onValueChange={(itemValue) => setMes(itemValue)}
            >
              <Picker.Item label="Mês" value="" />
              {[...Array(12).keys()].map(i => (
                <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
              ))}
            </Picker>
            <Icon name="arrow-drop-down" size={24} color="white" style={estilos.pickerIcon} />
          </View>
          <View style={estilos.pickerWrapper}>
            <Picker
              selectedValue={ano}
              style={estilos.picker}
              onValueChange={(itemValue) => setAno(itemValue)}
            >
              <Picker.Item label="Ano" value="" />
              {[...Array(10).keys()].map(i => (
                <Picker.Item key={i} label={`${anoAtual + i}`} value={`${anoAtual + i}`} />
              ))}
            </Picker>
            <Icon name="arrow-drop-down" size={24} color="white" style={estilos.pickerIcon} />
          </View>
        </View>
        <Button title="Agendar Evento" onPress={agendarEvento} />
      </View>
    </SafeAreaView>
  );
}

// Estilos para os componentes
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111', // Background color updated
  },
  secao: {
    margin: 20,
  },
  containerPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerWrapper: {
    position: 'relative',
    width: 120,
  },
  picker: {
    height: 50,
    width: '100%',
    marginHorizontal: 0,
    textAlign: 'center',
    color: 'white', // Text color updated
    backgroundColor: '#212121', // Background color updated
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    top: 13,
    pointerEvents: 'none',
  },
});