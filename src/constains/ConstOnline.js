export default {
  TD: {
    type: 'ONLINE',
    DSParams: { server: 'http://t0.tianditu.com/vec_w/wmts', engineType: 23, driver: 'WMTS', alias: 'baseMap' },
    labelDSParams: { server: 'http://t0.tianditu.com/cva_w/wmts', engineType: 23, driver: 'WMTS', alias: 'label' },
    layerIndex: 0,
    mapName: '天地图',
  },
  Baidu: {
    type: 'ONLINE',
    DSParams: { server: 'http://www.baidu.com', engineType: 227 },
    labelDSParams: false,
    layerIndex: 0,
    mapName: '百度地图',
  },
  Google: {
    type: 'ONLINE',
    DSParams: { server: 'http://www.google.cn/maps', engineType: 223 },
    labelDSParams: false,
    layerIndex: 'roadmap',
    mapName: 'GOOGLE地图',
  },
  OSM: {
    type: 'ONLINE',
    DSParams: { server: 'http://openstreetmap.org', engineType: 228 },
    labelDSParams: false,
    layerIndex: 0,
    mapName: 'OSM',
  },
}