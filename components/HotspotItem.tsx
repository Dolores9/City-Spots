import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "@/contexts/ThemeContext";

//Hotspot component
export type Hotspot = {
  id: number;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

type HotspotItemProps = {
  item: Hotspot;
  onPress: () => void;
};

export default function HotspotItem({ item, onPress }: HotspotItemProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    AsyncStorage.getItem(`fav-${item.name}`).then((value) => {
      if (value === "true") setIsFavorite(true);
    });
  }, [item.name]);

  const toggleFavorite = async () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    await AsyncStorage.setItem(`fav-${item.name}`, newValue.toString());
  };

  return (
    <TouchableOpacity
      style={[
        styles.item,
        isDarkMode ? styles.darkItem : styles.lightItem,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.title,
          isDarkMode ? styles.darkText : styles.lightText,
        ]}
      >
        {item.name}
      </Text>

      <TouchableOpacity
        onPress={toggleFavorite}
        style={styles.favoriteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text
          style={[
            styles.favoriteText,
            isDarkMode ? styles.darkText : styles.lightText,
          ]}
        >
          {isFavorite ? "✖︎" : "SAVE"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  darkItem: {
    backgroundColor: "#2a2a2a",
  },
  lightItem: {
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 16,
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  favoriteButton: {
    paddingHorizontal: 10,
  },
  favoriteText: {
    fontSize: 20,
  },
});
