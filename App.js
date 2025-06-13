import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./screens/StartScreen.jsx";
import ShopScreen from "./screens/ShopScreen";
import GameScreen from "./screens/GameScreen.jsx";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";


const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
        // Configuración inicial de Google Mobile Ads
        mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Revisar el estado de cada adaptador
        Object.keys(adapterStatuses).forEach(adapter => {
          const status = adapterStatuses[adapter];
          console.log('Adaptador:', adapter, 'Estado:', status.state, 
                    status.state === 1 ? '(Listo)' : '(No listo)', 
                    'Descripción:', status.description);
        });
      })
      .catch(error => {
        console.error('Error inicializando Google Mobile Ads SDK:', error);
        console.error('Detalles del error:', JSON.stringify(error, null, 2));
      });
  }, [])
  const content = (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  // Solo usar SafeAreaView y StatusBar en móvil
  if (Platform.OS === "web") {
    return content;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {content}
    </SafeAreaView>
  );
}
