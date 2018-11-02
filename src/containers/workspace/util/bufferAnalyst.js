import { Toast } from '../../../utils'
import { SAnalyst } from 'imobile_for_reactnative'

async function analyst(data) {
  try {
    let { layer, bufferSetting, map } = data
    if (!layer) {
      Toast.show('请选择分析对象')
      return
    }

    if (!bufferSetting || !bufferSetting.endType) {
      Toast.show('请设置分析')
      return
    }

    let params = {
      parameter: {
        endType: bufferSetting.endType,
        leftDistance: bufferSetting.distance,
        rightDistance: bufferSetting.distance,
      },
      geoStyle: {
        lineColor: { r: 50, g: 244, b: 50 },
        lineWidth: 0.5,
        lineSymbolID: 0,
        markerSymbolID: 351,
        markerSize: { w: 10, h: 10 },
        fillForeColor: { r: 244, g: 50, b: 50 },
        fillOpaqueRate: 70,
      },
    }
    await SAnalyst.bufferAnalyst(map, layer, params)
    Toast.show('分析成功')
  } catch (e) {
    Toast.show('分析失败')
  }
}

function clear() {
  (async function() {
    await SAnalyst.clear()
  }.bind(this)())
}

export default {
  analyst,
  clear,
}
