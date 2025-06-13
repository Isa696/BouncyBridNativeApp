import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, Text } from "react-native";

export default function Score({ isAlive }) {
  const [displayScore, setDisplayScore] = useState("----");
  const { width } = Dimensions.get("window");
  const scoreRef = useRef(0);
  const intervalRef = useRef(null);

  const fontSize = 48;
  
  const formatScore = (value) => value.toString().padStart(4, "0");

    const updateUI = () => {
      setDisplayScore(formatScore(scoreRef.current));
    };
    
    const start = () => {
      intervalRef.current = setInterval(() => {
        if (isAlive) {
          scoreRef.current += 1;
          updateUI();
        } else {
          stop();
        }
      }, 100);
    };

    const stop = async () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const current = scoreRef.current;
      await AsyncStorage.setItem("lastScore", current.toString());
      
      const storedHigh = parseInt(await AsyncStorage.getItem("highScore")) || 0;
      if (current > storedHigh) {
        await AsyncStorage.setItem("highScore", current.toString());
      }
    };
    
    useEffect(() => {
    // start if alive
    if (isAlive) {
      start();
    }

    return () => stop();
  }, [isAlive]);

  return (
    <Text
      style={{
        position: "absolute",
        top: fontSize / 2,
        left: width / 2 - fontSize * 2,
        width: fontSize * 4,
        textAlign: "center",
        color: "white",
        fontSize: fontSize,
        fontWeight: "bold",
        color: "#FFFFFF",
        textShadowColor: "#000000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
      }}
    >
      {displayScore}
    </Text>
  );
}
