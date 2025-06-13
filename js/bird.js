import AsyncStorage from '@react-native-async-storage/async-storage';
// import { playFlapSound } from './sound.js'; // Descomenta cuando tengas el sistema de sonido



let bird = null;
const gravity = 0.5;
const lift = -8;
const CANVAS_HEIGHT = 512; // Ajusta según tu canvas

 async function createBird() {
  try {
    const storedSelected = await AsyncStorage.getItem('selectedBird');
    const selectedIndex = parseInt(storedSelected) || 0;
    const selectedBird = birds[selectedIndex] || birds[0];

    bird = {
      x: 50,
      y: 150,
      width: 50,
      height: 50,
      velocity: 0,
      alive: true,
      sprite: selectedBird.src,
      isFlapping: false,
    };

    return bird;
  } catch (error) {
    console.error('Error loading selected bird:', error);
    // Fallback al primer pájaro si hay error
    bird = {
      x: 50,
      y: 150,
      width: 50,
      height: 50,
      velocity: 0,
      alive: true,
      sprite: birds[0].src,
      isFlapping: false,
    };
    return bird;
  }
}

 function updateBird() {
  if (!bird) return;
  
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Verificar colisión con los límites del canvas
  if (bird.y + bird.height > CANVAS_HEIGHT || bird.y < 0) {
    bird.alive = false;
  }
}

 function getBirdDrawData() {
  if (!bird) return null;

  let sx, sy;

  if (!bird.alive) {
    sx = 400;
    sy = 108;
  } else if (bird.isFlapping) {
    sx = 211;
    sy = 108;
  } else {
    sx = 12;
    sy = 108;
  }

  const sw = 200;
  const sh = 196;

  return {
    sprite: bird.sprite,
    sx,
    sy,
    sw,
    sh,
    dx: bird.x,
    dy: bird.y,
    dw: bird.width,
    dh: bird.height,
  };
}

 function flap(direction = 1) {
  if (!bird || !bird.alive) return;
  
  if (bird.alive) {
    bird.velocity = direction * lift;
    bird.isFlapping = true;
    
    setTimeout(() => {
      // playFlapSound(); // Descomenta cuando tengas el sistema de sonido
      if (bird) {
        bird.isFlapping = false;
      }
    }, 250);
  }
}

 function isBirdDead() {
  return !bird || !bird.alive;
}

 function resetBird() {
  if (!bird) return;
  
  bird.y = 150;
  bird.velocity = 0;
  bird.alive = true;
}

 function getBird() {
  return bird;
}

 function setBirdPosition(x, y) {
  if (!bird) return;
  bird.x = x;
  bird.y = y;
}

 function getBirdPosition() {
  if (!bird) return { x: 0, y: 0 };
  return { x: bird.x, y: bird.y };
}

 function getBirdVelocity() {
  if (!bird) return 0;
  return bird.velocity;
}

export default {
  createBird,
  updateBird,
  getBirdDrawData,
  flap,
  isBirdDead,
  resetBird,
  getBird,
  setBirdPosition,
  getBirdPosition,
  getBirdVelocity,
};