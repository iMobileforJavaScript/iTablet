/* eslint-disable arrow-parens */
/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang Li
*/

import { Utility } from 'imobile_for_reactnative'
import ConstPath from '../constants/ConstPath'

async function readConfig() {
  let filePath =
    (await Utility.appendingHomeDirectory(ConstPath.CustomerPath)) +
    'mapinfo.txt'

  let strJson = await Utility.readFile(filePath)
  return JSON.parse(strJson)
}

async function getMapDatasource() {
  let filePath =
    (await Utility.appendingHomeDirectory(ConstPath.CustomerPath)) +
    'mapinfo.txt'

  let strJson = await Utility.readFile(filePath)
  let jsonInfo = JSON.parse(strJson)

  return jsonInfo.data[0].maps
}

async function saveMapInfo(configInfo, mapname, dataSources) {
  let filePath =
    (await Utility.appendingHomeDirectory(ConstPath.CustomerPath)) +
    'mapinfo.txt'

  let mapList = {
    mapName: mapname + '.xml',
    UDBName: dataSources,
    plot: ['TY.plot'],
  }
  configInfo.data[0].maps.push(mapList)
  let strJson = JSON.stringify(configInfo)
  Utility.writeFile(filePath, strJson)
}
async function updateMapInfo(configInfo) {
  let filePath =
    (await Utility.appendingHomeDirectory(ConstPath.CustomerPath)) +
    'mapinfo.txt'

  let strJson = JSON.stringify(configInfo)
  Utility.writeFile(filePath, strJson)
}
function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}
export default {
  readConfig,
  getMapDatasource,
  updateMapInfo,
  saveMapInfo,
  isJSON,
}
