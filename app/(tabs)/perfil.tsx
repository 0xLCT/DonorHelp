import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { strings } from "../locales/strings";
import { useDonations } from "@/context/DonationsContext";

export default function TabFourScreen() {
  const {
    donations,
    setAllDonations,
  }: { donations: any[]; setAllDonations: (donations: any[]) => void } =
    useDonations();

  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [bloodType, setBloodType] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const [nameFocused, setNameFocused] = useState(false);
  const [bloodTypeFocused, setBloodTypeFocused] = useState(false);
  const [birthDateFocused, setBirthDateFocused] = useState(false);

  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportedData, setExportedData] = useState("");
  const [importedData, setImportedData] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const storedName = await AsyncStorage.getItem("profileName");
      const storedBloodType = await AsyncStorage.getItem("profileBloodType");
      const storedBirthDate = await AsyncStorage.getItem("profileBirthDate");
      const storedPhoto = await AsyncStorage.getItem("profilePhoto");
      const storedGender = await AsyncStorage.getItem("profileGender");

      if (storedName) setName(storedName);
      if (storedBloodType) setBloodType(storedBloodType);
      if (storedBirthDate) setBirthDate(storedBirthDate);
      if (storedPhoto) setPhoto(storedPhoto);
      if (storedGender) setGender(storedGender as "male" | "female");
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    await AsyncStorage.setItem("profileName", name);
    await AsyncStorage.setItem("profileBloodType", bloodType);
    await AsyncStorage.setItem("profileBirthDate", birthDate);
    if (photo) await AsyncStorage.setItem("profilePhoto", photo);
    if (gender) await AsyncStorage.setItem("profileGender", gender);
  };

  const updateName = (value: string) => {
    setName(value);
    AsyncStorage.setItem("profileName", value);
  };

  const updateGender = (value: "male" | "female") => {
    setGender(value);
    AsyncStorage.setItem("profileGender", value);
  };

  const updateBloodType = (value: string) => {
    setBloodType(value);
    AsyncStorage.setItem("profileBloodType", value);
  };

  const updateBirthDate = (value: string) => {
    setBirthDate(value);
    AsyncStorage.setItem("profileBirthDate", value);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto = result.assets[0].uri;
      setPhoto(newPhoto);
      AsyncStorage.setItem("profilePhoto", newPhoto);
    }
  };

  const exportProfileData = () => {
    const data = {
      name,
      gender,
      bloodType,
      birthDate,
      donations,
    };
    setExportedData(JSON.stringify(data, null, 2));
    setExportModalVisible(true);
  };

  const importProfileData = () => {
    try {
      const data = JSON.parse(importedData);
      if (data.name) setName(data.name);
      if (data.gender) setGender(data.gender);
      if (data.bloodType) setBloodType(data.bloodType);
      if (data.birthDate) setBirthDate(data.birthDate);
      if (data.donations) setAllDonations(data.donations);
      saveProfile();
      setImportModalVisible(false);
    } catch (error) {
      console.error("Invalid JSON data");
    }
  };

  const lastDonation =
    donations.length > 0 ? donations[donations.length - 1] : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.placeholderPhoto]} />
        )}
        <Pressable onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>{strings.profile.pickImage}</Text>
        </Pressable>
        <TextInput
          style={[styles.input, styles.text]}
          placeholder={nameFocused ? "" : strings.profile.name}
          placeholderTextColor="#fff"
          value={name}
          onChangeText={updateName}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
        />

        <TextInput
          style={[styles.input, styles.text, styles.narrowInput]}
          placeholder={bloodTypeFocused ? "" : strings.profile.bloodType}
          placeholderTextColor="#fff"
          value={bloodType}
          onChangeText={updateBloodType}
          onFocus={() => setBloodTypeFocused(true)}
          onBlur={() => setBloodTypeFocused(false)}
        />
        <TextInput
          style={[styles.input, styles.text, styles.narrowInput]}
          placeholder={birthDateFocused ? "" : strings.profile.birthDate}
          placeholderTextColor="#fff"
          value={birthDate}
          onChangeText={updateBirthDate}
          onFocus={() => setBirthDateFocused(true)}
          onBlur={() => setBirthDateFocused(false)}
        />
      </View>
      <Text style={styles.label}>{strings.profile.gender}</Text>
      <View style={styles.genderSelector}>
        <Pressable
          style={({ pressed }) => [
            styles.genderOption,
            gender === "male" && styles.selectedMale,
            pressed && styles.pressed,
          ]}
          onPress={() => updateGender("male")}
        >
          <FontAwesome
            name="male"
            size={24}
            color={gender === "male" ? "#007AFF" : "#fff"}
          />
          <Text style={styles.genderText}>{strings.profile.male}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.genderOption,
            gender === "female" && styles.selectedFemale,
            pressed && styles.pressed,
          ]}
          onPress={() => updateGender("female")}
        >
          <FontAwesome
            name="female"
            size={24}
            color={gender === "female" ? "#FF69B4" : "#fff"}
          />
          <Text style={styles.genderText}>{strings.profile.female}</Text>
        </Pressable>
      </View>
      <Text style={styles.label}>
        Doações: {donations.length}{" "}
        {donations.length >= 100
          ? "🏆"
          : donations.length >= 50
          ? "🥇"
          : donations.length >= 25
          ? "🥈"
          : donations.length >= 10
          ? "🥉"
          : ""}
      </Text>
      {lastDonation && (
        <Text style={styles.label}>
          Ultima doação: {new Date(lastDonation).toLocaleDateString("pt-BR")}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <Pressable onPress={exportProfileData} style={styles.button}>
          <Text style={styles.buttonText}>Exportar dados</Text>
        </Pressable>
        <Pressable
          onPress={() => setImportModalVisible(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Importar dados</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={exportModalVisible}
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalText}>{exportedData}</Text>
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setExportModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={importModalVisible}
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={[styles.input, styles.modalInput]}
              placeholder="Paste JSON data here"
              placeholderTextColor="#fff"
              value={importedData}
              onChangeText={setImportedData}
              multiline
            />
            <Pressable style={styles.button} onPress={importProfileData}>
              <Text style={styles.buttonText}>Import</Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setImportModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  profileContainer: {
    width: "80%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 5,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#fff",
    textAlign: "center",
  },
  text: {
    color: "#fff",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  placeholderPhoto: {
    backgroundColor: "#ccc",
  },
  genderSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedMale: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderColor: "#007AFF",
  },
  selectedFemale: {
    backgroundColor: "rgba(255, 105, 180, 0.1)",
    borderColor: "#FF69B4",
  },
  narrowInput: {
    width: "60%",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  genderText: {
    color: "#fff",
    marginLeft: 5,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
  },
  modalInput: {
    color: "#fff",
    borderColor: "#fff",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
