import { Dimensions, PixelRatio } from 'react-native'
const defaultPixel = PixelRatio.get() //iphone6的像素密度
const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize(dp) // DP to PX
const px2dp = px => PixelRatio.roundToNearestPixel(px) // PX to DP
const fontScale = PixelRatio.getFontScale()
const deviceWidth = Dimensions.get('window').width //设备的宽度
const deviceHeight = Dimensions.get('window').height //设备的高度
let scale2
//px转换成dp
// let w2 = 720 / defaultPixel
// let h2 = 1080 / defaultPixel
// let scale, scaleWidth2, scaleHeight2 //获取缩放比例
// if (deviceWidth > deviceHeight) {
//   scale = Math.min(deviceHeight / w2, deviceWidth / h2)
// } else {
//   scale = Math.min(deviceHeight / h2, deviceWidth / w2)
// }

// if (deviceWidth > deviceHeight) {
//   scaleWidth2 = deviceWidth / 540
//   scaleHeight2 = deviceHeight / 360
// } else {
//   scaleWidth2 = deviceWidth / 360
//   scaleHeight2 = deviceHeight / 540
// }

/**
 * 设置尺寸的大小
 * @param size: 单位：px （720*1080为模版标记的原始像素值）
 * return number dp
 */
// export function scaleSize2(size) {
//   size = Math.round(size * scale + 0.5)
//   return size / defaultPixel
// }

// export function scaleWidth(size) {
//   size = size * scaleWidth2
//   return size
// }

// export function scaleHeight(size) {
//   size = size * scaleHeight2
//   return size
// }

if (deviceWidth > deviceHeight) {
  scale2 = Math.min(deviceHeight / 360, deviceWidth / 540)
} else {
  scale2 = Math.min(deviceHeight / 540, deviceWidth / 360)
}

export function scaleSize(size) {
  size = size * scale2
  return size
}

export function setSpText(size) {
  size = Math.round(((size * scale2 + 0.5) * defaultPixel) / fontScale)
  return size / defaultPixel
}

export default {
  deviceWidth,
  deviceHeight,
  px2dp,
  dp2px,
  setSpText,
}
