import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  ImageBackground,
} from 'react-native';
import Score from '../components/Score';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Seeds from '../components/Seeds';
import { modalStyles } from '../styles/modalStyles';
import useBounceSound from '../hooks/useBounceSound ';
import useFlapSound from '../hooks/useFlapSound';
import useDeathSound from '../hooks/useDeathSound';
import useBackgroundMusic from '../hooks/useBackgroundMusic';
import CustomBannerAd from '../components/CustomBannerAd';
import CustomInterstitialAd from '../components/CustomInterstitialAd';
import CustomRewardedInterstitialAd from '../components/CustomRewardedInterstitialAd';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Constantes del juego
const BIRD_SIZE = 40;
const PIPE_WIDTH = 80;
const GRAVITY = 0.75;
const JUMP_FORCE = -12;

const birdsArray = [
  {
    id: 0,
    name: "Bouncy",
    price: 0,
    frames: [
      require("../assets/bouncy0.png"), // normal
      require("../assets/bouncy1.png"), // flapping
      require("../assets/bouncy2.png"), // dead
    ],
  },
  {
    id: 1,
    name: "Grudge",
    price: 500,
    frames: [
      require("../assets/grudge0.png"),
      require("../assets/grudge1.png"),
      require("../assets/grudge2.png"),
    ],
  },
  {
    id: 2,
    name: "Zenith",
    price: 1000,
    frames: [
      require("../assets/zenith0.png"),
      require("../assets/zenith1.png"),
      require("../assets/zenith2.png"),
    ],
  },
  {
    id: 3,
    name: "Sunny",
    price: 1500,
    frames: [
      require("../assets/sunny0.png"),
      require("../assets/sunny1.png"),
      require("../assets/sunny2.png"),
    ],
  },
];

const GameScreen = ({ navigation }) => {
  // Estados del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [pipesPassed, setPipesPassed] = useState(0);
  const [seedsCollected, setSeedsCollected] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [bird, setBird] = useState({
    x: SCREEN_WIDTH / 4,
    y: SCREEN_HEIGHT / 2 - BIRD_SIZE / 2,
    velocity: 0,
    frame: 0,
  });
  const [selectedBird, setSelectedBird] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const jumpAnimationTimeout = useRef();
  const [pipes, setPipes] = useState([]);
  const PIPE_GAP = 200;
   const PIPE_DISTANCE = 300;
const pipeValues = useRef({
  PIPE_SPEED: 3,
});  
  // Referencias para animaciones
  const gameLoop = useRef();
  const birdRotation = useRef(new Animated.Value(0)).current;
    // 2. Usar el hook de sonido
  const { playBottomBounce, playTopBounce } = useBounceSound();
  const {playFlapSound} = useFlapSound();
  const {playDeathSound} = useDeathSound();
  const { playGameMusic, stopAll } = useBackgroundMusic();
  const adRef = useRef(null);

  // Efecto para manejar la música
  useEffect(() => {
    if (gameStarted && !gameOver) {
      playGameMusic();
    }
    return () => stopAll();
  }, [gameStarted, gameOver]);

   // Función para manejar la recolección de semillas
  const handleSeedCollected = () => {
    setSeedsCollected(prev => prev + 1);
  };

    useEffect(() => {
      const loadScores = async () => {
        try {
          const storedLast = await AsyncStorage.getItem("lastScore");
          const storedSelectedBird = await AsyncStorage.getItem('selectedBird');

          setLastScore(storedLast ? parseInt(storedLast) : "--");
          setSelectedBird(storedSelectedBird ? parseInt(storedSelectedBird) : 0);
        } catch (error) {
          console.error("Error loading scores:", error);
        }
      };
      loadScores();
    }, [gameOver, gameStarted]);

  // Función para generar nuevas tuberías
  const generatePipe = (x) => {
    const pipeHeight = Math.random() * (SCREEN_HEIGHT - PIPE_GAP - 200) + 100;
    return {
      id: Date.now() + Math.random(),
      x,
      topHeight: pipeHeight,
      bottomY: pipeHeight + PIPE_GAP,
      bottomHeight: SCREEN_HEIGHT - (pipeHeight + PIPE_GAP),
      passed: false,
    };
  };

  // Función para detectar colisiones
const checkCollision = (birdY, pipes) => {
  const birdLeft = bird.x;
  const birdRight = bird.x + BIRD_SIZE;
  const birdTop = birdY;
  const birdBottom = birdY + BIRD_SIZE;
  const birdCenter = birdLeft + BIRD_SIZE / 2;

  // Colisión con el suelo o techo
  if (birdY <= 0 || birdY >= SCREEN_HEIGHT - BIRD_SIZE) {
    return true;
  }

  // Verificar colisiones con tuberías
  for (let pipe of pipes) {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;
    const pipeCenter = pipeLeft + PIPE_WIDTH / 2;
    
    // Verificar si el pájaro está en el rango horizontal de la tubería
    const collidesX = birdRight > pipeLeft && birdLeft < pipeRight;
    
    if (collidesX) {
      // Zona de rebote en el centro de la tubería
      const allowedReboundWidth = 100; // Ajusta este valor según necesites
      const withinReboundZone = Math.abs(birdCenter - pipeCenter) < allowedReboundWidth / 2;
      
      const hitsTop = birdTop < pipe.topHeight;
      const hitsBottom = birdBottom > pipe.bottomY;
      
      if (withinReboundZone) {
        if (hitsTop) {
          // Rebote hacia abajo desde la tubería superior
          jump(-0.5); // Fuerza reducida hacia abajo
          playTopBounce();
          continue; // No es colisión fatal, continúa
        }
        
        if (hitsBottom) {
          // Rebote hacia arriba desde la tubería inferior
          jump(1); // Fuerza normal hacia arriba
          playBottomBounce();
          continue; // No es colisión fatal, continúa
        }
      } else {
        // Fuera de la zona de rebote = colisión fatal
        if (hitsTop || hitsBottom) {
          return true;
        }
      }
    }
  }

  return false;
};

  // Función principal del bucle del juego
  const updateGame = () => {
    setBird(prevBird => {
      const newVelocity = prevBird.velocity + GRAVITY;
      const newY = prevBird.y + newVelocity;

      // Animar rotación del pájaro
      Animated.timing(birdRotation, {
        toValue: Math.min(Math.max(newVelocity * 3, -30), 90),
        duration: 100,
        useNativeDriver: true,
      }).start();

      return {
        ...prevBird,
        y: newY,
        velocity: newVelocity,
      };
    });

    setPipes(prevPipes => {
      let newPipes = prevPipes.map(pipe => ({
        ...pipe,
        x: pipe.x - pipeValues.current.PIPE_SPEED,
      }));

      // Eliminar tuberías que salieron de pantalla
      newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);

      // Agregar nueva tubería si es necesario
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < SCREEN_WIDTH - PIPE_DISTANCE) {
        newPipes.push(generatePipe(SCREEN_WIDTH));
      }

      // Verificar puntuación
      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.passed = true;
          setPipesPassed(prevScore => prevScore + 1);
        }
      });
      
      return newPipes;
    });
  };
