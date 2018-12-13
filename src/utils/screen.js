import { Dimensions, PixelRatio } from 'react-native'
const defaultPixel = PixelRatio.get() //iphone6的像素密度
const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize(dp) // DP to PX
const px2dp = px => PixelRatio.roundToNearestPixel(px) // PX to DP
const deviceWidth = Dimensions.get('window').width //设备的宽度
const deviceHeight = Dimensions.get('window').height //设备的高度

//px转换成dp
const w2 = 720 / defaultPixel
const h2 = 1080 / defaultPixel
let scale = Math.min(deviceHeight / h2, deviceWidth / w2) //获取缩放比例

/**
 * 设置尺寸的大小
 * @param size: 单位：px （720*1080为模版标记的原始像素值）
 * return number dp
 */
export function scaleSize(size) {
  size = Math.round(size * scale + 0.5)
  return size / defaultPixel
}
export function setscaleSize() {
  scale = Math.min(deviceHeight / w2, deviceWidth / h2)
}
export default {
  deviceWidth,
  deviceHeight,
  px2dp,
  dp2px,
}
