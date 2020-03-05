/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'

function commit() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
  ToolbarModule.setData()
}

function colorAction(item) {
  SMap.setMapBackgroundColor(item.key)
}

function close() {
  const params = ToolbarModule.getParams()
  let mapXML = ToolbarModule.getData().mapXML
  SMap.mapFromXml(mapXML)
  params.setToolbarVisible(false)
  ToolbarModule.setData()
}

export default {
  close,
  commit,
  colorAction,
}
