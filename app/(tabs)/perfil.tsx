import React, { useState, useEffect, useCallback } from "react";
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
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useDonations, DonationsContextType } from "@/context/DonationsContext";

import InputField from "../../components/InputField";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProfileScreen() {
  const { donations, setAllDonations } = useDonations() as DonationsContextType;

  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [bloodType, setBloodType] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<"export" | "import">(
    "export"
  );
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

  const handleNameChange = useCallback(async (text: string) => {
    setName(text);
    await AsyncStorage.setItem("profileName", text);
  }, []);

  const handleBloodTypeChange = useCallback(async (text: string) => {
    setBloodType(text);
    await AsyncStorage.setItem("profileBloodType", text);
  }, []);

  const handleBirthDateChange = useCallback(async (text: string) => {
    setBirthDate(text);
    await AsyncStorage.setItem("profileBirthDate", text);
  }, []);

  const handleGenderChange = useCallback(
    async (selectedGender: "male" | "female") => {
      setGender(selectedGender);
      await AsyncStorage.setItem("profileGender", selectedGender);
    },
    []
  );

  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto = result.assets[0].uri;
      setPhoto(newPhoto);
      AsyncStorage.setItem("profilePhoto", newPhoto);
    }
  }, []);

  const exportProfileData = useCallback(() => {
    const data = { name, gender, bloodType, birthDate, donations };
    setExportedData(JSON.stringify(data, null, 2));
    setModalContent("export");
    setModalVisible(true);
  }, [name, gender, bloodType, birthDate, donations]);

  const importProfileData = useCallback(() => {
    try {
      const data = JSON.parse(importedData);
      if (data.name) handleNameChange(data.name);
      if (data.gender) handleGenderChange(data.gender);
      if (data.bloodType) handleBloodTypeChange(data.bloodType);
      if (data.birthDate) handleBirthDateChange(data.birthDate);
      if (data.donations) setAllDonations(data.donations);
      setModalVisible(false);
    } catch (error) {
      console.error("Invalid JSON data");
    }
  }, [
    importedData,
    handleNameChange,
    handleGenderChange,
    handleBloodTypeChange,
    handleBirthDateChange,
    setAllDonations,
  ]);

  const lastDonation =
    donations.length > 0 ? donations[donations.length - 1] : null;

  const getLevelEmoji = useCallback(() => {
    if (donations.length >= 100) return "🏆";
    if (donations.length >= 50) return "🥇";
    if (donations.length >= 25) return "🥈";
    if (donations.length >= 10) return "🥉";
    return "🩸";
  }, [donations.length]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1A1A1A", "#121212"]} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Pressable onPress={pickImage} style={styles.photoContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <View style={[styles.photo, styles.placeholderPhoto]}>
                  <Ionicons name="person" size={60} color="#BB86FC" />
                </View>
              )}

              <Ionicons
                name="camera"
                size={20}
                color="#fff"
                style={styles.editPhotoButton}
              />
            </Pressable>

            <InputField
              value={name}
              onChangeText={handleNameChange}
              placeholder="Nome"
              icon="person-outline"
            />
            <InputField
              value={bloodType}
              onChangeText={handleBloodTypeChange}
              placeholder="Tipo sanguíneo"
              icon="water-outline"
            />
            <InputField
              value={birthDate}
              onChangeText={handleBirthDateChange}
              placeholder="Data de nascimento"
              icon="calendar-outline"
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderSelector}>
              <AnimatedPressable
                style={[
                  styles.genderOption,
                  gender === "male" && styles.selectedGender,
                ]}
                onPress={() => handleGenderChange("male")}
              >
                <Ionicons
                  name="male"
                  size={24}
                  color={gender === "male" ? "#BB86FC" : "#fff"}
                />
                <Text style={styles.genderText}>Homem</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[
                  styles.genderOption,
                  gender === "female" && styles.selectedGender,
                ]}
                onPress={() => handleGenderChange("female")}
              >
                <Ionicons
                  name="female"
                  size={24}
                  color={gender === "female" ? "#BB86FC" : "#fff"}
                />
                <Text style={styles.genderText}>Mulher</Text>
              </AnimatedPressable>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{donations.length}</Text>
                <Text style={styles.statLabel}>Doações</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getLevelEmoji()}</Text>
                <Text style={styles.statLabel}>Nivel</Text>
              </View>
              {lastDonation && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {new Date(lastDonation).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.statLabel}>Ultima doação</Text>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <AnimatedPressable
                onPress={exportProfileData}
                style={styles.button}
              >
                <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Exportar Dados</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => {
                  setModalContent("import");
                  setModalVisible(true);
                }}
                style={styles.button}
              >
                <Ionicons
                  name="cloud-download-outline"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.buttonText}>Importar Dados</Text>
              </AnimatedPressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {modalContent === "export" ? (
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalText}>{exportedData}</Text>
              </ScrollView>
            ) : (
              <TextInput
                style={styles.modalInput}
                placeholder="Paste JSON data here"
                placeholderTextColor="#888"
                value={importedData}
                onChangeText={setImportedData}
                multiline
              />
            )}
            <View style={styles.modalButtonContainer}>
              {modalContent === "import" && (
                <AnimatedPressable
                  style={styles.modalButton}
                  onPress={importProfileData}
                >
                  <Text style={styles.modalButtonText}>Import</Text>
                </AnimatedPressable>
              )}
              <AnimatedPressable
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </AnimatedPressable>
            </View>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  photoContainer: {
    marginBottom: 30,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderPhoto: {
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(187, 134, 252, 0.3)",
    borderRadius: 20,
    padding: 10,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  genderSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#BB86FC",
    borderRadius: 25,
  },
  selectedGender: {
    backgroundColor: "rgba(187, 134, 252, 0.2)",
  },
  genderText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#BB86FC",
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#888",
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    padding: 15,
    backgroundColor: "#BB86FC",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#1E1E1E",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
  },
  modalScrollView: {
    maxHeight: 300,
    width: "100%",
  },
  modalText: {
    color: "#fff",
    fontSize: 14,
  },
  modalInput: {
    width: "100%",
    height: 200,
    backgroundColor: "#2C2C2C",
    borderRadius: 15,
    padding: 15,
    color: "#fff",
    fontSize: 14,
    textAlignVertical: "top",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#BB86FC",
    borderRadius: 25,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
