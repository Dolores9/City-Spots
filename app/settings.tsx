import { View, Text, Switch, StyleSheet } from "react-native";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useNavigation } from "expo-router";

export default function SettingsScreen() {
  //Get curr theme
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const navigation = useNavigation();
  const styles = createStyles(isDark);

  //Change header based on theme
  useEffect(() => {
    navigation.setOptions({
      title: "Instellingen",
      headerStyle: { backgroundColor: isDark ? "#121212" : "#ffffff" },
      headerTitleStyle: { color: isDark ? "#ffffff" : "#000000" },
      headerTintColor: isDark ? "#ffffff" : "#000000",
    });
  }, [isDark]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dark mode</Text>

      {/* Switch to switch themes */}
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: "#767577", true: "#a09e1fff" }}
        thumbColor={isDark ? "#f5dd4b" : "#f4f4f3ff"}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );
}

//Styles for different layout modes
const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: isDarkMode ? "#121212" : "#fff",
      flex: 1,
    },
    text: {
      fontSize: 18,
      marginBottom: 10,
      color: isDarkMode ? "#fff" : "#000000ff",
    },
  });
