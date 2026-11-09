/**
 * Expo config plugin for react-native-universal-sheet.
 *
 * Expo development builds (`npx expo run:ios` / `run:android`) pick up the native code
 * through autolinking. This plugin sets the minimum platform versions the library needs:
 * iOS 15.0 for UISheetPresentationController. Android minSdk 24 is declared by the library
 * itself; apps using Expo can also set it with expo-build-properties.
 *
 * Expo Go does not contain third-party native modules, so use a development build.
 */
const {withPodfileProperties} = require('expo/config-plugins');

const IOS_DEPLOYMENT_TARGET = '15.0';

function withUniversalSheet(config) {
  return withPodfileProperties(config, config => {
    const current = config.modResults['ios.deploymentTarget'];
    if (!current || parseFloat(current) < parseFloat(IOS_DEPLOYMENT_TARGET)) {
      config.modResults['ios.deploymentTarget'] = IOS_DEPLOYMENT_TARGET;
    }
    return config;
  });
}

module.exports = withUniversalSheet;
