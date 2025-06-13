import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFadeOutSound from "../hooks/useFadeOutSeed";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Seeds = ({
  birdX,
  birdY,
  birdWidth,
  birdHeight,
  isAlive,
  isPaused,
  pipeSpeed,
  pipes,
  onSeedCollected,
}) => {
  const [seeds, setSeeds] = useState([]);
  const gameLoop = useRef();
  const nextSeedId = useRef(0);
  const collectedThisGame = useRef(0);
  const { playFadeOutSound } = useFadeOutSound();

  const generateSeed = (pipeX) => {
    const pipe = pipes.find((p) => Math.abs(p.x - pipeX) < 50);

    let seedY;
    if (pipe) {
      const gapStart = pipe.topHeight;
      const gapEnd = pipe.bottomY;
      const gapHeight = gapEnd - gapStart;
      const margin = 40;
      seedY = gapStart + margin + Math.random() * (gapHeight - margin * 2);
    } else {
      seedY = Math.random() * (SCREEN_HEIGHT - 100) + 50;
    }

    return {
      id: nextSeedId.current++,
      x: pipeX || SCREEN_WIDTH + 100,
      y: seedY,
      collected: false,
      showFadeOut: false,
    };
  };

  const checkCollision = (seed, birdX, birdY) => {
    const seedSize = 25;
    return (
      birdX < seed.x + seedSize &&
      birdX + birdWidth > seed.x &&
      birdY < seed.y + seedSize &&
      birdY + birdHeight > seed.y
    );
  };

  const saveSeedsToStorage = async (collectedCount) => {
    try {
      const storedSeeds = await AsyncStorage.getItem("totalSeeds");
      const currentTotal = parseInt(storedSeeds) || 0;
      const newTotal = currentTotal + collectedCount;
      await AsyncStorage.setItem("totalSeeds", newTotal.toString());
    } catch (error) {
      console.error("Error saving seeds:", error);
    }
  };

  const collectSeed = (seedId) => {
    setSeeds((prevSeeds) =>
      prevSeeds.map((seed) => {
        if (seed.id === seedId && !seed.collected) {
          collectedThisGame.current += 1;
          playFadeOutSound();

          if (onSeedCollected) {
            setTimeout(() => {
              onSeedCollected();
            }, 50);
          }

          return { ...seed, collected: true, showFadeOut: true };
        }
        return seed;
      })
    );
  };

  useEffect(() => {
    if (pipes.length > 0 && isAlive) {
      pipes.forEach((pipe) => {
        const existingSeed = seeds.find(
          (seed) => Math.abs(seed.x - (pipe.x + 40)) < 50
        );

        if (!existingSeed && pipe.x > SCREEN_WIDTH - 100) {
          const newSeed = generateSeed(pipe.x + 30);
          setSeeds((prevSeeds) => [...prevSeeds, newSeed]);
        }
      });
    }
  }, [pipes, isAlive]);

  useEffect(() => {
    if (isAlive && !isPaused) {
      gameLoop.current = setInterval(() => {
        setSeeds((prevSeeds) => {
          return prevSeeds
            .map((seed) => {
              if (!seed.collected) {
                const newX = seed.x - pipeSpeed * 2;

                if (checkCollision({ ...seed, x: newX }, birdX, birdY)) {
                  collectSeed(seed.id);
                  return seed;
                }

                return { ...seed, x: newX };
              }
              return seed;
            })
            .filter((seed) => {
              return seed.x > -50 && !seed.collected;
            });
        });
      }, 16);

      return () => clearInterval(gameLoop.current);
    } else {
      clearInterval(gameLoop.current);
    }
  }, [isAlive, isPaused, birdX, birdY, pipeSpeed]);

  useEffect(() => {
    if (!isAlive && collectedThisGame.current > 0) {
      saveSeedsToStorage(collectedThisGame.current);
    }
  }, [isAlive]);

  useEffect(() => {
    if (!isAlive) {
      setSeeds([]);
      nextSeedId.current = 0;
      collectedThisGame.current = 0;
    }
  }, [isAlive]);

  return (
    <>
      {seeds.map((seed) => (
        <View
          key={seed.id}
          style={[
            styles.seed,
            {
              left: seed.x,
              top: seed.y,
            },
          ]}
        >
          <Image
            source={
              seed.showFadeOut
                ? require("../assets/seed/03_seed-fade-out.png")
                : require("../assets/seed/03_seed.png")
            }
            style={styles.seedImage}
            resizeMode="contain"
          />
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  seed: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  seedImage: {
    width: "100%",
    height: "100%",
  },
});

export default Seeds;
