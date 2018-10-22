import { Dimensions } from 'react-native'
// const defaultPixel = PixelRatio.get() // 像素密度
const deviceWidth = Dimensions.get('window').width // 设备的宽度
const deviceHeight = Dimensions.get('window').height // 设备的高度

//px转换成dp
// const w2 = 750 / defaultPixel
// const h2 = 1334 / defaultPixel
const w2 = 1600
const h2 = 2560
const scale = Math.min(deviceHeight / h2, deviceWidth / w2) // 获取缩放比例

/**
 * 设置尺寸的大小
 * @param size: 单位：px （以1600*2560为模版标记的原始像素值）
 * return number dp
 */
export function scaleSize(size) {
  return size * scale
}

export default {
  deviceWidth,
  deviceHeight,
}
