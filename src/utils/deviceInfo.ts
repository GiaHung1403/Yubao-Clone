import { Dimensions, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

const NOTCH_DEVICES = ["iPhone X", "iPhone XS", "iPhone XS Max", "iPhone XR"];

export const isNotch = NOTCH_DEVICES.includes(DeviceInfo.getModel());
export const isIOS = Platform.OS === "ios";
export const isAndroid = !isIOS;
export const getReadableVersion = DeviceInfo.getReadableVersion();
export const getBundleId = DeviceInfo.getBundleId();

export const isIPad = () => {
  const dim = Dimensions.get("screen");
  const aspectRatio = dim.height / dim.width;

  return isIOS && aspectRatio < 1.6;
};

/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
  const dim = Dimensions.get("screen");
  return dim.height >= dim.width;
};

/**
 * Returns true of the screen is in landscape mode
 */
const isLandscape = () => {
  const dim = Dimensions.get("screen");
  return dim.width >= dim.height;
};

export default {
  isNotch,
  isIOS,
  isAndroid,
  getReadableVersion,
  getBundleId,
  isPortrait,
  isLandscape,
};
