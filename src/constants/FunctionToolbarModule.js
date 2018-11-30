import { SMap } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'

const layerAdd = [
  {
    title: '选择数据源',
    data: [
      {
        title: '选择目录',
      },
    ],
  },
]
const BotMap = [
  {
    title: 'Google',
    data: [
      {
        title: 'Google RoadMap',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: 'Google Staelite',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 1)
          }.bind(this)())
        },
      },
      {
        title: 'Google Terrain',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 2)
          }.bind(this)())
        },
      },
      {
        title: 'Google Hybrid',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 3)
          }.bind(this)())
        },
      },
    ],
  },
  {
    title: 'MapWorld',
    data: [
      {
        title: '全球矢量地图（经纬度）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TDJWD'].DSParams, 0)
            await SMap.openDatasource(ConstOnline['TDJWD'].labelDSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: '全球矢量地图（墨卡托）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TD'].DSParams, 0)
            await SMap.openDatasource(ConstOnline['TD'].labelDSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: '全球影像地图服务（经纬度）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TDYX'].DSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: '全球影像地图服务（墨卡托）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TDYXM'].DSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: '全球地形晕渲地图服务（经纬度）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TDQ'].DSParams, 0)
          }.bind(this)())
        },
      },
    ],
  },
  {
    title: 'Baidu',
    data: [
      {
        title: 'Baidu Map',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Baidu'].DSParams, 0)
          }.bind(this)())
        },
      },
    ],
  },
  {
    title: 'OSM',
    data: [
      {
        title: 'OSM Map',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['OSM'].DSParams, 0)
          }.bind(this)())
        },
      },
    ],
  },
  {
    title: 'SuperMapCloud',
    data: [
      {
        title: 'quanguo',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['SuperMapCloud'].DSParams, 0)
          }.bind(this)())
        },
      },
    ],
  },
]
const openData = [
  {
    title: '地图',
    data: [
      {
        title: '选择目录',
      },
    ],
  },
]
export { layerAdd, BotMap ,openData}
