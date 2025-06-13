import { useAudioPlayer } from 'expo-audio';
import { useCallback, useRef } from 'react';
import menuSong from '../assets/sound/menu-song.mp3';
import mainSong from '../assets/sound/main-song.mp3';

const useBackgroundMusic = () => {
  const menuPlayer = useAudioPlayer(menuSong);
  const mainPlayer = useAudioPlayer(mainSong);
  const activePlayer = useRef(null);

  const stopAll = useCallback(() => {
    try {
      // Solo intentamos pausar el player activo
      if (activePlayer.current?.playing) {
        activePlayer.current.pause();
      }
      activePlayer.current = null;
    } catch (error) {
      console.log('Error stopping music:', error);
    }
  }, []);

  const playMenuMusic = useCallback(() => {
    try {
      stopAll();
      if (menuPlayer && !menuPlayer.playing) {
        menuPlayer.seekTo(0);
        menuPlayer.loop = true;
        menuPlayer.play();
        activePlayer.current = menuPlayer;
      }
    } catch (error) {
      console.log('Error playing menu music:', error);
    }
  }, []);

  const playGameMusic = useCallback(() => {
    try {
      stopAll();
      if (mainPlayer && !mainPlayer.playing) {
        mainPlayer.seekTo(0);
        mainPlayer.loop = true;
        mainPlayer.play();
        activePlayer.current = mainPlayer;
      }
    } catch (error) {
      console.log('Error playing game music:', error);
    }
  }, []);

  return {
    playMenuMusic,
    playGameMusic,
    stopAll,
  };
};

export default useBackgroundMusic;
