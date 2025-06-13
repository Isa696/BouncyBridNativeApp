# Bouncy Bird Game

Un juego móvil divertido y adictivo creado con React Native y Expo, donde controlas un pájaro que rebota entre obstáculos mientras colectas semillas.

## Características

- Jugabilidad simple y adictiva
- Diferentes tipos de pájaros desbloqueables
- Sistema de recompensas con semillas
- Integración completa con AdMob para monetización
- Efectos de sonido y música de fondo
- Animaciones fluidas
- Diseño responsivo
- Compatible con iOS y Android

## Publicidad AdMob

El juego está completamente integrado con Google AdMob e incluye:
- Banner Ads
- Interstitial Ads
- Rewarded Interstitial Ads

### Configuración de AdMob

Los anuncios están preconfigurados y listos para usar. Solo necesitas:

1. Reemplazar los Test IDs con tus propios IDs de AdMob en los siguientes archivos:

```jsx
// components/CustomBannerAd.jsx
const adUnitId = 'ca-app-pub-XXXXX/YYYYY'; // Reemplazar con tu Banner Ad ID

// components/CustomInterstitialAd.jsx
const adUnitId = 'ca-app-pub-XXXXX/YYYYY'; // Reemplazar con tu Interstitial Ad ID

// components/CustomRewardedInterstitialAd.jsx
const adUnitId = 'ca-app-pub-XXXXX/YYYYY'; // Reemplazar con tu Rewarded Interstitial Ad ID
```

2. Asegurarte de que tu App ID de AdMob esté configurado en:
   - Android: `android/app/src/main/AndroidManifest.xml`
   - iOS: `ios/[ProjectName]/Info.plist`

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar el proyecto
npx expo start
```

## Desarrollo

Para desarrollo, los Test IDs están habilitados por defecto. Los anuncios de prueba se mostrarán en lugar de anuncios reales.

## Assets

El juego incluye:
- Múltiples sprites de pájaros
- Assets para obstáculos
- Efectos de sonido
- Música de fondo
- Iconos y elementos UI

## Estructura del Proyecto

```
BouncyBirdNative/
├── assets/           # Imágenes, sonidos y recursos
├── components/       # Componentes React reutilizables
├── hooks/           # Custom hooks (sonido, animaciones)
├── screens/         # Pantallas principales del juego
└── src/            # Lógica del juego y utilidades
```

## Tecnologías Utilizadas

- React Native
- Expo
- React Navigation
- Google AdMob
- Expo Audio (para audio)


## Licencia

MIT

## Créditos

Desarrollado con ♥️ por [Isaias]
