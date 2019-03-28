/**
 * MapView辅助工具类
 */
import { SMap, GeoStyle } from 'imobile_for_reactnative'

/**
 * 设置选择集样式
 * @param layerPath
 * @param geoStyle
 * @returns {Promise.<void>}
 */
async function setSelectionStyle(layerPath = '', geoStyle) {
  if (!geoStyle) {
    geoStyle = new GeoStyle()
    geoStyle.setLineWidth(1)
    geoStyle.setLineColor(70, 128, 223)
  }
  SMap.setSelectionStyle(layerPath, geoStyle)
}

export default {
  setSelectionStyle,
}