useEffect(() => {
  if (pipesPassed > 20) {
    pipeValues.current = {
      PIPE_SPEED: 8,
      // PIPE_GAP: 140,
      // PIPE_DISTANCE: 200,
    };
  } else if (pipesPassed > 15) {
    pipeValues.current = {
      PIPE_SPEED: 7,
      // PIPE_GAP: 150,
      // PIPE_DISTANCE: 220,
    };
  } else if (pipesPassed > 10) {
    pipeValues.current = {
      PIPE_SPEED: 6,
      // PIPE_GAP: 160,
      // PIPE_DISTANCE: 240,
    };
  } else if (pipesPassed > 5) {
    pipeValues.current = {
      PIPE_SPEED: 5,
      // PIPE_GAP: 180,
      // PIPE_DISTANCE: 260,
    };
  } else {
    pipeValues.current = {
      PIPE_SPEED: 3,
      // PIPE_GAP: 200,
      // PIPE_DISTANCE: 300,
    };
  }
}, [pipesPassed]);

  // Efecto para el bucle del juego
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop.current = setInterval(() => {
        updateGame();
      }, 16); // ~60 FPS
      playGameMusic();
      return () => {
        clearInterval(gameLoop.current);
        stopAll();
      };
    }
  }, [gameStarted, gameOver]);

  // Efecto para verificar colisiones
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const collision = checkCollision(bird.y, pipes);
      if (collision) {
        setGameOver(true);
        playDeathSound();
        clearInterval(gameLoop.current);
      }
    }
  }, [bird.y, pipes, gameStarted, gameOver]);

  function handleRestart() {
  if (gameOver) {
    resetGame();
    return;
  }
}

const changeBirdFrame = (frameIndex) => {
  setCurrentFrame(frameIndex);
};
  // Función para hacer saltar al pájaro
const jump = (forceMultiplier = 1) => {
  if (!gameStarted) {
    setGameStarted(true);
    return;
  }

  setBird(prevBird => ({
    ...prevBird,
    velocity: JUMP_FORCE * forceMultiplier,
  }));

  // Cambiar a frame de aleteo
  changeBirdFrame(1);
  playFlapSound();
  // Volver al frame normal después de 200ms
  clearTimeout(jumpAnimationTimeout.current);
  jumpAnimationTimeout.current = setTimeout(() => {
    if (!gameOver) {
      changeBirdFrame(0);
    }
  }, 200);
};

  // 6. Efecto para cambiar a frame de muerte cuando el juego termina
