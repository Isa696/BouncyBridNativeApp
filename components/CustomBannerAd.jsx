import { useRef } from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = TestIds.BANNER;
// const adUnitId = 'ca-app-pub-xxxx-your-app-id/xxxx'; // Reemplaza con tu ID de bloque de anuncios real

const CustomBannerAd = () => {
    const bannerRef = useRef(null);

  return (
    <>
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </>
  );
};

export default CustomBannerAd;
