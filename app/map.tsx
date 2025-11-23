import { View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useRef, useState, useContext } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";

export default function MapScreen() {
  //Get parameters from list
  const params: any = useLocalSearchParams();
  const name = params.name;
  const lat = params.lat;
  const lon = params.lon;

  const navigation = useNavigation();

  //Get theme
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;

  //States
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [hotspots, setHotspots] = useState<any[]>([]);

  const mapRef = useRef<MapView>(null);

  //Update styling for darkmode
  useEffect(() => {
    navigation.setOptions({
      title: "Map",
      headerStyle: { backgroundColor: isDark ? "#121212" : "#ffffff" },
      headerTitleStyle: { color: isDark ? "#ffffff" : "#000000" },
      headerTintColor: isDark ? "#ffffff" : "#000000",
    });
  }, [isDark]);

  //Asking location + getting hotspots
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Locatie Toegang", "Locatie toegang is vereist om de kaart te tonen.");
        return;
      }

      //Curr user
      const current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);

      //Hotspots
      try {
        const res = await fetch("https://dolores9.github.io/hotspot-webserver/hotspots.json");
        const data = await res.json();

        setHotspots(Array.isArray(data.items) ? data.items : []);
      } catch (error) {
        console.error("Fout bij ophalen hotspots:", error);
        setHotspots([]);
      }
    })();
  }, []);

  //Go from list to hotspot detail
  useEffect(() => {
    if (lat && lon && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        600 
      );
    }
  }, [lat, lon]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        showsUserLocation={true}
        initialRegion={{
          latitude: lat ? parseFloat(lat) : 51.9225,    
          longitude: lon ? parseFloat(lon) : 4.47917,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* All hotspots */}
        {hotspots.map((spot, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: spot.location.latitude,
              longitude: spot.location.longitude,
            }}
            title={spot.name}
            description={spot.description || ""}
          />
        ))}

        {/* Selected location from list */}
        {lat && lon && (
          <Marker
            coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lon) }}
            title={name || "Geselecteerde locatie"}
            pinColor="green"
          />
        )}

        {/* Curr location */}
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            pinColor="blue"
            title="Jij bent hier"
          />
        )}
      </MapView>
    </View>
  );
}
