/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SMap } from 'imobile_for_reactnative'
import MapSettingData from './MapSettingData'
import MapSettingAction from './MapSettingAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'

async function action(type) {
  const _params = ToolbarModule.getParams()
  let _data = MapSettingData.getData(type)
  _params.setToolbarVisible(true, type, {
    containerType: ToolbarType.colorTable,
    column: _params.device.orientation === 'LANDSCAPE' ? 16 : 8,
    isFullScreen: false,
    height:
      _params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[2]
        : ConstToolType.THEME_HEIGHT[3],
  })

  _params.showFullMap && _params.showFullMap(true)
  _params.navigation.navigate('MapView')
  let mapXML = await SMap.mapToXml()
  ToolbarModule.setData({
    type,
    data: _data,
    getData: MapSettingData.getData,
    actions: MapSettingAction,
    mapXML,
  })
}

export default function(title) {
  return {
    key: title,
    title: title,
    action: type => action(type),
    size: 'large',
    getData: MapSettingData.getData,
    actions: MapSettingAction,
  }
}
