import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { strings } from "../locales/strings";

export default function TabFourScreen() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [bloodType, setBloodType] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // New state variables to track focus
  const [nameFocused, setNameFocused] = useState(false);
  const [bloodTypeFocused, setBloodTypeFocused] = useState(false);
  const [birthDateFocused, setBirthDateFocused] = useState(false);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.placeholderPhoto]} />
        )}
        <Button title={strings.profile.pickImage} onPress={pickImage} />
        <TextInput
          style={[styles.input, styles.text]}
          placeholder={nameFocused ? "" : strings.profile.name}
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
        />
        <View style={styles.genderSelector}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "male" && styles.selectedMale,
            ]}
            onPress={() => setGender("male")}
          >
            <FontAwesome
              name="male"
              size={24}
              color={gender === "male" ? "#007AFF" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderOption,
              gender === "female" && styles.selectedFemale,
            ]}
            onPress={() => setGender("female")}
          >
            <FontAwesome
              name="female"
              size={24}
              color={gender === "female" ? "#FF69B4" : "#FFB6C1"}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, styles.text]}
          placeholder={bloodTypeFocused ? "" : strings.profile.bloodType}
          placeholderTextColor="#fff"
          value={bloodType}
          onChangeText={setBloodType}
          onFocus={() => setBloodTypeFocused(true)}
          onBlur={() => setBloodTypeFocused(false)}
        />
        <TextInput
          style={[styles.input, styles.text]}
          placeholder={birthDateFocused ? "" : strings.profile.birthDate}
          placeholderTextColor="#fff"
          value={birthDate}
          onChangeText={setBirthDate}
          onFocus={() => setBirthDateFocused(true)}
          onBlur={() => setBirthDateFocused(false)}
        />
        <Button title={strings.profile.saveProfile} onPress={saveProfile} />
      </View>
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
    padding: 10,
    marginVertical: 10,
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
});
