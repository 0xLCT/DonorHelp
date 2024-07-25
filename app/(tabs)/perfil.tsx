import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function TabFourScreen() {
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const storedName = await AsyncStorage.getItem("profileName");
      const storedBloodType = await AsyncStorage.getItem("profileBloodType");
      const storedBirthDate = await AsyncStorage.getItem("profileBirthDate");
      const storedPhoto = await AsyncStorage.getItem("profilePhoto");

      if (storedName) setName(storedName);
      if (storedBloodType) setBloodType(storedBloodType);
      if (storedBirthDate) setBirthDate(storedBirthDate);
      if (storedPhoto) setPhoto(storedPhoto);
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    await AsyncStorage.setItem("profileName", name);
    await AsyncStorage.setItem("profileBloodType", bloodType);
    await AsyncStorage.setItem("profileBirthDate", birthDate);
    if (photo) await AsyncStorage.setItem("profilePhoto", photo);
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
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <TextInput
          style={[styles.input, styles.text]}
          placeholder="Name"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.text]}
          placeholder="Blood Type"
          placeholderTextColor="#fff"
          value={bloodType}
          onChangeText={setBloodType}
        />
        <TextInput
          style={[styles.input, styles.text]}
          placeholder="Birth Date"
          placeholderTextColor="#fff"
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <Button title="Save Profile" onPress={saveProfile} />
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#fff",
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
});
