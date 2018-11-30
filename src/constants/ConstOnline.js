export default {
  TD: [
    {
      type: 'Datasource',
      DSParams: {
        server: 'http://t0.tianditu.com/vec_w/wmts',
        engineType: 23,
        driver: 'WMTS',
        alias: 'baseMap',
      },
      layerIndex: 0,
      mapName: '天地图(墨卡托)',
    },
    {
      type: 'Datasource',
      DSParams: {
        server: 'http://t0.tianditu.com/cva_w/wmts',
        engineType: 23,
        driver: 'WMTS',
        alias: 'label',
      },
      layerIndex: 0,
      mapName: '天地图(墨卡托)',
    },
  ],
  TDJWD: [
    {
      type: 'Datasource',
      DSParams: {
        server: 'http://t0.tianditu.com/vec_c/wmts',
        engineType: 23,
        driver: 'WMTS',
        alias: 'baseMap',
      },
      layerIndex: 0,
      mapName: '天地图（经纬度）',
    },
    {
      type: 'Datasource',
      DSParams: {
        server: 'http://t0.tianditu.com/cva_c/wmts',
        engineType: 23,
        driver: 'WMTS',
        alias: 'label',
      },
      layerIndex: 0,
      mapName: '天地图（经纬度）',
    },
  ],
  TDYX: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/img_c/wmts',
      engineType: 23,
      driver: 'WMTS',
      alias: 'baseMap',
    },
    layerIndex: 0,
    mapName: '天地图（影像经纬度）',
  },
  TDYXM: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/img_w/wmts',
      engineType: 23,
      driver: 'WMTS',
      alias: 'baseMap',
    },
    layerIndex: 0,
    mapName: '天地图（影像墨卡托）',
  },
  TDQ: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/ter_c/wmts',
      engineType: 23,
      driver: 'WMTS',
      alias: 'baseMap',
    },
    layerIndex: 0,
    mapName: '天地图（全球地形）',
  },
  Baidu: {
    type: 'Datasource',
    DSParams: {
      server: 'http://www.baidu.com',
      engineType: 227,
      alias: 'BaiduMap',
    },
    layerIndex: 0,
    mapName: '百度地图',
  },
  Google: {
    type: 'Datasource',
    DSParams: {
      server: 'http://www.google.cn/maps',
      engineType: 223,
      alias: 'GoogleMaps',
    },
    layerIndex: 0,
    mapName: 'GOOGLE地图',
  },
  OSM: {
    type: 'Datasource',
    DSParams: {
      server: 'http://openstreetmap.org',
      engineType: 228,
      alias: 'OpenStreetMaps',
    },
    layerIndex: 0,
    mapName: 'OSM',
  },
  SuperMapCloud: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t2.supermapcloud.com',
      engineType: 224,
      alias: 'SuperMapCloud',
    },
    layerIndex: 0,
    mapName: 'SuperMapCloud',
  },
}
