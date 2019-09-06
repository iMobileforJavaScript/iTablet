export default {
  TD: [
    {
      type: 'Datasource',
      DSParams: {
        server: 'http://t0.tianditu.com/vec_w/wmts?DPI=96',
        engineType: 23,
        driver: 'WMTS',
        alias: 'TD',
      },
      layerIndex: 0,
      mapName: '墨卡托',
    },
    {
      type: 'Datasource',
      DSParams: {
        server: 'http://t0.tianditu.com/cva_w/wmts?DPI=96',
        engineType: 23,
        driver: 'WMTS',
        alias: 'TDWZ',
      },
      layerIndex: 0,
      mapName: '墨卡托文字标注',
    },
  ],
  TDJWD: [
    {
      type: 'Datasource',
      DSParams: {
        server: 'http://t0.tianditu.com/vec_c/wmts?DPI=96',
        engineType: 23,
        driver: 'WMTS',
        alias: 'TDJWD',
      },
      layerIndex: 0,
      mapName: '经纬度',
    },
    {
      type: 'Datasource',
      DSParams: {
        server: 'http://t0.tianditu.com/cva_c/wmts?DPI=96',
        engineType: 23,
        driver: 'WMTS',
        alias: 'TDJWDWZ',
      },
      layerIndex: 0,
      mapName: '经纬度文字标注',
    },
  ],
  TDYX: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/img_c/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDYX',
    },
    layerIndex: 0,
    mapName: '影像经纬度',
  },
  TDYXM: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/img_w/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDYXM',
    },
    layerIndex: 0,
    mapName: '影像墨卡托',
  },
  TDQ: {
    type: 'Datasource',
    DSParams: {
      server: 'http://t0.tianditu.com/ter_c/wmts?DPI=96',
      engineType: 23,
      driver: 'WMTS',
      alias: 'TDQ',
    },
    layerIndex: 0,
    mapName: '全球地形',
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
      server: 'http://www.google.CN/maps',
      engineType: 223,
      alias: 'GoogleMaps',
    },
    layerIndex: 3,
    mapName: 'GOOGLE地图',
  },
  BingMap: {
    type: 'Datasource',
    DSParams: {
      server: 'http://cn.bing.com/ditu',
      engineType: 230,
      alias: 'bingMap',
    },
    layerIndex: 0,
    mapName: 'Bing地图',
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
  TrafficMap: {
    type: 'Datasource',
    DSParams: {
      server:
        'https://www.supermapol.com/iserver/services/traffic/rest/maps/tencent',
      engineType: 225,
      alias: 'TrafficMap',
    },
    layerIndex: 0,
    mapName: 'TrafficMap',
  },
}
