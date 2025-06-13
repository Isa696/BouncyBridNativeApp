import { useAudioPlayer } from 'expo-audio';
import death0 from '../assets/sound/death-0.mp3';
import death1 from '../assets/sound/death-1.mp3';
import death2 from '../assets/sound/death-2.mp3';
import death3 from '../assets/sound/death-3.mp3';

const useDeathSound = () => {
  const players = [
    useAudioPlayer(death0),
    useAudioPlayer(death1),
    useAudioPlayer(death2),
    useAudioPlayer(death3),
  ];

  const playDeathSound = () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    const player = players[randomIndex];

    if (!player.playing) {
      player.seekTo(0);
      player.play();
    }
  };

  return {
    playDeathSound,
  };
};

export default useDeathSound;
