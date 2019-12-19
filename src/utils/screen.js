import { Dimensions, PixelRatio, Platform } from 'react-native'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'
const defaultPixel = PixelRatio.get() //iphone6的像素密度
const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize(dp) // DP to PX
const px2dp = px => PixelRatio.roundToNearestPixel(px) // PX to DP
let deviceWidth = getScreenWidth() //Dimensions.get('window').width //设备的宽度
let deviceHeight = getScreenHeight() //Dimensions.get('window').height //设备的高度
let deviceSafeHeight //设备安全高度
//const defaultPixel = 2.25
// const fontScale = PixelRatio.getFontScale()

function getScreenWidth() {
  deviceWidth = Dimensions.get('window').width
  return deviceWidth
}
function getScreenHeight() {
  deviceHeight = Dimensions.get('window').height
  return deviceHeight
}
function getScreenSafeHeight() {
  if (Platform.OS === 'ios') return getScreenHeight()
  let screenHeight = ExtraDimensions.getRealWindowHeight()
  if (getScreenHeight() < getScreenWidth()) {
    screenHeight = ExtraDimensions.getRealWindowWidth()
  }
  deviceSafeHeight = screenHeight - ExtraDimensions.getStatusBarHeight()
  return deviceSafeHeight
}

//px转换成dp
// let w2 = deviceWidth > 320 ? 720 / defaultPixel : 640 / defaultPixel
// let h2 = deviceWidth > 320 ? 1080 / defaultPixel : 1136 / defaultPixel
let w2 = 610 / defaultPixel
let h2 = 1080 / defaultPixel
let scale //获取缩放比例
if (deviceWidth > deviceHeight) {
  scale = Math.min(deviceHeight / w2, deviceWidth / h2)
} else {
  scale = Math.min(deviceHeight / h2, deviceWidth / w2)
}

/**
 * 设置尺寸的大小
 * @param size: 单位：px （720*1080为模版标记的原始像素值）
 * return number dp
 */
export function scaleSize(size) {
  size = (size * scale) / defaultPixel
  return size
}

export function setSpText(size) {
  // size = Math.round(((size * scale + 0.5) * pixelRatio) / fontScale)
  size = Math.round(size * scale + 0.5)
  // if (Platform.OS === 'ios') {
  //   return (size * 1.25) / defaultPixel
  // }
  return size / defaultPixel
}

export default {
  getScreenWidth,
  getScreenHeight,
  getScreenSafeHeight,
  deviceWidth,
  deviceHeight,
  px2dp,
  dp2px,
}
