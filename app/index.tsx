import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter, Stack } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import HotspotItem from "../components/HotspotItem";
import { SafeAreaView } from "react-native-safe-area-context";


type Hotspot = {
  id: number;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export default function HomeScreen() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext);

  //fetch hotspot data
  useEffect(() => {
    fetch("https://dolores9.github.io/hotspot-webserver/hotspots.json")
      .then((res) => res.json())
      .then((data) => setHotspots(data.items ?? []))
      .catch((error) => console.error("Fout bij ophalen JSON:", error));
  }, []);

  // request location access
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Locatie toegang geweigerd");
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setUserLocation(position.coords);
    })();
  }, []);

  //function to get to users curr location
  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#ffffffe4",
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    header: {
      fontSize: 24,
      marginBottom: 10,
      color: isDarkMode ? "#fff" : "#000",
      textAlign: "center", 
    },
    map: {
      width: "100%",
      height: Dimensions.get("window").height * 0.4,
      borderBottomWidth: 4,
      borderTopWidth: 4,
      borderColor: isDarkMode ? "#f5dd4b" : "#333",
    },
    listContainer: {
      flex: 1,
    },
    locationButton: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: isDarkMode ? "#555" : "#cbcbcbff",
      padding: 10,
      borderRadius: 25,
      zIndex: 10,
    },
    locationButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    buttonWrapper: {
      alignItems: "center",
      marginTop: 10,
      marginBottom: 20,
    },
    button: {
      marginTop: 10,
      backgroundColor: isDarkMode ? "#333" : "#cbcbcbff",
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 10,
      alignSelf: "center",
    },
    buttonText: {
      color: isDarkMode ? "#fff" : "#333",
      fontSize: 16,
      textAlign: "center",
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Home",
          headerTintColor: isDarkMode ? "#fff" : "#333", 
        }}
      />

      <SafeAreaView style={dynamicStyles.container}>
        <Text style={dynamicStyles.header}>Spots in Rotterdam</Text>

        <View>
          <MapView
            ref={mapRef}
            style={dynamicStyles.map}
            initialRegion={{
              latitude: userLocation?.latitude ?? 51.9225,
              longitude: userLocation?.longitude ?? 4.47917,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {hotspots.map((item) => (
              <Marker
                key={item.id}
                coordinate={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                }}
                title={item.name}
              />
            ))}

            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                pinColor="blue"
                title="Jij bent hier"
              />
            )}
          </MapView>

          
          <TouchableOpacity
            style={dynamicStyles.locationButton}
            onPress={goToUserLocation}
          >
            <Text style={dynamicStyles.locationButtonText}>📍</Text>
          </TouchableOpacity>
        </View>

        {/* list of hotspots */}
        <View style={dynamicStyles.listContainer}>
          <FlatList
            data={hotspots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <HotspotItem
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/map",
                    params: {
                      name: item.name,
                      lat: item.location.latitude.toString(),
                      lon: item.location.longitude.toString(),
                    },
                  })
                }
              />
            )}
          />

          {/* Buttons */}
          <View style={dynamicStyles.buttonWrapper}>
            <TouchableOpacity
              style={dynamicStyles.button}
              onPress={() => router.push("/map")}
            >
              <Text style={dynamicStyles.buttonText}>Kaart openen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.button}
              onPress={() => router.push("/settings")}
            >
              <Text style={dynamicStyles.buttonText}>Instellingen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
