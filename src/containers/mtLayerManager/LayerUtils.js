import { ConstOnline } from '../../constants'
import { SMap } from 'imobile_for_reactnative'

const baseMapsOrigin = [
  'roadmap@GoogleMaps',
  'satellite@GoogleMaps',
  'terrain@GoogleMaps',
  'hybrid@GoogleMaps',
  // 'vec@TD',
  // 'cva@TDWZ',
  // 'img@TDYXM',
  'TrafficMap@BaiduMap',
  'Standard@OpenStreetMaps',
  'CycleMap@OpenStreetMaps',
  'TransportMap@OpenStreetMaps',
  'quanguo@SuperMapCloud',
  'baseMap',
]
let baseMaps = [...baseMapsOrigin]
function isBaseLayer(name) {
  for (let i = 0, n = baseMaps.length; i < n; i++) {
    if (name.toUpperCase().indexOf(baseMaps[i].toUpperCase()) >= 0) {
      return true
    }
  }
  return false
  // if (
  //   name.indexOf('roadmap@GoogleMaps') >= 0 ||
  //   name.indexOf('satellite@GoogleMaps') >= 0 ||
  //   name.indexOf('terrain@GoogleMaps') >= 0 ||
  //   name.indexOf('hybrid@GoogleMaps') >= 0 ||
  //   name.indexOf('vec@TD') >= 0 ||
  //   name.indexOf('cva@TDWZ') >= 0 ||
  //   name.indexOf('img@TDYXM') >= 0 ||
  //   name.indexOf('TrafficMap@BaiduMap') >= 0 ||
  //   name.indexOf('Standard@OpenStreetMaps') >= 0 ||
  //   name.indexOf('CycleMap@OpenStreetMaps') >= 0 ||
  //   name.indexOf('TransportMap@OpenStreetMaps') >= 0 ||
  //   name.indexOf('quanguo@SuperMapCloud') >= 0
  // ) {
  //   return true
  // }
  // return false
}

function getBaseLayers(layers = []) {
  let arr = []
  for (let i = 0; i < layers.length; i++) {
    let name = layers[i].name
    for (let i = 0, n = baseMaps.length; i < n; i++) {
      if (name.toUpperCase().indexOf(baseMaps[i].toUpperCase()) >= 0) {
        arr.push(layers[i])
      }
    }
    // if (
    //   name.indexOf('roadmap@GoogleMaps') >= 0 ||
    //   name.indexOf('satellite@GoogleMaps') >= 0 ||
    //   name.indexOf('terrain@GoogleMaps') >= 0 ||
    //   name.indexOf('hybrid@GoogleMaps') >= 0 ||
    //   name.indexOf('vec@TD') >= 0 ||
    //   name.indexOf('cva@TDWZ') >= 0 ||
    //   name.indexOf('img@TDYXM') >= 0 ||
    //   name.indexOf('TrafficMap@BaiduMap') >= 0 ||
    //   name.indexOf('Standard@OpenStreetMaps') >= 0 ||
    //   name.indexOf('CycleMap@OpenStreetMaps') >= 0 ||
    //   name.indexOf('TransportMap@OpenStreetMaps') >= 0 ||
    //   name.indexOf('quanguo@SuperMapCloud') >= 0
    // ) {
    //   arr.push(layers[i])
    // }
  }
  GLOBAL.BaseMapSize = arr.length
  return arr
}

function setBaseMap(baseMap) {
  baseMaps = [...baseMapsOrigin]
  baseMaps = baseMaps.concat(baseMap)
}
async function addBaseMap(
  layers = [],
  data = ConstOnline['Google'],
  index,
  visible = true,
) {
  if (getBaseLayers(layers).length === 0) {
    if (data instanceof Array) {
      for (let i = data.length - 1; i >= 0; i--) {
        await SMap.openDatasource(
          data[i].DSParams,
          index !== undefined ? index : data[i].layerIndex,
          false,
          visible,
        )
      }
      GLOBAL.BaseMapSize = data.length
    } else {
      await SMap.openDatasource(
        data.DSParams,
        index !== undefined ? index : data.layerIndex,
        false,
        visible,
      )
      GLOBAL.BaseMapSize = 1
    }
  }
}

export { isBaseLayer, addBaseMap, setBaseMap }
