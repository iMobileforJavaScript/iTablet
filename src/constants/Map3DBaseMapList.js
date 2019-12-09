// import NavigationService from '../containers/NavigationService'
export default {
  baseListData: [
    {
      title: '在线底图',
      index: 0,
      show: true,
      data: [
        // {
        //   title: 'STK',
        //   index: 0,
        //   show: true,
        //   type: 'terrainLayer',
        //   name: 'stk',
        //   url: 'https://assets.agi.com/stk-terrain/world',
        // },
        {
          title: 'BingMap',
          index: 0,
          show: true,
          type: 'l3dBingMaps',
          name: 'bingmap',
          url: 'http://t0.tianditu.com/img_c/wmts',
        },
      ],
    },
    // {
    //   title: 'SuperMapCloud',
    //   index: 1,
    //   data: [
    //     {
    //       title: 'quanguo',
    //       index: 1,
    //       show: true,
    //       type: 'baseData',
    //     },
    //   ],
    // },
    // {
    //   title: 'MapWorld',
    //   index: 2,
    //   data: [
    //     {
    //       title: '全球矢量地图(经纬度)',
    //       index: 2,
    //       show: true,
    //       type: 'baseData',
    //     },
    //     {
    //       title: '全球矢量地图(墨卡托)',
    //       index: 2,
    //       show: true,
    //       type: 'baseData',
    //     },
    //     {
    //       title: '全球矢量中文注记服务(经纬度)',
    //       index: 2,
    //       show: true,
    //       type: 'baseData',
    //     },
    //     {
    //       title: '全球矢量中文注记服务(墨卡托)',
    //       index: 2,
    //       show: true,
    //       type: 'baseData',
    //     },
    //     {
    //       title: '全球影像地图服务(经纬度)',
    //       index: 2,
    //       show: true,
    //       type: 'baseData',
    //     },
    //     {
    //       title: '全球影像地图服务(墨卡托)',
    //       index: 2,
    //       show: true,
    //       type: 'baseData',
    //     },
    //     {
    //       title: '全球地形晕渲地图服务(经纬度)',
    //       index: 2,
    //       show: true,
    //       type: 'baseData',
    //     },
    //   ],
    // },
  ],
  layerListdata: [
    // {
    //   index: 1,
    //   data: [
    //     // {
    //     //   title: '影像缓存图层',
    //     //   type: 'layerData',
    //     // },
    //     // {
    //     //   title: '三维切片缓存图层',
    //     //   type: 'layerData',
    //     // },
    //     // {
    //     //   title: '矢量缓存图层',
    //     //   type: 'layerData',
    //     // },
    //     // {
    //     //   title: '地图缓存图层',
    //     //   type: 'layerData',
    //     // },
    //     // {
    //     //   title: '栅格体数据缓存图层',
    //     //   type: 'layerData',
    //     // },
    //     // {
    //     //   title: '地形缓存图层',
    //     //   type: 'layerData',
    //     // },
    //   ],
    // },
    {
      index: 2,
      data: [
        {
          title: 'KML图层',
          type: 'layerData',
          action: () => {
            // NavigationService.navigate('WorkspaceFileList', { type: 'MAP_3D' })
          },
        },
      ],
    },
    // {
    //   index: 3,
    //   data: [
    //     {
    //       title: 'iServer图层服务',
    //       type: 'layerData',
    //     },
    //     {
    //       title: 'OGC服务图层',
    //       type: 'layerData',
    //     },
    //     {
    //       title: '天地图服务图层',
    //       type: 'layerData',
    //     },
    //   ],
    // },
  ],
}