useEffect(() => {
  if (gameOver) {
    changeBirdFrame(2); // Frame de muerte
  }
}, [gameOver]);
  // Función para reiniciar el juego
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setPipesPassed(0);
    setSeedsCollected(0);
    setBird({
      x: SCREEN_WIDTH / 4,
      y: SCREEN_HEIGHT / 2 - BIRD_SIZE / 2,
      velocity: 0,
      frame: 0,
    });
    setPipes([]);
    birdRotation.setValue(0);
      setCurrentFrame(0);
  };

  // Renderizar tubería
  const renderPipe = (pipe) => (
    <View key={pipe.id}>
      {/* Tubería superior */}
      <Image
        source={require('../assets/pipe_flipped.png')}
        style={[
          styles.pipe,
          {
            left: pipe.x,
            top: 0,
            height: pipe.topHeight,
          },
        ]}
        />
      {/* Tubería inferior */}
      <Image
        source={require('../assets/pipe.png')}
        style={[
          styles.pipe,
          {
            left: pipe.x,
            top: pipe.bottomY,
            height: pipe.bottomHeight,
          },
        ]}
      />
    </View>
  );

  return (
    <TouchableOpacity style={styles.container} onPress={() => jump()} activeOpacity={1}>
      {/* Fondo del juego */}
      <View style={styles.background}>
        <ImageBackground
          source={require('../assets/scene.webp')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
        {/* Tuberías */}
        {pipes.map(renderPipe)}

                {/* Semillas */}
        <Seeds
          birdX={bird.x}
          birdY={bird.y}
          birdWidth={BIRD_SIZE}
          birdHeight={BIRD_SIZE}
          isAlive={!gameOver}
          isPaused={!gameStarted}
          pipeSpeed={pipeValues.current.PIPE_SPEED}
          pipes={pipes}
          onSeedCollected={handleSeedCollected}
        />

        {/* Pájaro */}
<Animated.View
  style={[
    styles.bird,
    {
      left: bird.x,
      top: bird.y,
      transform: [
        {
          rotate: birdRotation.interpolate({
            inputRange: [-30, 90],
            outputRange: ['-30deg', '90deg'],
            extrapolate: 'clamp',
          }),
        },
      ],
    },
  ]}
>
  <Image
    source={birdsArray[selectedBird].frames[currentFrame]}
    style={styles.birdImage}
    resizeMode="contain"
  />
</Animated.View>

        {/* Puntuación */}
        {gameStarted && (
          <>
          <Score isAlive={!gameOver} />
          <View style={[styles.scoreContainer, styles.scorePipeContainer]}>
          <Text style={styles.scoreText}>{pipesPassed}</Text>
          <Image
            source={require('../assets/pipe-icon.png')}
            style={styles.pipeIcon}
          />
        </View>
                {/* Contador de semillas */}
        <View style={[styles.seedCounter, styles.scorePipeContainer]}>
          <Text style={styles.scoreText}>{seedsCollected}</Text>
            <Image
              source={require('../assets/seed/03_seed.png')}
              style={styles.seedIcon}
            />
        </View>
            </>
          )}

        {/* Pantalla de inicio */}
        {!gameStarted && !gameOver && (
          <View style={styles.startScreen}>
            <Text style={styles.instruction}>Toca para comenzar</Text>
          </View>
        )}

        {/* Pantalla de game over */}
        {gameOver && (
          <View style={styles.gameOverScreen}>
            <CustomBannerAd />
            <Text style={styles.gameOverText}>¡Game Over!</Text>
            <Text style={styles.finalScore}> Puntaje: {lastScore}</Text>
                      <View style={styles.scorePipeContainer}>
            <Text style={styles.finalScore}>{pipesPassed}</Text>
            <Image
              source={require('../assets/pipe-icon.png')}
              style={styles.pipeIcon}
            />
                    </View>
                      <View style={styles.scorePipeContainer}>
            <Text style={styles.finalScore}>{seedsCollected}</Text>
            <Image
              source={require('../assets/seed/03_seed.png')}
              style={styles.pipeIcon}
              />
              <CustomRewardedInterstitialAd 
              setSeedsCollected={setSeedsCollected}/>
                    </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => {
                handleRestart();
                adRef.current?.showAd();
              }}
              style={[modalStyles.dialogBtn, styles.restartBtn]}
            >
              <Text style={modalStyles.dialogBtnText}>⟳ Reiniciar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
                adRef.current?.showAd();
              }}
              style={[modalStyles.dialogBtn, styles.backBtn]}
            >
              <Text style={modalStyles.dialogBtnText}>← Volver</Text>
            </TouchableOpacity>
          </View>
              <CustomBannerAd />
              <CustomInterstitialAd ref={adRef}/>
          </View>
        )}
      </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  bird: {
    position: 'absolute',
    width: BIRD_SIZE,
    height: BIRD_SIZE,
  },
    birdImage: {
    width: '100%',
    height: '100%',
  },
  pipe: {
    position: 'absolute',
    width: PIPE_WIDTH,
    resizeMode: 'stretch',
  },
  scoreContainer: {
    position: 'absolute',
    top: 40,
    right: 30,
  },
  scorePipeContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  },
  scoreText: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  pipeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  startScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  gameOverScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    gap: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameOverText: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 20,
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  finalScore: {
    fontSize: 24,
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instruction: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  seedCounter: {
    position: 'absolute',
    top: 40,
    left: 30,
  },
  seedIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
    buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  restartBtn: {
    backgroundColor: '#48c774',
  },
  backBtn: {
    backgroundColor: '#ff5c5c',
  },
});

export default GameScreen;