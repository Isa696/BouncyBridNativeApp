import { useAudioPlayer } from 'expo-audio';
import flapSound from '../assets/sound/flap-sound.mp3';

const useFlapSound = () => {
  const flapSoundplayer = useAudioPlayer(flapSound);

  const playFlapSound = () => {
    if (!flapSoundplayer.playing) {
      flapSoundplayer.seekTo(0);
      flapSoundplayer.play();
    }
  };

  return {
    playFlapSound,
  };
};

export default useFlapSound;
