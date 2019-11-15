import { SMap } from 'imobile_for_reactnative'
import constants from '../../../../constants'
import { ConstToolType, ConstPath } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { getPublicAssets } from '../../../../../../assets'
import ToolbarModule from '../../modules/ToolbarModule'
import PlotAction from './PlotAction'

function getData(type, params) {
  let tabBarData = {}
  if (
    type === ConstToolType.PLOT_ANIMATION_START ||
    type === ConstToolType.PLOT_ANIMATION_NODE_CREATE ||
    type === ConstToolType.PLOT_ANIMATION_PLAY ||
    type === ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST
    // ||type === ConstToolType.PLOT_ANIMATION_XML_LIST
  ) {
    tabBarData = getPlotOperationData(type, params)
  } else if (type === ConstToolType.PLOT_ANIMATION_WAY) {
    tabBarData = getAnimationWayData(type, params)
  }
  return tabBarData
}

/**
 * 获取标绘操作数据
 */
function getPlotOperationData(type, params) {
  ToolbarModule.setParams(params)
  let data = [],
    buttons = [
      // ToolbarBtnType.END_ANIMATION,
      ToolbarBtnType.CANCEL,
      // ToolbarBtnType.PLOT_ANIMATION_XML_LIST,
      {
        type: ToolbarBtnType.SHOW_LIST,
        image: getPublicAssets().plot.plot_animation_list,
        action: PlotAction.showAnimationXmlList,
      },
      // ToolbarBtnType.PLOT_ANIMATION_PLAY,
      {
        type: ToolbarBtnType.PLAY,
        image: getPublicAssets().plot.plot_play,
        action: PlotAction.animationPlay,
      },
      // ToolbarBtnType.PLOT_ANIMATION_GO_OBJECT_LIST,
      {
        type: ToolbarBtnType.SHOW_NODE_LIST,
        image: require('../../../../../../assets/mapEdit/icon_function_theme_param_menu.png'),
        action: PlotAction.showAnimationNodeList,
      },
      {
        type: ToolbarBtnType.SAVE,
        image: require('../../../../../../assets/mapTools/icon_save.png'),
        action: PlotAction.animationSave,
      },
    ]
  switch (type) {
    case ConstToolType.PLOT_ANIMATION_START:
      data = []
      break
    case ConstToolType.PLOT_ANIMATION_NODE_CREATE:
      data = []
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.PLOT_ANIMATION_XML_LIST:
      data = []
      break
    case ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST:
      data = getAnimationNodeListData()
      break
    case ConstToolType.PLOT_ANIMATION_PLAY:
      data = [
        {
          key: 'startFly',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
          //'开始播放',
          action: () => {
            SMap.initAnimation()
            SMap.animationPlay()
          },
          size: 'large',
          image: require('../../../../../../assets/mapEdit/icon_play.png'),
          selectedImage: require('../../../../../../assets/mapEdit/icon_play.png'),
        },
        {
          key: 'stop',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
          //'暂停',
          action: () => {
            SMap.animationPause()
          },
          size: 'large',
          image: require('../../../../../../assets/mapEdit/icon_stop.png'),
          selectedImage: require('../../../../../../assets/mapEdit/icon_stop.png'),
          // selectMode:"flash"
        },
        {
          key: 'reset',
          title: getLanguage(global.language).Map_Main_Menu
            .PLOTTING_ANIMATION_RESET,
          //'复原',
          action: () => PlotAction.reset(),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_cancel_1.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_cancel_1.png'),
          // selectMode:"flash"
        },
      ]
  }

  return { data, buttons }
}

function getAnimationNodeListData() {
  let animationNodeList = []
  let data = [
    {
      title: getLanguage(global.language).Map_Main_Menu
        .PLOTTING_ANIMATION_DEDUCTION,
      // '态势推演列表',
      data: animationNodeList,
    },
  ]
  return data
}

/**
 * 获取创建路径按钮数据
 */
