import * as React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { ConstToolType } from '../../../../../../constants'
import { Toast, scaleSize } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import Fly3DAction from './Fly3DAction'
import { SScene } from 'imobile_for_reactnative'

async function getData(type, params) {
  if (params) {
    ToolbarModule.setParams(params)
  }
  let _data = { data: [], buttons: [] }
  if (type === ConstToolType.MAP3D_TOOL_FLYLIST) {
    _data = await getFlyList()
  } else if (type === ConstToolType.MAP3D_TOOL_FLY) {
    _data = getToolFly()
  } else if (type === ConstToolType.MAP3D_TOOL_NEWFLY) {
    _data = getNewFly()
  }
  return _data
}

async function getFlyList() {
  const params = ToolbarModule.getParams()
  let buttons = []
  let data = [
    {
      title: getLanguage(params.language).Map_Main_Menu.FLY_ROUTE,
      data: [],
    },
  ]
  try {
    let flyData = await SScene.getFlyRouteNames()
    flyData.forEach(
      item =>
        (item.image = require('../../../../../../assets/function/Frenchgrey/icon_symbolFly.png')),
    )
    let buttons = []
    buttons.push(
      <TouchableOpacity
        key={'newButton'}
        style={{
          height: scaleSize(80),
          width: scaleSize(80),
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={Fly3DAction.newFly}
      >
        <Image
          source={require('../../../../../../assets/map/Frenchgrey/scene_addfly_light.png')}
          style={{
            width: scaleSize(55),
            height: scaleSize(55),
          }}
        />
      </TouchableOpacity>,
    )
    data = [
      {
        image: require('../../../../../../assets/function/Frenchgrey/icon_symbolFly_white.png'),
        title: getLanguage(params.language).Map_Main_Menu.FLY_ROUTE,
        data: flyData,
        buttons,
      },
    ]
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.NO_FLY)
  }
  return { data, buttons }
}

function getToolFly() {
  const data = [
    {
      key: 'startFly',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
      action: () => {
        SScene.flyStart()
      },
      size: 'large',
      image: require('../../../../../../assets/mapEdit/icon_play.png'),
      selectedImage: require('../../../../../../assets/mapEdit/icon_play.png'),
    },
    {
      key: 'stop',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
      action: () => {
        SScene.flyPause()
      },
      size: 'large',
      image: require('../../../../../../assets/mapEdit/icon_stop.png'),
      selectedImage: require('../../../../../../assets/mapEdit/icon_stop.png'),
    },
  ]
  const buttons = [ToolbarBtnType.CANCEL]
  return { data, buttons }
}

function getNewFly() {
  const data = [
    {
      key: 'startFly',
      title: getLanguage(global.language).Map_Main_Menu.FLY_ADD_STOPS,
      //'添加站点',
      action: () => {
        try {
          SScene.saveCurrentRoutStop().then(result => {
            if (result) {
              Toast.show(getLanguage(global.language).Prompt.ADD_SUCCESS)
              //'添加站点成功')
            }
          })
        } catch (error) {
          Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
          //Toast.show('添加站点失败')
        }
      },
      size: 'large',
      image: require('../../../../../../assets/map/Frenchgrey/scene_addstop_dark.png'),
      selectedImage: require('../../../../../../assets/map/Frenchgrey/scene_addstop_dark.png'),
    },
    {
      key: 'stop',
      title: getLanguage(global.language).Map_Main_Menu.FLY,
      //'飞行',
      action: () => {
        try {
          SScene.saveRoutStop()
        } catch (error) {
          Toast.show(getLanguage(global.language).Prompt.PLEASE_ADD_STOP)
        }
      },
      size: 'large',
      image: require('../../../../../../assets/map/Frenchgrey/scene_play_dark.png'),
      selectedImage: require('../../../../../../assets/map/Frenchgrey/scene_play_dark.png'),
      // selectMode:"flash"
    },
    {
      key: 'pause',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
      //'暂停',
      action: () => {
        try {
          SScene.pauseRoutStop()
        } catch (error) {
          Toast.show(getLanguage(global.language).Prompt.FIELD_TO_PAUSE)
        }
      },
      size: 'large',
      image: require('../../../../../../assets/mapEdit/icon_stop.png'),
      selectedImage: require('../../../../../../assets/mapEdit/icon_stop.png'),
      // selectMode:"flash"
    },
    // {
    //   key: 'stop',
    //   title: '清除所有站点',
    //   action: () => {
    //     try {
    //       SScene.clearRoutStops()
    //     } catch (error) {
    //       console.warn(error)
    //     }
    //   },
    //   size: 'large',
    //   image: require('../../../../assets/mapEdit/icon_stop.png'),
    //   selectedImage: require('../../../../assets/mapEdit/icon_stop.png'),
    //   // selectMode:"flash"
    // },
  ]
  const buttons = [ToolbarBtnType.CANCEL]
  return { data, buttons }
}

export default {
  getData,
  getFlyList,
  getToolFly,
  getNewFly,
}
