import React, { useState, useCallback } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InfoBox = ({ title, content }: { title: string; content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];

  const toggleExpand = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    Animated.spring(animatedHeight, {
      toValue,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, animatedHeight]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500], // Adjust this value based on your content
  });

  return (
    <View style={styles.infoBox}>
      <Pressable onPress={toggleExpand} style={styles.infoBoxHeader}>
        <Text style={styles.infoBoxTitle}>{title}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#BB86FC"
        />
      </Pressable>
      <Animated.View style={[styles.infoBoxContent, { maxHeight }]}>
        <Text style={styles.infoBoxText}>{content}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    width: "90%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  infoBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2C2C2C",
  },
  infoBoxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  infoBoxContent: {
    overflow: "hidden",
  },
  infoBoxText: {
    padding: 15,
    color: "#E0E0E0",
    fontSize: 16,
    lineHeight: 24,
  },
});

export default InfoBox;
