import { Dimensions, PixelRatio } from 'react-native'
const defaultPixel = PixelRatio.get() //iphone6的像素密度
const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize(dp) // DP to PX
const px2dp = px => PixelRatio.roundToNearestPixel(px) // PX to DP
const deviceWidth = Dimensions.get('window').width //设备的宽度
const deviceHeight = Dimensions.get('window').height //设备的高度

//px转换成dp
let w2 = deviceWidth > 320 ? 720 / defaultPixel : 640 / defaultPixel
let h2 = deviceWidth > 320 ? 1080 / defaultPixel : 1136 / defaultPixel
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
  size = Math.round(size * scale + 0.5)
  return size / defaultPixel
}
export default {
  deviceWidth,
  deviceHeight,
  px2dp,
  dp2px,
}
