import { useAudioPlayer } from 'expo-audio';
import bounceSoundBottom from '../assets/sound/bounce-sound-bottom.mp3';
import bounceSoundTop from '../assets/sound/bounce-sound-top.mp3';

const useBounceSound = () => {
  const playerTop = useAudioPlayer(bounceSoundTop);
  const playerBottom = useAudioPlayer(bounceSoundBottom);

  const playTopBounce = () => {
    if (!playerTop.playing) {
      playerTop.seekTo(0);
      playerTop.play();
    }
  };

  const playBottomBounce = () => {
    if (!playerBottom.playing) {
      playerBottom.seekTo(0);
      playerBottom.play();
    }
  };

  return {
    playTopBounce,
    playBottomBounce,
  };
};

export default useBounceSound;
