import { useAudioPlayer } from 'expo-audio';
import fadeOut0 from '../assets/sound/00_seed-fade-out.mp3';
import fadeOut1 from '../assets/sound/01_seed-fade-out.mp3';
import fadeOut2 from '../assets/sound/02_seed-fade-out.mp3';

const useFadeOutSound = () => {
  const players = [
    useAudioPlayer(fadeOut0),
    useAudioPlayer(fadeOut1),
    useAudioPlayer(fadeOut2),
  ];

  const playFadeOutSound = () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    const player = players[randomIndex];

    if (!player.playing) {
      player.seekTo(0);
      player.play();
    }
  };

  return {
    playFadeOutSound,
  };
};

export default useFadeOutSound;
