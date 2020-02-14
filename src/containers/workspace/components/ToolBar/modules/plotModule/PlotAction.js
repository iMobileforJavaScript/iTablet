import { SMap, Action } from 'imobile_for_reactnative'
import {
  ConstToolType,
  ConstInfo,
  ConstPath,
  ToolbarType,
  TouchType,
} from '../../../../../../constants'
import { StyleUtils, Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import PlotData from './PlotData'
import NavigationService from '../../../../../NavigationService'

function commit(type) {
  const params = ToolbarModule.getParams()
  let currentToolbarType = ''
  if (type === ConstToolType.MAP_EDIT_DEFAULT) {
    // 编辑完成关闭Toolbar
    params.setToolbarVisible(false, '', {
      cb: () => {
        SMap.setAction(Action.PAN)
      },
    })
  } else if (
    type !== ConstToolType.MAP_TOOL_TAGGING &&
    type !== ConstToolType.MAP_TOOL_TAGGING_SETTING
  ) {
    currentToolbarType = ConstToolType.MAP_EDIT_DEFAULT
    // 编辑完成关闭Toolbar
    // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
    params.setToolbarVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
      isFullScreen: false,
      height: 0,
      cb: () => {
        SMap.submit()
        SMap.setAction(Action.SELECT)
      },
    })
  }
  ToolbarModule.addData({
    type: currentToolbarType,
  })
}

function listAction(type, params = {}) {
  switch (type) {
    case ConstToolType.PLOT_ANIMATION_XML_LIST:
      SMap.readAnimationXmlFile(params.item.path)
      animationPlay()
      break
    case ConstToolType.PLOT_LIB_CHANGE:
      changePlotLib(params.item)
      break
    case ConstToolType.MAP_PLOTTING_ANIMATION:
      PlotData.getAnimationList()
      break
  }
}

async function geometrySelected(event) {
  const params = ToolbarModule.getParams()
  const currentToolbarType = ToolbarModule.getData().type
  switch (currentToolbarType) {
    case ConstToolType.PLOTTING_ANIMATION: {
      let type = await SMap.getGeometryTypeById(event.layerInfo.name, event.id)
      if (type === -1) {
        Toast.show(
          getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_SYMBOL,
        )
        SMap.setAction(Action.PAN)
      }else{
        params.setToolbarVisible(
          true,
          ConstToolType.PLOT_ANIMATION_NODE_CREATE,
          {
            isFullScreen: true,
            height: ConstToolType.TOOLBAR_HEIGHT[5],
            containerType: ToolbarType.createPlotAnimation,
          },
        )
      }
      break
    }
  }
}

function showSymbol() {
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_SYMBOL, {
    isFullScreen: true,
    height:
      params.device.orientation === 'PORTRAIT'
        ? ConstToolType.HEIGHT[3]
        : ConstToolType.THEME_HEIGHT[4],
    column: params.device.orientation === 'LANDSCAPE' ? 8 : 4,
  })
}

/** 标绘分类点击事件 **/
async function showCollection(libId, symbolCode, type) {
  // await SMap.addCadLayer('PlotEdit')
  StyleUtils.setDefaultMapControlStyle().then(() => {})
  await SMap.setPlotSymbol(libId, symbolCode)
  let { data, buttons } = PlotData.getCollectionData(
    libId,
    symbolCode,
    ToolbarModule.getParams(),
  )
  if (!ToolbarModule.getParams().setToolbarVisible) return
  // ToolbarModule.getParams().setLastState()
  let column = 4
  let rows = Math.ceil(data.length / column) - 1 + 1
  let height
  switch (rows) {
    case 2:
      height = ConstToolType.HEIGHT[2]
      break
    case 1:
    default:
      height = ConstToolType.HEIGHT[0]
      break
  }
  ToolbarModule.getParams().showFullMap(true)
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    isFullScreen: false,
    height,
    data: data,
    buttons: buttons,
    column,
    cb: () => {
      ToolbarModule.getParams().setLastState()
      // createCollector(type)
    },
  })
}

function cancelAnimationWay() {
  // GLOBAL.animationWayData && (GLOBAL.animationWayData.points = null)
  // SMap.endAnimationWayPoint(false)
  const params = ToolbarModule.getParams()
  SMap.refreshAnimationWayPoint()
  let type = ConstToolType.PLOT_ANIMATION_NODE_CREATE
  params.setToolbarVisible(true, type, {
    isFullScreen: true,
    height: ConstToolType.TOOLBAR_HEIGHT[5],
    containerType: 'createPlotAnimation',
    cb: () => {},
  })
}

async function endAnimationWayPoint() {
  const params = ToolbarModule.getParams()
  let wayPoints = await SMap.endAnimationWayPoint(true)
  GLOBAL.animationWayData && (GLOBAL.animationWayData.wayPoints = wayPoints)

  let type = ConstToolType.PLOT_ANIMATION_NODE_CREATE
  params.setToolbarVisible(true, type, {
    isFullScreen: true,
    height: ConstToolType.TOOLBAR_HEIGHT[5],
    containerType: 'createPlotAnimation',
    cb: () => {},
  })
}

async function animationWayUndo() {
  await SMap.addAnimationWayPoint(null, false)
}