function getAnimationWayData(type, params) {
  ToolbarModule.setParams(params)
  let data = [],
    buttons = []
  switch (type) {
    case ConstToolType.PLOT_ANIMATION_WAY:
      data.push({
        key: constants.CANCEL,
        title: getLanguage(global.language).Map_Plotting
          .PLOTTING_ANIMATION_BACK,
        // constants.CANCEL,
        action: PlotAction.cancelAnimationWay,
        size: 'large',
        image: require('../../../../../../assets/mapTools/icon_close_black.png'),
      })
      data.push({
        key: constants.UNDO,
        title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
        action: PlotAction.animationWayUndo,
        size: 'large',
        image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
      })
      data.push({
        key: constants.SUBMIT,
        title: getLanguage(global.language).Map_Plotting
          .PLOTTING_ANIMATION_SAVE,
        action: PlotAction.endAnimationWayPoint,
        size: 'large',
        image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
      })
      break
  }

  buttons = [ToolbarBtnType.END_ANIMATION]

  return { data, buttons }
}

/**
 * 获取采集操作数据
 * @param type
 * @returns {*}
 */
function getCollectionData(libId, symbolCode, params) {
  ToolbarModule.setParams(params)
  let data = [],
    buttons = []
  data.push({
    key: constants.UNDO,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
    // constants.UNDO,
    action: PlotAction.undo,
    size: 'large',
    image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
  })
  data.push({
    key: constants.REDO,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
    //constants.REDO,
    action: PlotAction.redo,
    size: 'large',
    image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
  })

  data.push({
    key: constants.CANCEL,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_CANCEL,
    // constants.CANCEL,
    action: () => PlotAction.cancel(libId, symbolCode),
    size: 'large',
    image: require('../../../../../../assets/mapTools/icon_close_black.png'),
  })
  data.push({
    key: constants.SUBMIT,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_SUBMIT,
    //constants.SUBMIT,
    action: () => PlotAction.collectionSubmit(libId, symbolCode),
    size: 'large',
    image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
  })
  buttons = [
    ToolbarBtnType.CANCEL,
    // ToolbarBtnType.CHANGE_COLLECTION,
    {
      type: ToolbarBtnType.MAP_SYMBOL,
      image: require('../../../../../../assets/mapEdit/icon_function_symbol.png'),
      action: PlotAction.showSymbol,
    },
    ToolbarBtnType.COMPLETE,
  ]

  return { data, buttons }
}

async function getAnimationList() {
  const params = ToolbarModule.getParams()
  try {
    let mapName = await SMap.getMapName()

    let userName = params.user.currentUser.userName || 'Customer'
    let path = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        userName +
        '/' +
        ConstPath.RelativeFilePath.Animation +
        mapName +
        '/',
    )
    let animationXmlList = []
    let arrDirContent = await FileTools.getDirectoryContent(path)
    if (arrDirContent.length > 0) {
      let i = 0
      for (let key in arrDirContent) {
        if (arrDirContent[key].type === 'file') {
          let item = {}
          item.title = arrDirContent[key].name.split('.')[0]
          item.index = i
          item.path = path + arrDirContent[key].name
          animationXmlList.push(item)
          i++
        }
      }
    }

    if (animationXmlList.length === 0) {
      Toast.show(
        getLanguage(params.language).Prompt.NO_PLOTTING_DEDUCTION,
        //'当前场景无态势推演'
      )
    } else {
      SMap.initAnimation()
    }

    let data = [
      {
        title: getLanguage(params.language).Map_Main_Menu
          .PLOTTING_ANIMATION_DEDUCTION,
        // '态势推演列表',
        data: animationXmlList,
      },
    ]
    let buttons = []
    return { data, buttons }
  } catch (error) {
    let buttons = []
    let data = [
      {
        title: getLanguage(params.language).Map_Main_Menu
          .PLOTTING_ANIMATION_DEDUCTION,
        // '态势推演列表',
        data: [],
      },
    ]
    Toast.show(
      getLanguage(params.language).Prompt.NO_PLOTTING_DEDUCTION,
      //'当前场景无态势推演'
    )
    return { data, buttons }
  }
}

export default {
  getData,
  getCollectionData,
  getPlotOperationData,
  getAnimationWayData,
  getAnimationList,
}
