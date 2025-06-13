import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useSeeds() {
  const [totalSeeds, setTotalSeeds] = useState(0);

  useEffect(() => {
    loadStoredSeeds();
  }, []);

  const loadStoredSeeds = async () => {
    try {
      const stored = await AsyncStorage.getItem('totalSeeds');
      setTotalSeeds(parseInt(stored) || 0);
    } catch (error) {
      console.error('Error loading seeds:', error);
    }
  };

  return { totalSeeds, loadStoredSeeds };
}