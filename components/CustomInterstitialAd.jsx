import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Platform, StatusBar } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// Usar Test ID en desarrollo y el bloque real en producción
const adUnitId = TestIds.INTERSTITIAL;
// const adUnitId = "ca-app-pub-xxx-your-app-id/xxxx"; // Reemplaza con tu ID de bloque de anuncios real

// Crear un anuncio intersticial
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const CustomInterstitialAd = forwardRef((_, ref) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Evento cuando el anuncio está cargado
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    // Evento cuando el anuncio se abre
    const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(true); // Ocultar la barra de estado en iOS
      }
    });

    // Evento cuando el anuncio se cierra
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(false); // Mostrar la barra de estado nuevamente
      }
      // Cargar un nuevo anuncio después de que se cierre
      interstitial.load();
    });

    // Cargar el anuncio intersticial inicialmente
    interstitial.load();

    // Limpiar los listeners al desmontar el componente
    return () => {
      unsubscribeLoaded();
      unsubscribeOpened();
      unsubscribeClosed();
    };
  }, []);

  // Permitir que el componente padre invoque el método `showAd`
  useImperativeHandle(ref, () => ({
    showAd: () => {
      if (loaded) {
        interstitial.show();
      } else {
        console.log('El anuncio aún no está listo para mostrarse.');
      }
    },
  }));

  return null; // Este componente no necesita renderizar nada
});

export default CustomInterstitialAd;