async function collectionSubmit(libId, symbolCode) {
  await SMap.submit()
  await SMap.refreshMap()
  SMap.setPlotSymbol(libId, symbolCode)

  ToolbarModule.getParams().getLayers(-1, async layers => {
    let plotLayer
    for (let i = 0; i < layers.length; i++)
      if (layers[i].name.indexOf('PlotEdit_') != -1) {
        plotLayer = layers[i]
        break
      }
    if (plotLayer) {
      ToolbarModule.getParams().setCurrentLayer(plotLayer)
    }
  })
}

async function cancel(libId, symbolCode) {
  SMap.cancel()
  SMap.setPlotSymbol(libId, symbolCode)
}

function undo() {
  SMap.undo()
  SMap.refreshMap()
}

function redo() {
  SMap.redo()
  SMap.refreshMap()
}

function reset() {
  // SMap.animationStop()
  SMap.animationReset()
  let height = 0
  ToolbarModule.getParams().showFullMap &&
    ToolbarModule.getParams().showFullMap(true)
  let type = ConstToolType.PLOT_ANIMATION_START
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    isFullScreen: false,
    height,
    cb: () => SMap.setAction(Action.SELECT),
  })
}

/** 切换标绘库 **/
async function changePlotLib(item) {
  const params = ToolbarModule.getParams()
  try {
    ToolbarModule.getParams().setContainerLoading(
      true,
      getLanguage(params.language).Prompt.SWITCHING_PLOT_LIB,
      //ConstInfo.MAP_CHANGING
    )
    let libIds = params.template.plotLibIds
    if (libIds !== undefined) {
      let result = await SMap.removePlotSymbolLibraryArr(libIds)
      if (result) {
        let plotPath = await FileTools.appendingHomeDirectory(
          // ConstPath.UserPath + ConstPath.RelativeFilePath.Plotting,
          item.path,
        )
        ToolbarModule.getParams().getSymbolPlots({
          path: plotPath,
          isFirst: false,
        })
      }
    }
    Toast.show(
      getLanguage(params.language).Prompt.SWITCHING_SUCCESS,
      //ConstInfo.CHANGE_MAP_TO + mapInfo.name
    )
    ToolbarModule.getParams().setContainerLoading(false)
    ToolbarModule.getParams().setVisible(false)
  } catch (e) {
    Toast.show(ConstInfo.CHANGE_PLOT_LIB_FAILED)
    params.setContainerLoading(false)
  }
}

async function animationSave() {
  const params = ToolbarModule.getParams()
  let mapName = await SMap.getMapName()
  let userName = params.user.currentUser.userName || 'Customer'
  let savePath = await FileTools.appendingHomeDirectory(
    ConstPath.UserPath +
      userName +
      '/' +
      ConstPath.RelativeFilePath.Animation +
      '/' +
      mapName,
  )
  let defaultAnimationName = mapName
  NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.PLOT_SAVE_ANIMATION,
    //'保存推演动画',
    value: defaultAnimationName,
    placeholder: getLanguage(global.language).Prompt.ENTER_ANIMATION_NAME,
    type: 'name',
    cb: async value => {
      GLOBAL.Loading &&
        GLOBAL.Loading.setLoading(
          true,
          getLanguage(global.language).Prompt.SAVEING,
        )
      await SMap.animationSave(savePath, value)

      GLOBAL.Loading && GLOBAL.Loading.setLoading(false)

      NavigationService.goBack()
      Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
    },
  })
}

function showAnimationNodeList() {
  const params = ToolbarModule.getParams()
  params.setToolbarVisible(true, ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST, {
    isFullScreen: true,
    height: ConstToolType.TOOLBAR_HEIGHT[5],
    containerType: ToolbarType.animationNode,
    // cb: () => {},
  })
}

async function showAnimationXmlList() {
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  let _data = await PlotData.getAnimationList()
  params.setToolbarVisible(true, ConstToolType.PLOT_ANIMATION_XML_LIST, {
    data: _data.data,
    buttons: _data.buttons,
    containerType: ToolbarType.list,
    isFullScreen: true,
    height:
      params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[4]
        : ConstToolType.HEIGHT[3],
  })
}

async function animationPlay() {
  const params = ToolbarModule.getParams()
  let height = ConstToolType.HEIGHT[0]
  params.showFullMap && params.showFullMap(true)
  let type = ConstToolType.PLOT_ANIMATION_PLAY
  params.setToolbarVisible(true, type, {
    isFullScreen: false,
    height,
    column: 4,
    containerType: ToolbarType.table,
    // cb: () => SMap.setAction(Action.SELECT),
  })
}

function close() {
  const params = ToolbarModule.getParams()
  const data = ToolbarModule.getData()
  if (data.type === ConstToolType.PLOTTING_ANIMATION) {
    SMap.animationClose()
    SMap.setAction(Action.PAN)
    SMap.endAnimationWayPoint(false)
    GLOBAL.TouchType = TouchType.NULL
    GLOBAL.animationWayData && (GLOBAL.animationWayData = null)
    params.setToolbarVisible(false)
  } else {
    SMap.setAction(Action.PAN)
    params.setToolbarVisible(false)
  }
  ToolbarModule.setData() // 关闭Toolbar清除临时数据
}

const actions = {
  commit,
  listAction,
  close,

  geometrySelected,
  showSymbol,
  showCollection,
  changePlotLib,
  cancelAnimationWay,
  endAnimationWayPoint,
  animationWayUndo,
  collectionSubmit,
  cancel,
  undo,
  redo,
  reset,
  animationPlay,
  animationSave,
  showAnimationNodeList,
  showAnimationXmlList,
}
export default actions
