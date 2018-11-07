import { SMap } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'

const layerAdd = [
  {
    title: 'Google',
    data: [
      {
        title: 'Google roadmap',
        action: () => {},
      },
      {
        title: 'Google satellite',
        action: () => {},
      },
    ],
  },
]
const BotMap = [
  {
    title: 'Google',
    data: [
      {
        title: 'Google roadmap',
        action: () => {
          (async function() {
            await SMap.removeLayer(1)
            await SMap.removeLayer(0)
            await SMap.addLayer(ConstOnline['Google'].DSParams, 0)
          }.bind(this)())
          // SMap.openDatasource(ConstOnline['Baidu'].DSParams, 0)
          // AudioAnalyst.goToMapView('Baidu')
        },
      },
      {
        title: 'Google satellite',
        action: () => {},
      },
      {
        title: 'Google hybrid',
        action: () => {},
      },
      {
        title: 'Google terrain',
        action: () => {},
      },
    ],
  },
  {
    title: 'SuperMapCloud',
    data: [
      {
        title: 'quanguo',
        action: () => {},
      },
    ],
  },
  {
    title: 'MapWorld',
    data: [
      {
        title: '全球矢量地图',
        action: () => {},
      },
      {
        title: '全球矢量中文注记服务',
        action: () => {},
      },
      {
        title: '全球影像地图服务',
        action: () => {},
      },
    ],
  },
]

export { layerAdd, BotMap }
