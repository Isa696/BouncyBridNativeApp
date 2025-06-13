import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, Image } from 'react-native';
import { RewardedInterstitialAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = TestIds.REWARDED_INTERSTITIAL;
// const adUnitId = 'ca-app-pub-xxxx-your-app-id/xxxx'; // Reemplaza con tu ID de bloque de anuncios real

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(adUnitId);
const CustomRewardedInterstitialAd = ({ setSeedsCollected }) => {
    const [loaded, setLoaded] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const saveRewardToStorage = async (reward) => {
    try {
      const storedSeeds = await AsyncStorage.getItem('totalSeeds');
      const totalSeeds = storedSeeds ? parseInt(storedSeeds) + reward : reward;
      await AsyncStorage.setItem('totalSeeds', totalSeeds.toString());
      console.log(`Total seeds saved: ${totalSeeds}`);
    } catch (error) {
      console.error('Error saving seeds to storage:', error);
    }
  };


  useEffect(() => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );
    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        setSeedsCollected(prevSeeds => prevSeeds + 50);
        saveRewardToStorage(50);
        setDisabled(true);
      },
    );

    // Start loading the rewarded interstitial ad straight away
    rewardedInterstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // No advert ready to show yet
//   if (!loaded) {
//     return null;
//   }

  return (
<Pressable
  style={[styles.container, (disabled || !loaded) && styles.disabled]}
  onPress={() => {
    if (loaded && !disabled) {
      rewardedInterstitial.show();
    }
  }}
  disabled={disabled || !loaded}
>
      <Image
        source={require('../assets/reward_boost.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
  }
});

export default CustomRewardedInterstitialAd;