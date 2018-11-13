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
        title: 'Google Map',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 0)
          }.bind(this)())
        },
      },
    ],
  },
  {
    title: '天地图',
    data: [
      {
        title: 'TD Map',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TD'].DSParams, 0)
            await SMap.openDatasource(ConstOnline['TD'].labelDSParams, 0)
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
]
export { layerAdd, BotMap }
