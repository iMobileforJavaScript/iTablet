import NavigationService from '../containers/NavigationService'
import { ConstOnline, Const } from '../constains'
import { Toast, dataUtil } from '../utils'
import { Action, Point2D, ThemeUnique, ColorGradientType } from 'imobile_for_javascript'

let workspace, mapControl, map, nav = {}
const keywords = {
  Baidu: '百度',
  Google: '谷歌',
  OSM: 'OSM',
  TD: '天地图',
  THEME: '专题',
}
const chineseNumber = {
  零: '零',
  一: '一',
  二: '二',
  三: '三',
  四: '四',
  五: '五',
  六: '六',
  七: '七',
  八: '八',
  九: '九',
  十: '十',
  百: '百',
  千: '千',
  万: '万',
  亿: '亿',
}
const themeType = {
  UNIQUE: '单值',
  RANGE: '分段设色',
  UNIFIED: '标签',
}

function setConfig(data) {
  if (data.workspace) {
    workspace = data.workspace
  }
  if (data.mapControl) {
    mapControl = data.mapControl
  }
  if (data.map) {
    map = data.map
  }
  if (data.nav) {
    nav = data.nav
  }
}

function analyst(content = '', obj = {}) {
  if (!content) return
  let value = '', index = -1, type =''
  let values = Object.values(keywords)
  for (let i = 0; i < values.length; i++) {
    if (content.indexOf(values[i]) >= 0) {
      value = values[i]
      break
    }
  }
  switch (value) {
    case keywords.Baidu:
      GLOBAL.AudioDialog.setVisible(false)
      goToMapView('Baidu')
      break
    case keywords.Google:
      GLOBAL.AudioDialog.setVisible(false)
      goToMapView('Google')
      break
    case keywords.OSM:
      GLOBAL.AudioDialog.setVisible(false)
      goToMapView('OSM')
      break
    case keywords.TD:
      GLOBAL.AudioDialog.setVisible(false)
      goToMapView('TD')
      break
    case keywords.THEME:
      index = getIndex(content)
      if (index >= 0) {
        type = getThmeType(content)
        setThemeByIndex(index, type)
      } else {
        openThemeByLayer(obj.layer)
      }
      break
  }
}

function getIndex(content) {
  let num = -1
  let cNum = '', numStr = ''
  let startKey = '第'
  let startKeyIndex = content.indexOf(startKey)
  if (startKeyIndex < 0) return -1
  for (let i = startKeyIndex + 1; i < content.length; i++) {
    if (!isNaN(parseInt(content[i]))){
      numStr += content[i]
    } else if (chineseNumber[content[i]]) {
      cNum += chineseNumber[content[i]]
    } else {
      break
    }
  }
  if (!cNum && !numStr) return -1
  if (numStr) {
    num = parseInt(numStr)
  } else if (cNum) {
    num = dataUtil.ChineseToNumber(cNum)
  }
  return num
}

function getThmeType(content) {
  let values = Object.values(themeType)
  for (let i = 0; i < values.length; i++) {
    if (content.indexOf(values[i]) >= 0) {
      return values[i]
    }
  }
}

/**
 * 打开矢量工作区
 * @param type
 */
function goToMapView(type) {
  (async function () {
    let key = '', exist = false
    let routes = nav.routes

    if (routes && routes.length > 0) {
      for (let index = 0; index < routes.length; index++) {
        if (routes[index].routeName === 'MapView') {
          key = index === routes.length - 1 ? '' : routes[index + 1].key
          exist = true
          break
        }
      }
    }

    if (exist && workspace && mapControl && map) {
      await map.close()
      await workspace.closeAllDatasource()
      const point2dModule = new Point2D()

      await map.setScale(0.0001)
      navigator.geolocation.getCurrentPosition(
        position => {
          let lat = position.coords.latitude
          let lon = position.coords.longitude
          ;(async () => {
            let centerPoint = await point2dModule.createObj(lon, lat)
            await map.setCenter(centerPoint)
            await mapControl.setAction(Action.PAN)
            await map.refresh()
            key && NavigationService.goBack(key)
          }).bind(this)()
        }
      )
      let DSParams = ConstOnline[type].DSParams
      let labelDSParams = ConstOnline[type].labelDSParams
      let layerIndex = ConstOnline[type].layerIndex

      let dsBaseMap = await workspace.openDatasource(DSParams)

      let dataset = await dsBaseMap.getDataset(layerIndex)
      await map.addLayer(dataset, true)

      if (ConstOnline[type].labelDSParams) {
        let dsLabel = await workspace.openDatasource(labelDSParams)
        await map.addLayer(await dsLabel.getDataset(layerIndex), true)
      }
    } else {
      NavigationService.navigate('MapView', ConstOnline[type])
    }
  }).bind(this)()
}

/**
 * 打开专题图
 * 需要在一个地图工作区，并且选中一个对象
 * @param layer
 */
function openThemeByLayer(data) {
  if (!workspace || !mapControl || !map) {
    Toast.show('请先打开地图工作区')
    return
  }
  if (!data || !data.id) {
    Toast.show('请指定一个编辑图层')
    return
  }
  GLOBAL.AudioDialog.setVisible(false)
  NavigationService.navigate('ThemeEntry', {
    layer: data.layer,
    map: map,
    mapControl: mapControl,
  })
}

/**
 * 设置专题图
 * 需要在一个地图工作区
 * @param layer
 */
function setThemeByIndex(index, type = '') {
  if (!workspace || !mapControl || !map) {
    Toast.show('请先打开地图工作区')
    return
  }
  (async function () {
    let layer = await map.getLayer(index)
    if (!type) {
      NavigationService.navigate('ThemeEdit', {
        title: Const.UNIQUE,
        layer: this.layer,
        map: this.map,
        mapControl: this.mapControl,
      })
      return
    }
    let dataset = await layer.getDataset()
    let datasetVector = await dataset.toDatasetVector()
    // await this.themeUnique.dispose()
    if (type === themeType.UNIQUE) {
      let themeUnique = await (new ThemeUnique()).makeDefault(datasetVector, 'SmID', ColorGradientType.YELLOWRED)
      await map.addThemeLayer(dataset, themeUnique, true)
    }
    await map.refresh()
    await mapControl.setAction(Action.PAN)
  }).bind(this)()
}



export default {
  analyst,
  setConfig,
}