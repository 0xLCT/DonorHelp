import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface Card {
  id: number;
  date: string;
  hemoglobin: string;
  iron: string;
  bloodPressure: string;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

// Add type for InputField props
interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: object;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useMemo(
    () => new Animated.Value(value ? 1 : 0),
    [value]
  );

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedIsFocused]);

  const labelStyle = {
    position: "absolute" as "absolute",
    left: 0,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["#888", "#BB86FC"],
    }),
  };

  return (
    <View style={[styles.inputContainer, style]}>
      <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        blurOnSubmit
      />
    </View>
  );
};

// Add type for CardItem props
interface CardItemProps {
  card: Card;
  updateCard: (id: number, field: keyof Card, value: string) => void;
  deleteCard: (id: number) => void;
}

const CardItem: React.FC<CardItemProps> = React.memo(
  ({ card, updateCard, deleteCard }) => {
    const scaleValue = useMemo(() => new Animated.Value(1), []);

    const onPressIn = useCallback(() => {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }, [scaleValue]);

    const onPressOut = useCallback(() => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, [scaleValue]);

    return (
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleValue }] }]}
      >
        <View style={styles.rowContainer}>
          <InputField
            value={card.date}
            onChangeText={(text) => updateCard(card.id, "date", text)}
            placeholder="Date"
            style={styles.dateInput}
          />
          <InputField
            value={card.hemoglobin}
            onChangeText={(text) => updateCard(card.id, "hemoglobin", text)}
            placeholder="Hemoglobin Level"
            style={styles.hemoglobinInput}
          />
        </View>
        <InputField
          value={card.iron}
          onChangeText={(text) => updateCard(card.id, "iron", text)}
          placeholder="Iron Level"
        />
        <InputField
          value={card.bloodPressure}
          onChangeText={(text) => updateCard(card.id, "bloodPressure", text)}
          placeholder="Pressão Arterial"
        />
        <AnimatedTouchableOpacity
          onPress={() => deleteCard(card.id)}
          style={styles.deleteButton}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </AnimatedTouchableOpacity>
      </Animated.View>
    );
  }
);

export default function TabTwoScreen() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const storedCards = await AsyncStorage.getItem("cards");
        if (storedCards) {
          setCards(JSON.parse(storedCards));
        }
      } catch (error) {
        console.error("Falha ao carregar cartões", error);
      }
    };
    loadCards();
  }, []);

  const addCard = useCallback(() => {
    const newCard: Card = {
      id: Date.now(),
      date: "",
      hemoglobin: "",
      iron: "",
      bloodPressure: "",
    };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
  }, [cards]);

  const deleteCard = useCallback(
    (id: number) => {
      const updatedCards = cards.filter((card) => card.id !== id);
      setCards(updatedCards);
      AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
    },
    [cards]
  );

  const updateCard = useCallback(
    (id: number, field: keyof Card, value: string) => {
      const updatedCards = cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      );
      setCards(updatedCards);
      AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
    },
    [cards]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.label}>Hemocentros próximos</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView}>
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                updateCard={updateCard}
                deleteCard={deleteCard}
              />
            ))}
          </ScrollView>
          <AnimatedTouchableOpacity onPress={addCard} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Card</Text>
          </AnimatedTouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 24,
    color: "#E0E0E0",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 60, // Add this line
  },
  content: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    height: 60,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#BB86FC",
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#CF6679",
    padding: 10,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInput: {
    width: "30%",
  },
  hemoglobinInput: {
    width: "68%",
  },
  addButton: {
    backgroundColor: "#BB86FC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 30,
    margin: 20,
  },
  addButtonText: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
