import { ConstOnline } from '../../constants'
import { SMap } from 'imobile_for_reactnative'

function isBaseLayer(name) {
  if (
    name === 'roadmap@GoogleMaps' ||
    name === 'satellite@GoogleMaps' ||
    name === 'terrain@GoogleMaps' ||
    name === 'hybrid@GoogleMaps' ||
    name === 'vec@TD' ||
    name === 'cva@TDWZ' ||
    name === 'img@TDYXM' ||
    name === 'TrafficMap@BaiduMap' ||
    name === 'Standard@OpenStreetMaps' ||
    name === 'CycleMap@OpenStreetMaps' ||
    name === 'TransportMap@OpenStreetMaps' ||
    name === 'quanguo@SuperMapCloud'
  ) {
    return true
  }
  return false
}

function getBaseLayers(layers = []) {
  let arr = []
  for (let i = 0; i < layers.length; i++) {
    let name = layers[i].name
    if (
      name === 'roadmap@GoogleMaps' ||
      name === 'satellite@GoogleMaps' ||
      name === 'terrain@GoogleMaps' ||
      name === 'hybrid@GoogleMaps' ||
      name === 'vec@TD' ||
      name === 'cva@TDWZ' ||
      name === 'img@TDYXM' ||
      name === 'TrafficMap@BaiduMap' ||
      name === 'Standard@OpenStreetMaps' ||
      name === 'CycleMap@OpenStreetMaps' ||
      name === 'TransportMap@OpenStreetMaps' ||
      name === 'quanguo@SuperMapCloud'
    ) {
      arr.push(layers[i])
    }
  }
  return arr
}

async function addBaseMap(
  layers = [],
  data = ConstOnline['Google'],
  index,
  visible = true,
) {
  if (getBaseLayers(layers).length == 0) {
    if (data instanceof Array) {
      for (let i = data.length - 1; i >= 0; i--) {
        await SMap.openDatasource(
          data[i].DSParams,
          index !== undefined ? index : data[i].layerIndex,
          false,
          visible,
        )
      }
    } else {
      await SMap.openDatasource(
        data.DSParams,
        index !== undefined ? index : data.layerIndex,
        false,
        visible,
      )
    }
  }
}

export { isBaseLayer, getBaseLayers, addBaseMap }
