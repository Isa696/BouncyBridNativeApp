import { useCallback, useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import RulesModal from "../components/RulesModal";
import BouncyModal from "../components/BouncyModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import useBackgroundMusic from "../hooks/useBackgroundMusic";
import CustomBannerAd from "../components/CustomBannerAd";

export default function StartScreen({ navigation }) {
  const [showRules, setShowRules] = useState(false);
  const [showBouncy, setShowBouncy] = useState(false);
  const [highScore, setHighScore] = useState("--");
  const [lastScore, setLastScore] = useState("--");
  const {
  playMenuMusic,
  stopAll
} = useBackgroundMusic();

useFocusEffect(
  useCallback(() => {
    const loadScores = async () => {
      try {
        const storedHigh = await AsyncStorage.getItem("highScore");
        const storedLast = await AsyncStorage.getItem("lastScore");

        setHighScore(storedHigh ? parseInt(storedHigh) : "--");
        setLastScore(storedLast ? parseInt(storedLast) : "--");
      } catch (error) {
        console.error("Error loading scores:", error);
      }
    };

    // Aseguramos que esto se ejecute en un contexto seguro
    let isMounted = true;
    if (isMounted) {
      loadScores();
      // Pequeño delay para asegurar que la navegación se ha completado
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          playMenuMusic();
        }
      }, 100);
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
        stopAll();
      };
    }
    return () => {
      isMounted = false;
    };
  }, [])
);

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
        <CustomBannerAd />
      <View style={styles.container}>
        <View style={styles.menuBox}>
          <Image
            source={require("../assets/title-img.png")}
            style={styles.titleImg}
            resizeMode="contain"
          />
          <Text style={styles.description}>
            ¡Ayuda a nuestro pequeño pájaro a volar! Toca la pantalla para
            impulsarlo hacia arriba y evita los obstáculos. ¡Diviértete!
          </Text>

          <TouchableOpacity
            style={styles.classicBtn}
            onPress={() => setShowRules(true)}
          >
            <Text style={styles.btnText}>Modo clásico</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bouncyBtn}
            onPress={() => setShowBouncy(true)}
          >
            <Text style={[styles.btnText, { color: "#333" }]}>Modo Bouncy</Text>
          </TouchableOpacity>

          <View style={styles.scoreBox}>
            <Text>
              Máximo puntaje: <Text style={styles.score}>{highScore}</Text>
            </Text>
            <Text>
              Último puntaje: <Text style={styles.score}>{lastScore}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate("Shop")}
          >
            <Text style={styles.btnText}>Tienda</Text>
          </TouchableOpacity>

          <Text style={styles.credits}>
            Desarrollado por:{" "}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL("https://isa696-portfolio.vercel.app/")
              }
            >
              Isaias Romero
            </Text>
          </Text>
        </View>
        <RulesModal visible={showRules} onClose={() => setShowRules(false)} />
        <BouncyModal
          visibleBouncy={showBouncy}
          onCloseBouncy={() => setShowBouncy(false)}
        />
      </View>
                <CustomBannerAd />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 20,
    width: 280,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  titleImg: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },
  classicBtn: {
    backgroundColor: "#48c774",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  bouncyBtn: {
    backgroundColor: "#ffdd57",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
  },
  shopBtn: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  scoreBox: {
    marginTop: 10,
    alignItems: "center",
  },
  score: {
    fontWeight: "bold",
  },
  credits: {
    fontSize: 12,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  link: {
    color: "chocolate",
    textDecorationLine: "underline",
  },
});
