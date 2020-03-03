import constants from '../../../../constants'
import { SThemeCartography, RangeMode } from 'imobile_for_reactnative'
import ToolbarBtnType from '../../ToolbarBtnType'
import {
  ConstToolType,
  ConstPath,
  Const,
  ToolbarType,
} from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import { getPublicAssets, getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'
import ThemeData from './ThemeData'
import ThemeAction from './ThemeAction'
import NavigationService from '../../../../../NavigationService'

/**
 *
 * @param type
 * @param filter
 *    {
 *      typeFilter: ['POINT', 'CAD', 'REGION', 'LINE'], // 空为全部查询
 *    }
 * @returns {Promise.<void>}
 */
async function showDatasetsList(type, filter = {}) {
  let isAnyOpenedDS = await SThemeCartography.isAnyOpenedDS()
  if (!isAnyOpenedDS) {
    Toast.show(
      getLanguage(global.language).Prompt.PLEASE_ADD_DATASOURCE_BY_UNIFORM,
    )
    return
  }
  let data = []
  let checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)#$/
  SThemeCartography.getAllDatasetNames().then(getdata => {
    getdata.reverse()
    for (let i = 0; i < getdata.length; i++) {
      let datalist = getdata[i]
      if (datalist.datasource.alias.match(checkLabelAndPlot)) continue
      let list = []
      datalist.list.forEach(item => {
        let isExist = false
        if (filter.typeFilter && filter.typeFilter.length > 0) {
          for (let j = 0; j < filter.typeFilter.length; j++) {
            if (item.datasetType === filter.typeFilter[j]) {
              isExist = true
            }
          }
        } else {
          isExist = true
        }
        if (!isExist) return
        if (item.geoCoordSysType && item.prjCoordSysType) {
          item.info = {
            infoType: 'dataset',
            geoCoordSysType: item.geoCoordSysType,
            prjCoordSysType: item.prjCoordSysType,
          }
        }
        list.push(item)
      })
      if (list.length === 0) return
      data.push({
        title: datalist.datasource.alias,
        image: require('../../../../../../assets/mapToolbar/list_type_udb.png'),
        data: list,
      })
    }
    const buttons = [ToolbarBtnType.THEME_CANCEL]
    const height =
      ToolbarModule.getParams().device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[3]
        : ConstToolType.THEME_HEIGHT[5]
    const _type = ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS
    let _data = {
      type: _type,
      getData: ThemeData.getData,
      lastData: {
        data,
        buttons,
        height,
      },
      actions: ThemeAction,
    }
    ToolbarModule.addData(_data)
    ToolbarModule.getParams().setToolbarVisible &&
      ToolbarModule.getParams().setToolbarVisible(true, _type, {
        containerType: ToolbarType.list,
        isFullScreen: true,
        isTouchProgress: false,
        showMenuDialog: false,
        height,
        data,
        buttons,
      })
    ToolbarModule.getParams().scrollListToLocation &&
      ToolbarModule.getParams().scrollListToLocation()
  })
}

function showExpressionList(type, themeType) {
  let listSelectable = type === 'ThemeGraph'
  if (!ToolbarModule.getData().currentLayer) return
  SThemeCartography.getThemeExpressionByLayerName(
    global.language,
    ToolbarModule.getData().currentLayer.name,
  ).then(getdata => {
    let dataset = getdata.dataset
    let allExpressions = []
    getdata.list.forEach(item => {
      if (isThemeFieldTypeAvailable(item.fieldTypeStr, themeType)) {
        item.info = {
          infoType: 'fieldType',
          fieldType: item.fieldType,
        }
        allExpressions.push(item)
      }
    })
    let data = [
      {
        title: dataset.datasetName,
        datasetType: dataset.datasetType,
        expressionType: true,
        data: allExpressions,
      },
    ]
    const buttons = listSelectable
      ? [ToolbarBtnType.THEME_CANCEL, ToolbarBtnType.TOOLBAR_COMMIT]
      : [ToolbarBtnType.THEME_CANCEL]
    const height =
      ToolbarModule.getParams().device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[3]
        : ConstToolType.THEME_HEIGHT[5]
    let _data = {
      type: type,
      getData: ThemeData.getData,
      lastData: {
        data,
        buttons,
        height,
      },
      actions: ThemeAction,
    }
    ToolbarModule.addData(_data)
    ToolbarModule.getParams().setToolbarVisible &&
      ToolbarModule.getParams().setToolbarVisible(
        true,
        ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME,
        {
          containerType: listSelectable
            ? ToolbarType.selectableList
            : ToolbarType.list,
          isFullScreen: true,
          isTouchProgress: false,
          showMenuDialog: false,
          height,
          data,
          buttons,
        },
      )
    ToolbarModule.getParams().scrollListToLocation &&
      ToolbarModule.getParams().scrollListToLocation()
  })
}

//通过数据集->创建栅格单值专题图
async function createThemeGridUniqueMap(params) {
  let paramsTheme = {}
  let isSuccess = false
  // let errorInfo = ''
  paramsTheme = {
    DatasourceAlias: params.themeDatasourceAlias,
    DatasetName: params.themeDatasetName,
    GridUniqueColorScheme: 'EE_Lake',
  }
  await SThemeCartography.createThemeGridUniqueMap(paramsTheme).then(msg => {
    isSuccess = msg.Result
    // errorInfo = msg.Error && msg.Error
  })
  // .catch(err => {
  //   errorInfo = err.message
  // })
  if (isSuccess) {
    // Toast.show('创建专题图成功')
    //设置当前图层
    ToolbarModule.getParams().getLayers(-1, layers => {
      ToolbarModule.getParams().setCurrentLayer(layers.length > 0 && layers[0])
    })
    ToolbarModule.getParams().setToolbarVisible(false)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_A_RASTER_LAYER)
  }
}

//通过数据集->创建栅格分段专题图
async function createThemeGridRangeMap(params) {
  let paramsTheme = {}
  let isSuccess = false
  // let errorInfo = ''
  paramsTheme = {
    DatasourceAlias: params.themeDatasourceAlias,
    DatasetName: params.themeDatasetName,
    GridRangeColorScheme: 'FF_Blues',
  }
  await SThemeCartography.createThemeGridRangeMap(paramsTheme).then(msg => {
    isSuccess = msg.Result
    // errorInfo = msg.Error && msg.Error
  })
  // .catch(err => {
  //   errorInfo = err.message
  // })
  if (isSuccess) {
    // Toast.show('创建专题图成功')
    //设置当前图层
    ToolbarModule.getParams().getLayers(-1, layers => {
      ToolbarModule.getParams().setCurrentLayer(layers.length > 0 && layers[0])
    })
    ToolbarModule.getParams().setToolbarVisible(false)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_A_RASTER_LAYER)
  }
}

//通过图层->创建栅格单值专题图
async function createThemeGridUniqueMapByLayer() {
  const _params = ToolbarModule.getParams()
  let paramsTheme = {}
  let isSuccess = false
  // let errorInfo = ''
  paramsTheme = {
    LayerName: _params.currentLayer.name,
    GridUniqueColorScheme: 'EE_Lake',
  }
  await SThemeCartography.createThemeGridUniqueMapByLayer(paramsTheme).then(
    msg => {
      isSuccess = msg.Result
      // errorInfo = msg.Error && msg.Error
    },
  )
  // .catch(err => {
  //   errorInfo = err.message
  // })
  if (isSuccess) {
    // Toast.show('创建专题图成功')
    //设置当前图层
    ToolbarModule.getParams().getLayers(-1, layers => {
      ToolbarModule.getParams().setCurrentLayer(layers.length > 0 && layers[0])
    })
    ToolbarModule.getParams().setToolbarVisible(false)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_A_RASTER_LAYER)
  }
}

//通过图层->创建栅格分段专题图
async function createThemeGridRangeMapByLayer() {
  const _params = ToolbarModule.getParams()
  let paramsTheme = {}
  let isSuccess = false
  // let errorInfo = ''
  paramsTheme = {
    LayerName: _params.currentLayer.name,
    GridRangeColorScheme: 'FF_Blues',
  }
  await SThemeCartography.createThemeGridRangeMapByLayer(paramsTheme).then(
    msg => {
      isSuccess = msg.Result
      // errorInfo = msg.Error && msg.Error
    },
  )
  // .catch(err => {
  //   errorInfo = err.message
  // })
  if (isSuccess) {
    // Toast.show('创建专题图成功')
    //设置当前图层
    ToolbarModule.getParams().getLayers(-1, layers => {
      ToolbarModule.getParams().setCurrentLayer(layers.length > 0 && layers[0])
    })
    ToolbarModule.getParams().setToolbarVisible(false)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_A_RASTER_LAYER)
  }
}

/**
 * 通过图层创建专题图
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getThemeMapCreate(type) {
  let data = [],
    buttons = []
  if (
    type !== ConstToolType.MAP_THEME_CREATE_BY_LAYER &&
    type !== ConstToolType.MAP_THEME_CREATE
  )
    return { data, buttons }
  data = [
    {
      //统一风格
      key: constants.THEME_UNIFY_STYLE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_UNIFORM_MAP,
      //constants.THEME_UNIFY_STYLE,
      action: getUnifyStyleAdd,
      size: 'large',
      image: getThemeAssets().themeType.theme_create_unify_style,
      selectedImage: getThemeAssets().themeType.theme_create_unify_style,
    },
    {
      //单值风格
      key: constants.THEME_UNIQUE_STYLE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_UNIQUE_VALUES_MAP,
      //constants.THEME_UNIQUE_STYLE,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('Theme')
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_create_unique_style,
      selectedImage: getThemeAssets().themeType.theme_create_unique_style,
    },
    {
      //分段风格
      key: constants.THEME_RANGE_STYLE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_RANGES_MAP,
      // constants.THEME_RANGE_STYLE,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('Theme')
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_create_range_style,
      selectedImage: getThemeAssets().themeType.theme_create_range_style,
    },
    // {
    //   //自定义风格
    //   key: constants.THEME_CUSTOME_STYLE,
    //   title: constants.THEME_CUSTOME_STYLE,
    //   size: 'large',
    //   action: showTips,
    //   image: require('../../../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
    //   selectedImage: require('../../../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
    // },
    // {
    //   //自定义标签
    //   key: constants.THEME_CUSTOME_LABEL,
    //   title: constants.THEME_CUSTOME_LABEL,
    //   size: 'large',
    //   action: showTips,
    //   image: require('../../../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
    //   selectedImage: require('../../../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
    // },
    {
      //统一标签
      key: constants.THEME_UNIFY_LABEL,
      title: getLanguage(global.language).Map_Main_Menu.THEME_UNIFORM_LABLE,
      // constants.THEME_UNIFY_LABEL,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('Theme', constants.THEME_UNIFY_LABEL)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_create_unify_label,
      selectedImage: getThemeAssets().themeType.theme_create_unify_label,
    },
    {
      //单值标签
      key: constants.THEME_UNIQUE_LABEL,
      title: getLanguage(global.language).Map_Main_Menu
        .THEME_UNIQUE_VALUE_LABLE_MAP,
      // constants.THEME_UNIQUE_LABEL,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('Theme', constants.THEME_UNIQUE_LABEL)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_create_unique_label,
      selectedImage: getThemeAssets().themeType.theme_create_unique_label,
    },
    {
      //分段标签
      key: constants.THEME_RANGE_LABEL,
      title: getLanguage(global.language).Map_Main_Menu.THEME_RANGES_LABLE_MAP,
      // constants.THEME_RANGE_LABEL,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('Theme', constants.THEME_RANGE_LABEL)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_create_range_label,
      selectedImage: getThemeAssets().themeType.theme_create_range_label,
    },
    {
      //面积图
      key: constants.THEME_GRAPH_AREA,
      title: getLanguage(global.language).Map_Main_Menu.THEME_AREA,
      // constants.THEME_GRAPH_AREA,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_AREA)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_area,
      selectedImage: getThemeAssets().themeType.theme_graph_area,
    },
    {
      //阶梯图
      key: constants.THEME_GRAPH_STEP,
      title: getLanguage(global.language).Map_Main_Menu.THEME_STEP,
      // constants.THEME_GRAPH_STEP,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_STEP)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_step,
      selectedImage: getThemeAssets().themeType.theme_graph_step,
    },
    {
      //折线图
      key: constants.THEME_GRAPH_LINE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_LINE,
      // constants.THEME_GRAPH_LINE,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_LINE)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_line,
      selectedImage: getThemeAssets().themeType.theme_graph_line,
    },
    {
      //点状图
      key: constants.THEME_GRAPH_POINT,
      title: getLanguage(global.language).Map_Main_Menu.THEME_POINT,
      //constants.THEME_GRAPH_POINT,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_POINT)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_point,
      selectedImage: getThemeAssets().themeType.theme_graph_point,
    },
    {
      //柱状图
      key: constants.THEME_GRAPH_BAR,
      title: getLanguage(global.language).Map_Main_Menu.THEME_COLUMN,
      // constants.THEME_GRAPH_BAR,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_BAR)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_bar,
      selectedImage: getThemeAssets().themeType.theme_graph_bar,
    },
    {
      //三维柱状图
      key: constants.THEME_GRAPH_BAR3D,
      title: getLanguage(global.language).Map_Main_Menu.THEME_3D_COLUMN,
      // constants.THEME_GRAPH_BAR3D,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_BAR3D)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_bar3d,
      selectedImage: getThemeAssets().themeType.theme_graph_bar3d,
    },
    {
      //饼图
      key: constants.THEME_GRAPH_PIE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_PIE,
      // constants.THEME_GRAPH_PIE,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_PIE)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_pie,
      selectedImage: getThemeAssets().themeType.theme_graph_pie,
    },
    {
      //三维饼图
      key: constants.THEME_GRAPH_PIE3D,
      title: getLanguage(global.language).Map_Main_Menu.THEME_3D_PIE,
      // constants.THEME_GRAPH_PIE3D,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_PIE3D)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_pie3d,
      selectedImage: getThemeAssets().themeType.theme_graph_pie3d,
    },
    {
      //玫瑰图
      key: constants.THEME_GRAPH_ROSE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_ROSE,
      // constants.THEME_GRAPH_ROSE,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_ROSE)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_rose,
      selectedImage: getThemeAssets().themeType.theme_graph_rose,
    },
    {
      //三维玫瑰图
      key: constants.THEME_GRAPH_ROSE3D,
      title: getLanguage(global.language).Map_Main_Menu.THEME_3D_ROSE,
      // constants.THEME_GRAPH_ROSE3D,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_ROSE3D)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_rose3d,
      selectedImage: getThemeAssets().themeType.theme_graph_rose3d,
    },
    {
      //堆叠柱状图
      key: constants.THEME_GRAPH_STACK_BAR,
      title: getLanguage(global.language).Map_Main_Menu.THEME_STACKED_BAR,
      // constants.THEME_GRAPH_STACK_BAR,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () =>
            showExpressionList('ThemeGraph', constants.THEME_GRAPH_STACK_BAR)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_stack_bar,
      selectedImage: getThemeAssets().themeType.theme_graph_stack_bar,
    },
    {
      //三维堆叠柱状图
      key: constants.THEME_GRAPH_STACK_BAR3D,
      title: getLanguage(global.language).Map_Main_Menu.THEME_3D_STACKED_BAR,
      // constants.THEME_GRAPH_STACK_BAR3D,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () =>
            showExpressionList(
              'ThemeGraph',
              constants.THEME_GRAPH_STACK_BAR3D,
            )
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_stack_bar3d,
      selectedImage: getThemeAssets().themeType.theme_graph_stack_bar3d,
    },
    {
      //环状图
      key: constants.THEME_GRAPH_RING,
      title: getLanguage(global.language).Map_Main_Menu.THEME_RING,
      // constants.THEME_GRAPH_RING,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('ThemeGraph', constants.THEME_GRAPH_RING)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graph_ring,
      selectedImage: getThemeAssets().themeType.theme_graph_ring,
    },
    {
      //点密度专题图
      key: constants.THEME_DOT_DENSITY,
      title: getLanguage(global.language).Map_Main_Menu.THEME_DOT_DENSITY_MAP,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('Theme', constants.THEME_DOT_DENSITY)
          : () =>
            showDatasetsList(type, {
              typeFilter: ['REGION'],
            }),
      image: getThemeAssets().themeType.theme_dot_density,
      selectedImage: getThemeAssets().themeType.theme_dot_density,
    },
    {
      //等级符号专题图
      key: constants.THEME_GRADUATED_SYMBOL,
      title: getLanguage(global.language).Map_Main_Menu
        .THEME_GRADUATED_SYMBOLS_MAP,
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? () => showExpressionList('Theme', constants.THEME_GRADUATED_SYMBOL)
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_graduated_symbol,
      selectedImage: getThemeAssets().themeType.theme_graduated_symbol,
    },
    {
      //单值栅格专题图
      key: constants.THEME_GRID_UNIQUE,
      title: global.language === 'CN' ? '栅格单值专题图' : 'Grid Unique',
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? createThemeGridUniqueMapByLayer
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_grid_unique,
      selectedImage: getThemeAssets().themeType.theme_grid_unique,
    },
    {
      //栅格分段专题图
      key: constants.THEME_GRID_RANGE,
      title: global.language === 'CN' ? '栅格分段专题图' : 'Grid Range',
      size: 'large',
      action:
        type === ConstToolType.MAP_THEME_CREATE_BY_LAYER
          ? createThemeGridRangeMapByLayer
          : () => showDatasetsList(type),
      image: getThemeAssets().themeType.theme_grid_range,
      selectedImage: getThemeAssets().themeType.theme_grid_range,
    },
    {
      //热力图
      key: constants.THEME_HEATMAP,
      title: getLanguage(global.language).Map_Main_Menu.THEME_HEATMAP,
      // title: constants.THEME_HEATMAP,
      size: 'large',
      action: () => showDatasetsList(type),
      image: getThemeAssets().themeType.heatmap,
      selectedImage: getThemeAssets().themeType.heatmap,
    },
  ]
  return { data, buttons }
}

// /**
//  * 通过数据集创建专题图
//  * @param type
//  * @returns {{data: Array, buttons: Array}}
//  */
// function getThemeMapCreate(type) {
//   let data = [],
//     buttons = []
//   if (type !== ConstToolType.MAP_THEME_CREATE) return { data, buttons }
//   data = [
//     {
//       //统一风格
//       key: constants.THEME_UNIFY_STYLE,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_UNIFORM_MAP,
//       //constants.THEME_UNIFY_STYLE,
//       action: getUnifyStyleAdd,
//       size: 'large',
//       image: getThemeAssets().themeType.theme_create_unify_style,
//       selectedImage: getThemeAssets().themeType.theme_create_unify_style,
//     },
//     {
//       //单值风格
//       key: constants.THEME_UNIQUE_STYLE,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_UNIQUE_VALUES_MAP,
//       //constants.THEME_UNIQUE_STYLE,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_create_unique_style,
//       selectedImage: getThemeAssets().themeType.theme_create_unique_style,
//     },
//     {
//       //分段风格
//       key: constants.THEME_RANGE_STYLE,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_RANGES_MAP,
//       //constants.THEME_RANGE_STYLE,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_create_range_style,
//       selectedImage: getThemeAssets().themeType.theme_create_range_style,
//     },
//     // {
//     //   //自定义风格
//     //   key: constants.THEME_CUSTOME_STYLE,
//     //   title: constants.THEME_CUSTOME_STYLE,
//     //   size: 'large',
//     //   action: showTips,
//     //   image: require('../../../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
//     //   selectedImage: require('../../../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
//     // },
//     // {
//     //   //自定义标签
//     //   key: constants.THEME_CUSTOME_LABEL,
//     //   title: constants.THEME_CUSTOME_LABEL,
//     //   size: 'large',
//     //   action: showTips,
//     //   image: require('../../../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
//     //   selectedImage: require('../../../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
//     // },
//     {
//       //统一标签
//       key: constants.THEME_UNIFY_LABEL,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_UNIFORM_LABLE,
//       //constants.THEME_UNIFY_LABEL,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_create_unify_label,
//       selectedImage: getThemeAssets().themeType.theme_create_unify_label,
//     },
//     {
//       //单值标签
//       key: constants.THEME_UNIQUE_LABEL,
//       title: getLanguage(global.language).Map_Main_Menu
//         .THEME_UNIQUE_VALUE_LABLE_MAP,
//       //constants.THEME_UNIQUE_LABEL,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_create_unique_label,
//       selectedImage: getThemeAssets().themeType.theme_create_unique_label,
//     },
//     {
//       //分段标签
//       key: constants.THEME_RANGE_LABEL,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_RANGES_LABLE_MAP,
//       //constants.THEME_RANGE_LABEL,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_create_range_label,
//       selectedImage: getThemeAssets().themeType.theme_create_range_label,
//     },
//     {
//       //面积图
//       key: constants.THEME_GRAPH_AREA,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_AREA,
//       //constants.THEME_GRAPH_AREA,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_area,
//       selectedImage: getThemeAssets().themeType.theme_graph_area,
//     },
//     {
//       //阶梯图
//       key: constants.THEME_GRAPH_STEP,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_STEP,
//       //constants.THEME_GRAPH_STEP,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_step,
//       selectedImage: getThemeAssets().themeType.theme_graph_step,
//     },
//     {
//       //折线图
//       key: constants.THEME_GRAPH_LINE,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_LINE,
//       //constants.THEME_GRAPH_LINE,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_line,
//       selectedImage: getThemeAssets().themeType.theme_graph_line,
//     },
//     {
//       //点状图
//       key: constants.THEME_GRAPH_POINT,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_POINT,
//       //constants.THEME_GRAPH_POINT,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_point,
//       selectedImage: getThemeAssets().themeType.theme_graph_point,
//     },
//     {
//       //柱状图
//       key: constants.THEME_GRAPH_BAR,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_COLUMN,
//       //constants.THEME_GRAPH_BAR,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_bar,
//       selectedImage: getThemeAssets().themeType.theme_graph_bar,
//     },
//     {
//       //三维柱状图
//       key: constants.THEME_GRAPH_BAR3D,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_3D_COLUMN,
//       //constants.THEME_GRAPH_BAR3D,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_bar3d,
//       selectedImage: getThemeAssets().themeType.theme_graph_bar3d,
//     },
//     {
//       //饼图
//       key: constants.THEME_GRAPH_PIE,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_PIE,
//       //constants.THEME_GRAPH_PIE,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_pie,
//       selectedImage: getThemeAssets().themeType.theme_graph_pie,
//     },
//     {
//       //三维饼图
//       key: constants.THEME_GRAPH_PIE3D,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_3D_PIE,
//       //constants.THEME_GRAPH_PIE3D,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_pie3d,
//       selectedImage: getThemeAssets().themeType.theme_graph_pie3d,
//     },
//     {
//       //玫瑰图
//       key: constants.THEME_GRAPH_ROSE,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_ROSE,
//       //constants.THEME_GRAPH_ROSE,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_rose,
//       selectedImage: getThemeAssets().themeType.theme_graph_rose,
//     },
//     {
//       //三维玫瑰图
//       key: constants.THEME_GRAPH_ROSE3D,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_3D_ROSE,
//       //constants.THEME_GRAPH_ROSE3D,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_rose3d,
//       selectedImage: getThemeAssets().themeType.theme_graph_rose3d,
//     },
//     {
//       //堆叠柱状图
//       key: constants.THEME_GRAPH_STACK_BAR,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_STACKED_BAR,
//       //constants.THEME_GRAPH_STACK_BAR,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_stack_bar,
//       selectedImage: getThemeAssets().themeType.theme_graph_stack_bar,
//     },
//     {
//       //三维堆叠柱状图
//       key: constants.THEME_GRAPH_STACK_BAR3D,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_3D_STACKED_BAR,
//       //constants.THEME_GRAPH_STACK_BAR3D,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_stack_bar3d,
//       selectedImage: getThemeAssets().themeType.theme_graph_stack_bar3d,
//     },
//     {
//       //环状图
//       key: constants.THEME_GRAPH_RING,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_RING,
//       //constants.THEME_GRAPH_RING,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graph_ring,
//       selectedImage: getThemeAssets().themeType.theme_graph_ring,
//     },
//     {
//       //点密度专题图
//       key: constants.THEME_DOT_DENSITY,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_DOT_DENSITY_MAP,
//       // constants.THEME_DOT_DENSITY,
//       size: 'large',
//       action: () =>
//         showDatasetsList({
//           typeFilter: ['REGION'],
//         }),
//       image: getThemeAssets().themeType.theme_dot_density,
//       selectedImage: getThemeAssets().themeType.theme_dot_density,
//     },
//     {
//       //等级符号专题图
//       key: constants.THEME_GRADUATED_SYMBOL,
//       title: getLanguage(global.language).Map_Main_Menu
//         .THEME_GRADUATED_SYMBOLS_MAP,
//       // constants.THEME_GRADUATED_SYMBOL,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_graduated_symbol,
//       selectedImage: getThemeAssets().themeType.theme_graduated_symbol,
//     },
//     {
//       //栅格单值专题图
//       key: constants.THEME_GRID_UNIQUE,
//       title: global.language === 'CN' ? '栅格单值专题图' : 'Grid Unique', //constants.THEME_GRID_UNIQUE,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_grid_unique,
//       selectedImage: getThemeAssets().themeType.theme_grid_unique,
//     },
//     {
//       //栅格分段专题图
//       key: constants.THEME_GRID_RANGE,
//       title: global.language === 'CN' ? '栅格分段专题图' : 'Grid Range',
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.theme_grid_range,
//       selectedImage: getThemeAssets().themeType.theme_grid_range,
//     },
//     {
//       //热力图
//       key: constants.THEME_HEATMAP,
//       title: getLanguage(global.language).Map_Main_Menu.THEME_HEATMAP,
//       // title: constants.THEME_HEATMAP,
//       size: 'large',
//       action: showDatasetsList,
//       image: getThemeAssets().themeType.heatmap,
//       selectedImage: getThemeAssets().themeType.heatmap,
//     },
//   ]
//   return { data, buttons }
// }

async function showLocalDatasetsList() {
  let data = []
  let customerUDBPath = await FileTools.appendingHomeDirectory(
    ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
  )
  let customerUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
    extension: 'udb',
    type: 'file',
  })
  customerUDBs.forEach(item => {
    item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
    item.info = {
      infoType: 'mtime',
      lastModifiedDate: item.mtime,
    }
  })

  let userUDBPath, userUDBs
  if (
    ToolbarModule.getParams().user &&
    ToolbarModule.getParams().user.currentUser.userName
  ) {
    userUDBPath =
      (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
      ToolbarModule.getParams().user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Datasource
    userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
      extension: 'udb',
      type: 'file',
    })
    userUDBs.forEach(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
    })

    data = [
      {
        title: Const.PUBLIC_DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: customerUDBs,
      },
      {
        title: Const.DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: userUDBs,
      },
    ]
  } else {
    data = [
      {
        title: Const.DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: customerUDBs,
      },
    ]
  }

  ToolbarModule.getParams().setToolbarVisible &&
    ToolbarModule.getParams().setToolbarVisible(
      true,
      ConstToolType.MAP_THEME_START_OPENDS,
      {
        containerType: ToolbarType.list,
        isFullScreen: true,
        isTouchProgress: false,
        showMenuDialog: false,
        height:
          ToolbarModule.getParams().device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[3]
            : ConstToolType.THEME_HEIGHT[5],
        data,
        buttons: [ToolbarBtnType.THEME_CANCEL],
      },
    )
}

/**
 * 开始->新建专题图
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getThemeMapStartCreate(type) {
  let data = [],
    buttons = []
  if (type !== ConstToolType.MAP_THEME_START_CREATE) return { data, buttons }
  data = [
    {
      //单值风格
      key: constants.THEME_UNIQUE_STYLE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_UNIQUE_VALUES_MAP,
      // constants.THEME_UNIQUE_STYLE,
      size: 'large',
      action: showLocalDatasetsList,
      image: require('../../../../../../assets/mapTools/icon_function_theme_create_unique_style_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/icon_function_theme_create_unique_style_black.png'),
    },
    {
      //分段风格
      key: constants.THEME_RANGE_STYLE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_RANGES_MAP,
      //constants.THEME_RANGE_STYLE,
      size: 'large',
      action: showLocalDatasetsList,
      image: require('../../../../../../assets/mapTools/icon_function_theme_create_range_style_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/icon_function_theme_create_range_style_black.png'),
    },
    {
      //统一标签
      key: constants.THEME_UNIFY_LABEL,
      title: getLanguage(global.language).Map_Main_Menu.THEME_UNIFORM_LABLE,
      //constants.THEME_UNIFY_LABEL,
      size: 'large',
      action: showLocalDatasetsList,
      image: require('../../../../../../assets/mapTools/icon_function_theme_create_unify_label_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/icon_function_theme_create_unify_label_black.png'),
    },
  ]
  return { data, buttons }
}

/**
 * 专题图参数设置
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getThemeMapParam(type) {
  let data = [],
    buttons = getThemeFiveMenu()
  if (type === ConstToolType.MAP_THEME_PARAM_GRAPH) return { data, buttons }
  if (type !== ConstToolType.MAP_THEME_PARAM) return { data: [], buttons: [] }
  buttons = getThemeFourMenu()
  return { data, buttons }
}

// let _params = {}
//
// function setThemeParams(params) {
//   _params = params
// }
//
// function getThemeParams() {
//   return _params
// }

/** 设置分段模式 **/
function setRangeMode(type, rangeMode) {
  const globalParams = ToolbarModule.getParams()
  const _params = ToolbarModule.getData().themeParams
  if (rangeMode !== undefined) {
    _params.RangeMode = rangeMode
  }
  if (type === ConstToolType.MAP_THEME_PARAM_RANGELABEL_MODE) {
    if (rangeMode === RangeMode.CUSTOMINTERVAL) {
      globalParams.setToolbarVisible(false, {
        isTouchProgress: false,
        showMenuDialog: false,
        selectKey: '',
      })
      NavigationService.navigate('CustomModePage', { type })
    } else {
      SThemeCartography.modifyThemeLabelRangeMap(_params)
    }
  } else {
    if (rangeMode === RangeMode.CUSTOMINTERVAL) {
      globalParams.setToolbarVisible(false, {
        isTouchProgress: false,
        showMenuDialog: false,
        selectKey: '',
      })
      NavigationService.navigate('CustomModePage', { type })
    } else {
      SThemeCartography.modifyThemeRangeMap(_params)
    }
  }
}

function setGridRangeMode() {
  const _params = ToolbarModule.getData().themeParams
  SThemeCartography.modifyThemeGridRangeMap(_params)
}

function getRangeMode(type) {
  let data = [
    {
      // 等距分段
      key: RangeMode.EQUALINTERVAL,
      title: getLanguage(global.language).Map_Main_Menu.THEME_EQUAL_INTERVAL,
      //'等距分段',
      action: () => setRangeMode(type, RangeMode.EQUALINTERVAL),
      size: 'large',
      image: require('../../../../../../assets/mapTools/range_mode_equalinterval_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/range_mode_equalinterval_black.png'),
    },
    {
      // 平方根分段
      key: RangeMode.SQUARE_ROOT_INTERVAL,
      title: getLanguage(global.language).Map_Main_Menu
        .THEME_SQURE_ROOT_INTERVAL,
      //'平方根分段',
      action: () => setRangeMode(type, RangeMode.SQUARE_ROOT_INTERVAL),
      size: 'large',
      image: require('../../../../../../assets/mapTools/range_mode_squareroot_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/range_mode_squareroot_black.png'),
    },
    {
      // 标准差分段
      key: RangeMode.STDDEVIATION,
      title: getLanguage(global.language).Map_Main_Menu
        .THEME_STANDARD_DEVIATION_INTERVAL,
      //'标准差分段',
      action: () => setRangeMode(type, RangeMode.STDDEVIATION),
      size: 'large',
      image: require('../../../../../../assets/mapTools/range_mode_stddeviation_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/range_mode_stddeviation_black.png'),
    },
    {
      // 对数分段
      key: RangeMode.LOGARITHM,
      title: getLanguage(global.language).Map_Main_Menu
        .THEME_LOGARITHMIC_INTERVAL,
      //'对数分段',
      action: () => setRangeMode(type, RangeMode.LOGARITHM),
      size: 'large',
      image: require('../../../../../../assets/mapTools/range_mode_logarithm_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/range_mode_logarithm_black.png'),
    },
    {
      // 等计数分段
      key: RangeMode.QUANTILE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_QUANTILE_INTERVAL,
      //'等计数分段',
      action: () => setRangeMode(type, RangeMode.QUANTILE),
      size: 'large',
      image: require('../../../../../../assets/mapTools/range_mode_quantile_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/range_mode_quantile_black.png'),
    },
    {
      // 自定义分段
      key: RangeMode.CUSTOMINTERVAL,
      title: getLanguage(global.language).Map_Main_Menu.THEME_MANUAL,
      action: () => setRangeMode(type, RangeMode.CUSTOMINTERVAL),
      size: 'large',
      image: getPublicAssets().mapTools.range_mode_custom,
      selectedImage: getPublicAssets().mapTools.range_mode_custom,
    },
  ]
  return data
}

function getGridRangeMode() {
  let data = [
    {
      // 等距分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_EQUALINTERVAL,
      title: '等距分段',
      action: setGridRangeMode,
      size: 'large',
      image: require('../../../../../../assets/mapTools/range_mode_equalinterval_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/range_mode_equalinterval_black.png'),
    },
    {
      // 平方根分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_SQUAREROOT,
      title: '平方根分段',
      action: setGridRangeMode,
      size: 'large',
      image: require('../../../../../../assets/mapTools/range_mode_squareroot_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/range_mode_squareroot_black.png'),
    },
    {
      // 对数分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_LOGARITHM,
      title: '对数分段',
      action: setGridRangeMode,
      size: 'large',
      image: require('../../../../../../assets/mapTools/range_mode_logarithm_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/range_mode_logarithm_black.png'),
    },
    // {
    //   // 自定义分段
    //   key: constants.MAP_THEME_PARAM_RANGE_MODE_CUSTOMINTERVAL,
    //   title: '自定义分段',
    //   action: setGridRangeMode,
    //   size: 'large',
    //   image: require('../../../../../../assets/mapTools/range_mode_squareroot.png'),
    //   selectedImage: require('../../../../../../assets/mapTools/range_mode_squareroot.png'),
    // },
  ]
  return data
}

/**设置统一标签背景形状 */
function setLabelFont() {
  const _params = ToolbarModule.getData().themeParams
  return SThemeCartography.setLabelFontName(_params)
}
function getLabelFont() {
  let data = [
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_BOLD,
      title: getLanguage(global.language).Map_Main_Menu.STYLE_BOLD,
      //'空背景',
      action: setLabelFont,
      size: 'large',
      image: require('../../../../../../assets/mapTools/style_font_bold.png'),
      selectedImage: require('../../../../../../assets/mapTools/style_font_bold.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_ITALIC,
      title: getLanguage(global.language).Map_Main_Menu.STYLE_ITALIC,
      //'空背景',
      action: setLabelFont,
      size: 'large',
      image: require('../../../../../../assets/mapTools/style_font_italic.png'),
      selectedImage: require('../../../../../../assets/mapTools/style_font_italic.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_UNDERLINE,
      title: getLanguage(global.language).Map_Main_Menu.STYLE_UNDERLINE,
      //'空背景',
      action: setLabelFont,
      size: 'large',
      image: require('../../../../../../assets/mapTools/style_font_underline.png'),
      selectedImage: require('../../../../../../assets/mapTools/style_font_underline.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_STRIKEOUT,
      title: getLanguage(global.language).Map_Main_Menu.STYLE_STRIKEOUT,
      //'空背景',
      action: setLabelFont,
      size: 'large',
      image: require('../../../../../../assets/mapTools/style_font_strikeout.png'),
      selectedImage: require('../../../../../../assets/mapTools/style_font_strikeout.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_SHADOW,
      title: getLanguage(global.language).Map_Main_Menu.STYLE_SHADOW,
      //'空背景',
      action: setLabelFont,
      size: 'large',
      image: require('../../../../../../assets/mapTools/style_font_shadow.png'),
      selectedImage: require('../../../../../../assets/mapTools/style_font_shadow.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_OUTLINE,
      title: getLanguage(global.language).Map_Main_Menu.STYLE_OUTLINE,
      //'空背景',
      action: setLabelFont,
      size: 'large',
      image: require('../../../../../../assets/mapTools/style_font_outline.png'),
      selectedImage: require('../../../../../../assets/mapTools/style_font_outline.png'),
    },
  ]
  return data
}

/**设置统一标签背景形状 */
function setLabelBackShape() {
  const _params = ToolbarModule.getData().themeParams
  return SThemeCartography.setUniformLabelBackShape(_params)
}
function getLabelBackShape() {
  let data = [
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_NONE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_DEFAULT,
      //'空背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none_black.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_DIAMOND,
      title: getLanguage(global.language).Map_Main_Menu.THEME_DIAMOND,
      //'菱形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_diamond_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_diamond_black.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_ROUNDRECT,
      title: getLanguage(global.language).Map_Main_Menu.THEME_ROUND_RECTANGLE,
      //'圆角矩形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_roundrect_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_roundrect_black.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_RECT,
      title: getLanguage(global.language).Map_Main_Menu.THEME_RECTANGLE,
      //'矩形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_rect_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_rect_black.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_ELLIPSE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_ELLIPSE,
      //'椭圆形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_ellipse_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_ellipse_black.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_TRIANGLE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_TRIANGLE,
      //'三角形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_triangle_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_triangle_black.png'),
    },
    // {
    //   key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_MARKER,
    //   title: '符号背景',
    //   action: showTips,
    //   size: 'large',
    //   image: require('../../../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    //   selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    // },
  ]
  return data
}

/**设置统一标签字体 */
function setLabelFontName() {
  const _params = ToolbarModule.getData().themeParams
  return SThemeCartography.setLabelFontName(_params)
}

function getLabelFontName() {
  let data = [
    {
      key: '微软雅黑',
      title: '微软雅黑',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '宋体',
      title: '宋体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '楷体',
      title: '楷体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '黑体',
      title: '黑体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '隶书',
      title: '隶书',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '幼圆',
      title: '幼圆',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '华文行楷',
      title: '华文行楷',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '华文琥珀',
      title: '华文琥珀',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '华文楷体',
      title: '华文楷体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '方正舒体',
      title: '方正舒体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '方正姚体',
      title: '方正姚体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '华文新魏',
      title: '华文新魏',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
  ]
  return data
}

/**设置统一标签旋转角度 */
function setLabelFontRotation() {
  const _params = ToolbarModule.getData().themeParams
  // return SThemeCartography.setUniformLabelRotaion(_params)
  return SThemeCartography.setLabelRotation(_params)
}

function getLabelFontRotation() {
  let data = [
    {
      key: '90',
      title: getLanguage(global.language).Map_Main_Menu.ROTATE_LEFT,
      //'左旋转90°',
      action: setLabelFontRotation,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_rotation_left_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_rotation_left_black.png'),
    },
    {
      key: '-90',
      title: getLanguage(global.language).Map_Main_Menu.ROTATE_RIGHT,
      //'右旋转90°',
      action: setLabelFontRotation,
      size: 'large',
      image: require('../../../../../../assets/mapTools/uniformlabel_rotation_right_black.png'),
      selectedImage: require('../../../../../../assets/mapTools/uniformlabel_rotation_right_black.png'),
    },
    // {
    //   key: '180',
    //   title: getLanguage(global.language).Map_Main_Menu.VERTICAL_FLIP,
    //   //'上下旋转',
    //   action: setLabelFontRotation,
    //   size: 'large',
    //   image: require('../../../../../../assets/mapTools/uniformlabel_rotation_updown_black.png'),
    //   selectedImage: require('../../../../../../assets/mapTools/uniformlabel_rotation_updown_black.png'),
    // },
    // {
    //   key: '-180',
    //   title: getLanguage(global.language).Map_Main_Menu.HORIZONTAL_FLIP,
    //   //'左右旋转',
    //   action: setLabelFontRotation,
    //   size: 'large',
    //   image: require('../../../../../../assets/mapTools/uniformlabel_rotation_leftright_black.png'),
    //   selectedImage: require('../../../../../../assets/mapTools/uniformlabel_rotation_leftright_black.png'),
    // },
  ]
  return data
}

/**设置颜色 */
function setColor() {
  const _params = ToolbarModule.getData().themeParams
  if (_params.ColorType === 'UNIFORMLABEL_FORE_COLOR') {
    return SThemeCartography.setUniformLabelColor(_params)
  } else if (_params.ColorType === 'UNIFORMLABEL_BACKSHAPE_COLOR') {
    return SThemeCartography.setUniformLabelBackColor(_params)
  } else if (_params.ColorType === 'DOT_DENSITY_COLOR') {
    return SThemeCartography.modifyDotDensityThemeMap(_params)
  } else if (_params.ColorType === 'GRADUATED_SYMBOL_COLOR') {
    return SThemeCartography.modifyGraduatedSymbolThemeMap(_params)
  }
}

function getColorTable() {
  let data = [
    {
      key: '#FFFFFF',
      action: setColor,
      size: 'large',
      background: '#FFFFFF',
    },
    {
      key: '#000000',
      action: setColor,
      size: 'large',
      background: '#000000',
    },
    {
      key: '#F0EDE1',
      action: setColor,
      size: 'large',
      background: '#F0EDE1',
    },
    {
      key: '#1E477C',
      action: setColor,
      size: 'large',
      background: '#1E477C',
    },
    {
      key: '#4982BC',
      action: setColor,
      size: 'large',
      background: '#4982BC',
    },
    {
      key: '#00A1E9',
      action: setColor,
      size: 'large',
      background: '#00A1E9',
    },
    {
      key: '#803000',
      action: setColor,
      size: 'large',
      background: '#803000',
    },
    {
      key: '#BD5747',
      action: setColor,
      size: 'large',
      background: '#BD5747',
    },
    {
      key: '#36E106',
      action: setColor,
      size: 'large',
      background: '#36E106',
    },
    {
      key: '#9CBB58',
      action: setColor,
      size: 'large',
      background: '#9CBB58',
    },
    {
      key: '#8364A1',
      action: setColor,
      size: 'large',
      background: '#8364A1',
    },
    {
      key: '#4AADC7',
      action: setColor,
      size: 'large',
      background: '#4AADC7',
    },
    {
      key: '#F89746',
      action: setColor,
      size: 'large',
      background: '#F89746',
    },
    {
      key: '#E7A700',
      action: setColor,
      size: 'large',
      background: '#E7A700',
    },
    {
      key: '#E7E300',
      action: setColor,
      size: 'large',
      background: '#E7E300',
    },
    {
      key: '#D33248',
      action: setColor,
      size: 'large',
      background: '#D33248',
    },
    {
      key: '#F1F1F1',
      action: setColor,
      size: 'large',
      background: '#F1F1F1',
    },
    {
      key: '#7D7D7D',
      action: setColor,
      size: 'large',
      background: '#7D7D7D',
    },
    {
      key: '#DDD9C3',
      action: setColor,
      size: 'large',
      background: '#DDD9C3',
    },
    {
      key: '#C9DDF0',
      action: setColor,
      size: 'large',
      background: '#C9DDF0',
    },
    {
      key: '#DBE4F3',
      action: setColor,
      size: 'large',
      background: '#DBE4F3',
    },
    {
      key: '#BCE8FD',
      action: setColor,
      size: 'large',
      background: '#BCE8FD',
    },
    {
      key: '#E5C495',
      action: setColor,
      size: 'large',
      background: '#E5C495',
    },
    {
      key: '#F4DED9',
      action: setColor,
      size: 'large',
      background: '#F4DED9',
    },
    {
      key: '#DBE9CE',
      action: setColor,
      size: 'large',
      background: '#DBE9CE',
    },
    {
      key: '#EBF4DE',
      action: setColor,
      size: 'large',
      background: '#EBF4DE',
    },
    {
      key: '#E5E1ED',
      action: setColor,
      size: 'large',
      background: '#E5E1ED',
    },
    {
      key: '#DDF0F3',
      action: setColor,
      size: 'large',
      background: '#DDF0F3',
    },
    {
      key: '#FDECDC',
      action: setColor,
      size: 'large',
      background: '#FDECDC',
    },
    {
      key: '#FFE7C4',
      action: setColor,
      size: 'large',
      background: '#FFE7C4',
    },
    {
      key: '#FDFACA',
      action: setColor,
      size: 'large',
      background: '#FDFACA',
    },
    {
      key: '#F09CA0',
      action: setColor,
      size: 'large',
      background: '#F09CA0',
    },
    {
      key: '#D7D7D7',
      action: setColor,
      size: 'large',
      background: '#D7D7D7',
    },
    {
      key: '#585858',
      action: setColor,
      size: 'large',
      background: '#585858',
    },
    {
      key: '#C6B797',
      action: setColor,
      size: 'large',
      background: '#C6B797',
    },
    {
      key: '#8CB4EA',
      action: setColor,
      size: 'large',
      background: '#8CB4EA',
    },
    {
      key: '#C1CCE4',
      action: setColor,
      size: 'large',
      background: '#C1CCE4',
    },
    {
      key: '#7ED2F6',
      action: setColor,
      size: 'large',
      background: '#7ED2F6',
    },
    {
      key: '#B1894F',
      action: setColor,
      size: 'large',
      background: '#B1894F',
    },
    {
      key: '#E7B8B8',
      action: setColor,
      size: 'large',
      background: '#E7B8B8',
    },
    {
      key: '#B0D59A',
      action: setColor,
      size: 'large',
      background: '#B0D59A',
    },
    {
      key: '#D7E3BD',
      action: setColor,
      size: 'large',
      background: '#D7E3BD',
    },
    {
      key: '#CDC1D9',
      action: setColor,
      size: 'large',
      background: '#CDC1D9',
    },
    {
      key: '#B7DDE9',
      action: setColor,
      size: 'large',
      background: '#B7DDE9',
    },
    {
      key: '#FAD6B1',
      action: setColor,
      size: 'large',
      background: '#FAD6B1',
    },
    {
      key: '#F5CE88',
      action: setColor,
      size: 'large',
      background: '#F5CE88',
    },
    {
      key: '#FFF55A',
      action: setColor,
      size: 'large',
      background: '#FFF55A',
    },
    {
      key: '#EF6C78',
      action: setColor,
      size: 'large',
      background: '#EF6C78',
    },
    {
      key: '#BFBFBF',
      action: setColor,
      size: 'large',
      background: '#BFBFBF',
    },
    {
      key: '#3E3E3E',
      action: setColor,
      size: 'large',
      background: '#3E3E3E',
    },
    {
      key: '#938953',
      action: setColor,
      size: 'large',
      background: '#938953',
    },
    {
      key: '#548ED4',
      action: setColor,
      size: 'large',
      background: '#548ED4',
    },
    {
      key: '#98B7D5',
      action: setColor,
      size: 'large',
      background: '#98B7D5',
    },
    {
      key: '#00B4F0',
      action: setColor,
      size: 'large',
      background: '#00B4F0',
    },
    {
      key: '#9A6C34',
      action: setColor,
      size: 'large',
      background: '#9A6C34',
    },
    {
      key: '#D79896',
      action: setColor,
      size: 'large',
      background: '#D79896',
    },
    {
      key: '#7EC368',
      action: setColor,
      size: 'large',
      background: '#7EC368',
    },
    {
      key: '#C5DDA5',
      action: setColor,
      size: 'large',
      background: '#C5DDA5',
    },
    {
      key: '#B1A5C6',
      action: setColor,
      size: 'large',
      background: '#B1A5C6',
    },
    {
      key: '#93CDDD',
      action: setColor,
      size: 'large',
      background: '#93CDDD',
    },
    {
      key: '#F9BD8D',
      action: setColor,
      size: 'large',
      background: '#F9BD8D',
    },
    {
      key: '#F7B550',
      action: setColor,
      size: 'large',
      background: '#F7B550',
    },
    {
      key: '#FFF100',
      action: setColor,
      size: 'large',
      background: '#FFF100',
    },
    {
      key: '#E80050',
      action: setColor,
      size: 'large',
      background: '#E80050',
    },
    {
      key: '#A6A6A7',
      action: setColor,
      size: 'large',
      background: '#A6A6A7',
    },
    {
      key: '#2D2D2B',
      action: setColor,
      size: 'large',
      background: '#2D2D2B',
    },
    {
      key: '#494428',
      action: setColor,
      size: 'large',
      background: '#494428',
    },
    {
      key: '#1D3A5F',
      action: setColor,
      size: 'large',
      background: '#1D3A5F',
    },
    {
      key: '#376192',
      action: setColor,
      size: 'large',
      background: '#376192',
    },
    {
      key: '#00A1E9',
      action: setColor,
      size: 'large',
      background: '#00A1E9',
    },
    {
      key: '#825320',
      action: setColor,
      size: 'large',
      background: '#825320',
    },
    {
      key: '#903635',
      action: setColor,
      size: 'large',
      background: '#903635',
    },
    {
      key: '#13B044',
      action: setColor,
      size: 'large',
      background: '#13B044',
    },
    {
      key: '#76933C',
      action: setColor,
      size: 'large',
      background: '#76933C',
    },
    {
      key: '#5E467C',
      action: setColor,
      size: 'large',
      background: '#5E467C',
    },
    {
      key: '#31859D',
      action: setColor,
      size: 'large',
      background: '#31859D',
    },
    {
      key: '#E46C07',
      action: setColor,
      size: 'large',
      background: '#E46C07',
    },
    {
      key: '#F39900',
      action: setColor,
      size: 'large',
      background: '#F39900',
    },
    {
      key: '#B7AB00',
      action: setColor,
      size: 'large',
      background: '#B7AB00',
    },
    {
      key: '#A50036',
      action: setColor,
      size: 'large',
      background: '#A50036',
    },
    {
      key: '#979D99',
      action: setColor,
      size: 'large',
      background: '#979D99',
    },
    {
      key: '#0C0C0C',
      action: setColor,
      size: 'large',
      background: '#0C0C0C',
    },
    {
      key: '#1C1A10',
      action: setColor,
      size: 'large',
      background: '#1C1A10',
    },
    {
      key: '#0C263D',
      action: setColor,
      size: 'large',
      background: '#0C263D',
    },
    {
      key: '#1D3A5F',
      action: setColor,
      size: 'large',
      background: '#1D3A5F',
    },
    {
      key: '#005883',
      action: setColor,
      size: 'large',
      background: '#005883',
    },
    {
      key: '#693904',
      action: setColor,
      size: 'large',
      background: '#693904',
    },
    {
      key: '#622727',
      action: setColor,
      size: 'large',
      background: '#622727',
    },
    {
      key: '#005E14',
      action: setColor,
      size: 'large',
      background: '#005E14',
    },
    {
      key: '#4F6028',
      action: setColor,
      size: 'large',
      background: '#4F6028',
    },
    {
      key: '#3E3050',
      action: setColor,
      size: 'large',
      background: '#3E3050',
    },
    {
      key: '#245B66',
      action: setColor,
      size: 'large',
      background: '#245B66',
    },
    {
      key: '#974805',
      action: setColor,
      size: 'large',
      background: '#974805',
    },
    {
      key: '#AD6A00',
      action: setColor,
      size: 'large',
      background: '#AD6A00',
    },
    {
      key: '#8B8100',
      action: setColor,
      size: 'large',
      background: '#8B8100',
    },
    {
      key: '#7C0022',
      action: setColor,
      size: 'large',
      background: '#7C0022',
    },
    {
      key: '#F0DCBE',
      action: setColor,
      size: 'large',
      background: '#F0DCBE',
    },
    {
      key: '#F2B1CF',
      action: setColor,
      size: 'large',
      background: '#F2B1CF',
    },
    {
      key: '#D3FFBF',
      action: setColor,
      size: 'large',
      background: '#D3FFBF',
    },
    {
      key: '#00165F',
      action: setColor,
      size: 'large',
      background: '#00165F',
    },
    {
      key: '#6673CB',
      action: setColor,
      size: 'large',
      background: '#6673CB',
    },
    {
      key: '#006EBF',
      action: setColor,
      size: 'large',
      background: '#006EBF',
    },
    {
      key: '#89CF66',
      action: setColor,
      size: 'large',
      background: '#89CF66',
    },
    {
      key: '#70A900',
      action: setColor,
      size: 'large',
      background: '#70A900',
    },
    {
      key: '#13B044',
      action: setColor,
      size: 'large',
      background: '#13B044',
    },
    {
      key: '#93D150',
      action: setColor,
      size: 'large',
      background: '#93D150',
    },
    {
      key: '#70319F',
      action: setColor,
      size: 'large',
      background: '#70319F',
    },
    {
      key: '#00B4F0',
      action: setColor,
      size: 'large',
      background: '#00B4F0',
    },
    {
      key: '#D38968',
      action: setColor,
      size: 'large',
      background: '#D38968',
    },
    {
      key: '#FFBF00',
      action: setColor,
      size: 'large',
      background: '#FFBF00',
    },
    {
      key: '#FFFF00',
      action: setColor,
      size: 'large',
      background: '#FFFF00',
    },
    {
      key: '#C10000',
      action: setColor,
      size: 'large',
      background: '#C10000',
    },
    {
      key: '#F0F1A6',
      action: setColor,
      size: 'large',
      background: '#F0F1A6',
    },
    {
      key: '#FF0000',
      action: setColor,
      size: 'large',
      background: '#FF0000',
    },
  ]
  return data
}

function getThemeFiveMenu() {
  let buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.MENU,
    ToolbarBtnType.MENU_FLEX,
    {
      type: ToolbarBtnType.THEME_GRAPH_TYPE,
      image: getThemeAssets().themeType.theme_graphmap_selected,
      action: ThemeAction.changeGraphType,
    },
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  return buttons
}

function getThemeFourMenu() {
  let buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.MENU,
    ToolbarBtnType.MENU_FLEX,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  return buttons
}

function getThemeThreeMenu() {
  let buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.MENU,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  return buttons
}

/**
 * 专题图颜色渐变类型常量
 */

function getColorGradientType() {
  let list = [
    {
      key: 'BLACKWHITE',
      title: '黑白渐变色',
    },
    {
      key: 'BLUEBLACK',
      title: '蓝黑渐变色',
    },
    {
      key: 'BLUERED',
      title: '蓝红渐变色',
    },
    {
      key: 'BLUEWHITE',
      title: '蓝白渐变色',
    },
    {
      key: 'CYANBLACK',
      title: '青黑渐变色',
    },
    {
      key: 'CYANBLUE',
      title: '青蓝渐变色',
    },
    {
      key: 'CYANGREEN',
      title: '青绿渐变色',
    },
    {
      key: 'CYANWHITE',
      title: '青白渐变色',
    },
    {
      key: 'GREENBLACK',
      title: '绿黑渐变色',
    },
    {
      key: 'GREENBLUE',
      title: '绿蓝渐变色',
    },
    {
      key: 'GREENORANGEVIOLET',
      title: '绿橙紫渐变色',
    },
    {
      key: 'GREENRED',
      title: '绿红渐变色',
    },
    {
      key: 'GREENWHITE',
      title: '绿白渐变色',
    },
    {
      key: 'PINKBLACK',
      title: '粉红黑渐变色',
    },
    {
      key: 'PINKBLUE',
      title: '粉红蓝渐变色',
    },
    {
      key: 'PINKRED',
      title: '粉红红渐变色',
    },
    {
      key: 'PINKWHITE',
      title: '粉红白渐变色',
    },
    {
      key: 'RAINBOW',
      title: '彩虹色',
    },
    {
      key: 'REDBLACK',
      title: '红黑渐变色',
    },
    {
      key: 'REDWHITE',
      title: '红白渐变色',
    },
    {
      key: 'SPECTRUM',
      title: '光谱渐变',
    },
    {
      key: 'TERRAIN',
      title: '地形渐变',
    },
    {
      key: 'YELLOWBLACK',
      title: '黄黑渐变色',
    },
    {
      key: 'YELLOWBLUE',
      title: '黄蓝渐变色',
    },
    {
      key: 'YELLOWGREEN',
      title: '黄绿渐变色',
    },
    {
      key: 'YELLOWRED',
      title: '黄红渐变色',
    },
    {
      key: 'YELLOWWHITE',
      title: '黄白渐变色',
    },
  ]
  return list
}

/**
 * 分段专题图颜色方案
 */
function getRangeColorScheme() {
  let list = [
    {
      key: 'CA_Oranges',
      colorSchemeName: 'CA_Oranges',
      colorScheme: require('../../../../../../assets/rangeColorScheme/CA_Oranges.png'),
    },
    {
      key: 'CB_Reds',
      colorSchemeName: 'CB_Reds',
      colorScheme: require('../../../../../../assets/rangeColorScheme/CB_Reds.png'),
    },
    {
      key: 'CC_Lemons',
      colorSchemeName: 'CC_Lemons',
      colorScheme: require('../../../../../../assets/rangeColorScheme/CC_Lemons.png'),
    },
    {
      key: 'CD_Cyans',
      colorSchemeName: 'CD_Cyans',
      colorScheme: require('../../../../../../assets/rangeColorScheme/CD_Cyans.png'),
    },
    {
      key: 'CE_Greens',
      colorSchemeName: 'CE_Greens',
      colorScheme: require('../../../../../../assets/rangeColorScheme/CE_Greens.png'),
    },
    {
      key: 'CF_Blues',
      colorSchemeName: 'CF_Blues',
      colorScheme: require('../../../../../../assets/rangeColorScheme/CF_Blues.png'),
    },
    {
      key: 'CG_Purples',
      colorSchemeName: 'CG_Purples',
      colorScheme: require('../../../../../../assets/rangeColorScheme/CG_Purples.png'),
    },
    {
      key: 'DA_Oranges',
      colorSchemeName: 'DA_Oranges',
      colorScheme: require('../../../../../../assets/rangeColorScheme/DA_Oranges.png'),
    },
    {
      key: 'DB_Reds',
      colorSchemeName: 'DB_Reds',
      colorScheme: require('../../../../../../assets/rangeColorScheme/DB_Reds.png'),
    },
    {
      key: 'DC_Lemons',
      colorSchemeName: 'DC_Lemons',
      colorScheme: require('../../../../../../assets/rangeColorScheme/DC_Lemons.png'),
    },
    {
      key: 'DD_Cyans',
      colorSchemeName: 'DD_Cyans',
      colorScheme: require('../../../../../../assets/rangeColorScheme/DD_Cyans.png'),
    },
    {
      key: 'DE_Greens',
      colorSchemeName: 'DE_Greens',
      colorScheme: require('../../../../../../assets/rangeColorScheme/DE_Greens.png'),
    },
    {
      key: 'DF_Blues',
      colorSchemeName: 'DF_Blues',
      colorScheme: require('../../../../../../assets/rangeColorScheme/DF_Blues.png'),
    },
    {
      key: 'DG_Purples',
      colorSchemeName: 'DG_Purples',
      colorScheme: require('../../../../../../assets/rangeColorScheme/DG_Purples.png'),
    },
    {
      key: 'EA_Oranges',
      colorSchemeName: 'EA_Oranges',
      colorScheme: require('../../../../../../assets/rangeColorScheme/EA_Oranges.png'),
    },
    {
      key: 'EB_Reds',
      colorSchemeName: 'EB_Reds',
      colorScheme: require('../../../../../../assets/rangeColorScheme/EB_Reds.png'),
    },
    {
      key: 'EC_Lemons',
      colorSchemeName: 'EC_Lemons',
      colorScheme: require('../../../../../../assets/rangeColorScheme/EC_Lemons.png'),
    },
    {
      key: 'ED_Cyans',
      colorSchemeName: 'ED_Cyans',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ED_Cyans.png'),
    },
    {
      key: 'EE_Greens',
      colorSchemeName: 'EE_Greens',
      colorScheme: require('../../../../../../assets/rangeColorScheme/EE_Greens.png'),
    },
    {
      key: 'EF_Blues',
      colorSchemeName: 'EF_Blues',
      colorScheme: require('../../../../../../assets/rangeColorScheme/EF_Blues.png'),
    },
    {
      key: 'EG_Purples',
      colorSchemeName: 'EG_Purples',
      colorScheme: require('../../../../../../assets/rangeColorScheme/EG_Purples.png'),
    },
    {
      key: 'FA_Oranges',
      colorSchemeName: 'FA_Oranges',
      colorScheme: require('../../../../../../assets/rangeColorScheme/FA_Oranges.png'),
    },
    {
      key: 'FB_Reds',
      colorSchemeName: 'FB_Reds',
      colorScheme: require('../../../../../../assets/rangeColorScheme/FB_Reds.png'),
    },
    {
      key: 'FC_Lemons',
      colorSchemeName: 'FC_Lemons',
      colorScheme: require('../../../../../../assets/rangeColorScheme/FC_Lemons.png'),
    },
    {
      key: 'FD_Cyans',
      colorSchemeName: 'FD_Cyans',
      colorScheme: require('../../../../../../assets/rangeColorScheme/FD_Cyans.png'),
    },
    {
      key: 'FE_Greens',
      colorSchemeName: 'FE_Greens',
      colorScheme: require('../../../../../../assets/rangeColorScheme/FE_Greens.png'),
    },
    {
      key: 'FF_Blues',
      colorSchemeName: 'FF_Blues',
      colorScheme: require('../../../../../../assets/rangeColorScheme/FF_Blues.png'),
    },
    {
      key: 'FG_Purples',
      colorSchemeName: 'FG_Purples',
      colorScheme: require('../../../../../../assets/rangeColorScheme/FG_Purples.png'),
    },
    {
      key: 'GA_Yellow to Orange',
      colorSchemeName: 'GA_Yellow to Orange',
      colorScheme: require('../../../../../../assets/rangeColorScheme/GA_Yellow_to_Orange.png'),
    },
    {
      key: 'GB_Orange to Red',
      colorSchemeName: 'GB_Orange to Red',
      colorScheme: require('../../../../../../assets/rangeColorScheme/GB_Orange_to_Red.png'),
    },
    {
      key: 'GC_Olive to Purple',
      colorSchemeName: 'GC_Olive to Purple',
      colorScheme: require('../../../../../../assets/rangeColorScheme/GC_Olive_to_Purple.png'),
    },
    {
      key: 'GD_Green to Orange',
      colorSchemeName: 'GD_Green to Orange',
      colorScheme: require('../../../../../../assets/rangeColorScheme/GD_Green_to_Orange.png'),
    },
    {
      key: 'GE_Blue to Lemon',
      colorSchemeName: 'GE_Blue to Lemon',
      colorScheme: require('../../../../../../assets/rangeColorScheme/GE_Blue_to_Lemon.png'),
    },
    {
      key: 'ZA_Temperature 1',
      colorSchemeName: 'ZA_Temperature 1',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZA_Temperature_1.png'),
    },
    {
      key: 'ZB_Temperature 2',
      colorSchemeName: 'ZB_Temperature 2',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZB_Temperature_2.png'),
    },
    {
      key: 'ZC_Temperature 3',
      colorSchemeName: 'ZC_Temperature 3',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZC_Temperature_3.png'),
    },
    {
      key: 'ZD_Temperature 4',
      colorSchemeName: 'ZD_Temperature 4',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZD_Temperature_4.png'),
    },
    {
      key: 'ZE_Precipitation 1',
      colorSchemeName: 'ZE_Precipitation 1',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZE_Precipitation_1.png'),
    },
    {
      key: 'ZF_Precipitation 2',
      colorSchemeName: 'ZF_Precipitation 2',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZF_Precipitation_2.png'),
    },
    {
      key: 'ZG_Precipitation 3',
      colorSchemeName: 'ZG_Precipitation 3',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZG_Precipitation_3.png'),
    },
    {
      key: 'ZH_Precipitation 4',
      colorSchemeName: 'ZH_Precipitation 4',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZH_Precipitation_4.png'),
    },
    {
      key: 'ZI_Altitude 1',
      colorSchemeName: 'ZI_Altitude 1',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZI_Altitude_1.png'),
    },
    {
      key: 'ZJ_Altitude 2',
      colorSchemeName: 'ZJ_Altitude 2',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZJ_Altitude_2.png'),
    },
    {
      key: 'ZK_Altitude 3',
      colorSchemeName: 'ZK_Altitude 3',
      colorScheme: require('../../../../../../assets/rangeColorScheme/ZK_Altitude_3.png'),
    },
  ]
  return list
}

/**
 * 单值专题图颜色方案
 */
function getUniqueColorScheme() {
  let list = [
    {
      key: 'USER_DEFINE',
      colorSchemeName: getLanguage(GLOBAL.language).Map_Main_Menu.USER_DEFINE,
      colorScheme: require('../../../../../../assets/uniqueColorScheme/USER_DEFINE.png'),
    },
    {
      key: 'BA_Blue',
      colorSchemeName: 'BA_Blue',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/BA_Blue.png'),
    },
    {
      key: 'BB_Green',
      colorSchemeName: 'BB_Green',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/BB_Green.png'),
    },
    {
      key: 'BC_Orange',
      colorSchemeName: 'BC_Orange',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/BC_Orange.png'),
    },
    {
      key: 'BD_Pink',
      colorSchemeName: 'BD_Pink',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/BD_Pink.png'),
    },
    {
      key: 'CA_Red Rose',
      colorSchemeName: 'CA_Red Rose',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/CA_Red_Rose.png'),
    },
    {
      key: 'CB_Blue and Yellow',
      colorSchemeName: 'CB_Blue and Yellow',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/CB_Blue_and_Yellow.png'),
    },
    {
      key: 'CC_Pink and Green',
      colorSchemeName: 'CC_Pink and Green',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/CC_Pink_and_Green.png'),
    },
    {
      key: 'CD_Fresh',
      colorSchemeName: 'CD_Fresh',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/CD_Fresh.png'),
    },
    {
      key: 'DA_Ragular',
      colorSchemeName: 'DA_Ragular',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/DA_Ragular.png'),
    },
    {
      key: 'DB_Common',
      colorSchemeName: 'DB_Common',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/DB_Common.png'),
    },
    {
      key: 'DC_Bright',
      colorSchemeName: 'DC_Bright',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/DC_Bright.png'),
    },
    {
      key: 'DD_Warm',
      colorSchemeName: 'DD_Warm',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/DD_Warm.png'),
    },
    {
      key: 'DE_Set',
      colorSchemeName: 'DE_Set',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/DE_Set.png'),
    },
    {
      key: 'DF_Pastel',
      colorSchemeName: 'DF_Pastel',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/DF_Pastel.png'),
    },
    {
      key: 'DG_Grass',
      colorSchemeName: 'DG_Grass',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/DG_Grass.png'),
    },
    {
      key: 'EA_Sin_ColorScheme8',
      colorSchemeName: 'EA_Sin_ColorScheme8',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EA_Sin_ColorScheme8.png'),
    },
    {
      key: 'EB_Sweet',
      colorSchemeName: 'EB_Sweet',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EB_Sweet.png'),
    },
    {
      key: 'EC_Dusk',
      colorSchemeName: 'EC_Dusk',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EC_Dusk.png'),
    },
    {
      key: 'ED_Pastel',
      colorSchemeName: 'ED_Pastel',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/ED_Pastel.png'),
    },
    {
      key: 'EE_Lake',
      colorSchemeName: 'EE_Lake',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EE_Lake.png'),
    },
    {
      key: 'EF_Grass',
      colorSchemeName: 'EF_Grass',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EF_Grass.png'),
    },
    {
      key: 'EG_Sin_ColorScheme1',
      colorSchemeName: 'EG_Sin_ColorScheme1',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EG_Sin_ColorScheme1.png'),
    },
    {
      key: 'EH_Sin_ColorScheme4',
      colorSchemeName: 'EH_Sin_ColorScheme4',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EH_Sin_ColorScheme4.png'),
    },
    {
      key: 'EI_Sin_ColorScheme6',
      colorSchemeName: 'EI_Sin_ColorScheme6',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EI_Sin_ColorScheme6.png'),
    },
    {
      key: 'EJ_Sin_ColorScheme7',
      colorSchemeName: 'EJ_Sin_ColorScheme7',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/EJ_Sin_ColorScheme7.png'),
    },
    {
      key: 'FA_Red-Yellow-Blue',
      colorSchemeName: 'FA_Red-Yellow-Blue',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/FA_Red-Yellow-Blue.png'),
    },
    {
      key: 'FA_Blue-Yellow-Red',
      colorSchemeName: 'FA_Blue-Yellow-Red',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/FA_Blue-Yellow-Red.png'),
    },
    {
      key: 'FB_Red-Yellow-Green',
      colorSchemeName: 'FB_Red-Yellow-Green',
      colorScheme: require('../../../../../../assets/uniqueColorScheme/FB_Red-Yellow-Green.png'),
    },
  ]
  return list
}

/**设置统计专题图类型 */
function setThemeGraphType() {
  const _params = ToolbarModule.getData().themeParams
  return SThemeCartography.setThemeGraphType(_params)
}

function getThemeGraphType() {
  let data = [
    {
      key: constants.THEME_GRAPH_AREA,
      title: getLanguage(global.language).Map_Main_Menu.THEME_AREA,
      //constants.THEME_GRAPH_AREA,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_area,
      selectedImage: getThemeAssets().themeType.theme_graph_area,
    },
    {
      key: constants.THEME_GRAPH_STEP,
      title: getLanguage(global.language).Map_Main_Menu.THEME_STEP,
      // constants.THEME_GRAPH_STEP,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_step,
      selectedImage: getThemeAssets().themeType.theme_graph_step,
    },
    {
      key: constants.THEME_GRAPH_LINE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_LINE,
      // constants.THEME_GRAPH_LINE,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_line,
      selectedImage: getThemeAssets().themeType.theme_graph_line,
    },
    {
      key: constants.THEME_GRAPH_POINT,
      title: getLanguage(global.language).Map_Main_Menu.THEME_POINT,
      // constants.THEME_GRAPH_POINT,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_point,
      selectedImage: getThemeAssets().themeType.theme_graph_point,
    },
    {
      key: constants.THEME_GRAPH_BAR,
      title: getLanguage(global.language).Map_Main_Menu.THEME_COLUMN,
      // constants.THEME_GRAPH_BAR,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_bar,
      selectedImage: getThemeAssets().themeType.theme_graph_bar,
    },
    {
      key: constants.THEME_GRAPH_BAR3D,
      title: getLanguage(global.language).Map_Main_Menu.THEME_3D_COLUMN,
      // constants.THEME_GRAPH_BAR3D,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_bar3d,
      selectedImage: getThemeAssets().themeType.theme_graph_bar3d,
    },
    {
      key: constants.THEME_GRAPH_PIE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_PIE,
      //constants.THEME_GRAPH_PIE,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_pie,
      selectedImage: getThemeAssets().themeType.theme_graph_pie,
    },
    {
      key: constants.THEME_GRAPH_PIE3D,
      title: getLanguage(global.language).Map_Main_Menu.THEME_3D_PIE,
      //constants.THEME_GRAPH_PIE3D,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_pie3d,
      selectedImage: getThemeAssets().themeType.theme_graph_pie3d,
    },
    {
      key: constants.THEME_GRAPH_ROSE,
      title: getLanguage(global.language).Map_Main_Menu.THEME_ROSE,
      //constants.THEME_GRAPH_ROSE,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_rose,
      selectedImage: getThemeAssets().themeType.theme_graph_rose,
    },
    {
      key: constants.THEME_GRAPH_ROSE3D,
      title: getLanguage(global.language).Map_Main_Menu.THEME_3D_ROSE,
      // constants.THEME_GRAPH_ROSE3D,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_rose3d,
      selectedImage: getThemeAssets().themeType.theme_graph_rose3d,
    },
    {
      key: constants.THEME_GRAPH_STACK_BAR,
      title: getLanguage(global.language).Map_Main_Menu.THEME_STACKED_BAR,
      // constants.THEME_GRAPH_STACK_BAR,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_stack_bar,
      selectedImage: getThemeAssets().themeType.theme_graph_stack_bar,
    },
    {
      key: constants.THEME_GRAPH_STACK_BAR3D,
      title: getLanguage(global.language).Map_Main_Menu.THEME_3D_STACKED_BAR,
      // constants.THEME_GRAPH_STACK_BAR3D,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_stack_bar3d,
      selectedImage: getThemeAssets().themeType.theme_graph_stack_bar3d,
    },
    {
      key: constants.THEME_GRAPH_RING,
      title: getLanguage(global.language).Map_Main_Menu.THEME_RING,
      // constants.THEME_GRAPH_RING,
      action: setThemeGraphType,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_ring,
      selectedImage: getThemeAssets().themeType.theme_graph_ring,
    },
  ]
  return data
}

/**设置统计专题图统计值计算方法 */
function setThemeGraphGraduatedMode() {
  const _params = ToolbarModule.getData().themeParams
  return SThemeCartography.setThemeGraphGraduatedMode(_params)
}

function getGraphThemeGradutedMode() {
  let data = [
    {
      key: constants.THEME_GRAPH_GRADUATEDMODE_CONS_KEY,
      title: getLanguage(global.language).Map_Main_Menu.THEME_CONSTANT,
      //constants.THEME_GRAPH_GRADUATEDMODE_CONS,
      action: setThemeGraphGraduatedMode,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_graduatedmode_cons,
      selectedImage: getThemeAssets().themeType.theme_graph_graduatedmode_cons,
    },
    {
      key: constants.THEME_GRAPH_GRADUATEDMODE_LOG_KEY,
      title: getLanguage(global.language).Map_Main_Menu.THEME_LOGARITHM,
      //constants.THEME_GRAPH_GRADUATEDMODE_LOG,
      action: setThemeGraphGraduatedMode,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_graduatedmode_log,
      selectedImage: getThemeAssets().themeType.theme_graph_graduatedmode_log,
    },
    {
      key: constants.THEME_GRAPH_GRADUATEDMODE_SQUARE_KEY,
      title: getLanguage(global.language).Map_Main_Menu.THEME_SQUARE_ROOT,
      //constants.THEME_GRAPH_GRADUATEDMODE_SQUARE,
      action: setThemeGraphGraduatedMode,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_graduatedmode_square,
      selectedImage: getThemeAssets().themeType
        .theme_graph_graduatedmode_square,
    },
  ]
  return data
}

/**设置等级符号专题图分级方式 */
function setThemeGraduatedSymbolGraduatedMode() {
  const _params = ToolbarModule.getData().themeParams
  return SThemeCartography.modifyGraduatedSymbolThemeMap(_params)
}

function getGraduatedSymbolGradutedMode() {
  let data = [
    {
      key: constants.THEME_GRADUATED_SYMBOL_GRADUATEDMODE_CONS_KEY,
      title: getLanguage(global.language).Map_Main_Menu.THEME_CONSTANT,
      //constants.THEME_GRADUATED_SYMBOL_GRADUATEDMODE_CONS,
      action: setThemeGraduatedSymbolGraduatedMode,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_graduatedmode_cons,
      selectedImage: getThemeAssets().themeType.theme_graph_graduatedmode_cons,
    },
    {
      key: constants.THEME_GRADUATED_SYMBOL_GRADUATEDMODE_LOG_KEY,
      title: getLanguage(global.language).Map_Main_Menu.THEME_LOGARITHM,
      //constants.THEME_GRADUATED_SYMBOL_GRADUATEDMODE_LOG,
      action: setThemeGraduatedSymbolGraduatedMode,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_graduatedmode_log,
      selectedImage: getThemeAssets().themeType.theme_graph_graduatedmode_log,
    },
    {
      key: constants.THEME_GRADUATED_SYMBOL_GRADUATEDMODE_SQUARE_KEY,
      title: getLanguage(global.language).Map_Main_Menu.THEME_SQUARE_ROOT,
      // constants.THEME_GRADUATED_SYMBOL_GRADUATEDMODE_SQUARE,
      action: setThemeGraduatedSymbolGraduatedMode,
      size: 'large',
      image: getThemeAssets().themeType.theme_graph_graduatedmode_square,
      selectedImage: getThemeAssets().themeType
        .theme_graph_graduatedmode_square,
    },
  ]
  return data
}

/**
 * 统计专题图颜色方案
 */
function getThemeGraphColorScheme() {
  let list = [
    {
      key: 'CA_Red Rose',
      colorSchemeName: 'CA_Red Rose',
      colorScheme: getPublicAssets().theme.graphColorScheme.CA_Red_Rose,
    },
    {
      key: 'CB_Childish',
      colorSchemeName: 'CB_Childish',
      colorScheme: getPublicAssets().theme.graphColorScheme.CB_Childish,
    },
    {
      key: 'CC_Blue-Yellow',
      colorSchemeName: 'CC_Blue-Yellow',
      colorScheme: getPublicAssets().theme.graphColorScheme.CC_Blue_Yellow,
    },
    {
      key: 'CD_Concise',
      colorSchemeName: 'CD_Concise',
      colorScheme: getPublicAssets().theme.graphColorScheme.CD_Concise,
    },
    {
      key: 'CE_Reposeful',
      colorSchemeName: 'CE_Reposeful',
      colorScheme: getPublicAssets().theme.graphColorScheme.CE_Reposeful,
    },
    {
      key: 'CF_Home',
      colorSchemeName: 'CF_Home',
      colorScheme: getPublicAssets().theme.graphColorScheme.CF_Home,
    },
    {
      key: 'CG_Cold',
      colorSchemeName: 'CG_Cold',
      colorScheme: getPublicAssets().theme.graphColorScheme.CG_Cold,
    },
    {
      key: 'CH_Naive',
      colorSchemeName: 'CH_Naive',
      colorScheme: getPublicAssets().theme.graphColorScheme.CH_Naive,
    },
    {
      key: 'DA_Limber',
      colorSchemeName: 'DA_Limber',
      colorScheme: getPublicAssets().theme.graphColorScheme.DA_Limber,
    },
    {
      key: 'DB_Field',
      colorSchemeName: 'DB_Field',
      colorScheme: getPublicAssets().theme.graphColorScheme.DB_Field,
    },
    {
      key: 'DC_Dressy',
      colorSchemeName: 'DC_Dressy',
      colorScheme: getPublicAssets().theme.graphColorScheme.DC_Dressy,
    },
    {
      key: 'DD_Set',
      colorSchemeName: 'DD_Set',
      colorScheme: getPublicAssets().theme.graphColorScheme.DD_Set,
    },
    {
      key: 'DE_Shock',
      colorSchemeName: 'DE_Shock',
      colorScheme: getPublicAssets().theme.graphColorScheme.DE_Shock,
    },
    {
      key: 'DF_Summer',
      colorSchemeName: 'DF_Summer',
      colorScheme: getPublicAssets().theme.graphColorScheme.DF_Summer,
    },
    {
      key: 'DG_Common',
      colorSchemeName: 'DG_Common',
      colorScheme: getPublicAssets().theme.graphColorScheme.DG_Common,
    },
    {
      key: 'DH_Red-Blue',
      colorSchemeName: 'DH_Red-Blue',
      colorScheme: getPublicAssets().theme.graphColorScheme.DH_Red_Blue,
    },
    {
      key: 'EA_Orange',
      colorSchemeName: 'EA_Orange',
      colorScheme: getPublicAssets().theme.graphColorScheme.EA_Orange,
    },
    {
      key: 'EB_Cold',
      colorSchemeName: 'EB_Cold',
      colorScheme: getPublicAssets().theme.graphColorScheme.EB_Cold,
    },
    {
      key: 'EC_Distinct',
      colorSchemeName: 'EC_Distinct',
      colorScheme: getPublicAssets().theme.graphColorScheme.EC_Distinct,
    },
    {
      key: 'ED_Pastal',
      colorSchemeName: 'ED_Pastal',
      colorScheme: getPublicAssets().theme.graphColorScheme.ED_Pastal,
    },
    {
      key: 'EE_Grass',
      colorSchemeName: 'EE_Grass',
      colorScheme: getPublicAssets().theme.graphColorScheme.EE_Grass,
    },
    {
      key: 'EF_Blind',
      colorSchemeName: 'EF_Blind',
      colorScheme: getPublicAssets().theme.graphColorScheme.EF_Blind,
    },
    {
      key: 'EG_Passion',
      colorSchemeName: 'EG_Passion',
      colorScheme: getPublicAssets().theme.graphColorScheme.EG_Passion,
    },
    {
      key: 'EH_Amazing',
      colorSchemeName: 'EH_Amazing',
      colorScheme: getPublicAssets().theme.graphColorScheme.EH_Amazing,
    },
    {
      key: 'HA_Calm',
      colorSchemeName: 'HA_Calm',
      colorScheme: getPublicAssets().theme.graphColorScheme.HA_Calm,
    },
    {
      key: 'HB_Distance',
      colorSchemeName: 'HB_Distance',
      colorScheme: getPublicAssets().theme.graphColorScheme.HB_Distance,
    },
    {
      key: 'HC_Exotic',
      colorSchemeName: 'HC_Exotic',
      colorScheme: getPublicAssets().theme.graphColorScheme.HC_Exotic,
    },
    {
      key: 'HD_Luck',
      colorSchemeName: 'HD_Luck',
      colorScheme: getPublicAssets().theme.graphColorScheme.HD_Luck,
    },
    {
      key: 'HE_Moist',
      colorSchemeName: 'HE_Moist',
      colorScheme: getPublicAssets().theme.graphColorScheme.HE_Moist,
    },
    {
      key: 'HF_Warm',
      colorSchemeName: 'HF_Warm',
      colorScheme: getPublicAssets().theme.graphColorScheme.HF_Warm,
    },
  ]
  return list
}

//得到去掉文件扩展名的文件名称
function basename(str) {
  var idx = str.lastIndexOf('/')
  idx = idx > -1 ? idx : str.lastIndexOf('\\')
  if (idx < 0) {
    return str
  }
  let file = str.substring(idx + 1)
  let arr = file.split('.')
  return arr[0]
}

/**专题图:添加 --> 统一风格 */
async function getUnifyStyleAdd() {
  let data = [],
    buttons = [
      ToolbarBtnType.THEME_CANCEL,
      // ToolbarBtnType.THEME_COMMIT,
    ]
  let checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)#$/
  let customerUDBPath = await FileTools.appendingHomeDirectory(
    ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
  )
  let customerUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
    extension: 'udb',
    type: 'file',
  })
  let customFilterUDBs = customerUDBs.filter(item => {
    item.name = basename(item.path)
    return !item.name.match(checkLabelAndPlot)
  })
  customFilterUDBs.map(item => {
    item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
    item.info = {
      infoType: 'mtime',
      lastModifiedDate: item.mtime,
    }
  })
  let userUDBPath, userUDBs
  if (
    ToolbarModule.getParams().user &&
    ToolbarModule.getParams().user.currentUser.userName
  ) {
    userUDBPath =
      (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
      ToolbarModule.getParams().user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Datasource
    userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
      extension: 'udb',
      type: 'file',
    })
    let userFilterUDBs = userUDBs.filter(item => {
      item.name = basename(item.path)
      return !item.name.match(checkLabelAndPlot)
    })
    userFilterUDBs.map(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
    })

    data = [
      // {
      //   title: Const.PUBLIC_DATA_SOURCE,
      //   data: customerUDBs,
      // },
      {
        title: getLanguage(global.language).Map_Main_Menu.OPEN_DATASOURCE,
        // Const.DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: userFilterUDBs,
      },
    ]
  } else {
    data = [
      {
        title: getLanguage(global.language).Map_Main_Menu.OPEN_DATASOURCE,
        //  Const.DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: customFilterUDBs,
      },
    ]
  }

  const type = ConstToolType.MAP_ADD
  const height =
    ToolbarModule.getParams().device.orientation === 'LANDSCAPE'
      ? ConstToolType.THEME_HEIGHT[3]
      : ConstToolType.THEME_HEIGHT[5]
  ToolbarModule.addData({
    type: type,
    getData: ThemeData.getData,
    data: {
      data,
      buttons,
      height,
    },
    actions: ThemeAction,
  })

  ToolbarModule.getParams().showFullMap &&
    ToolbarModule.getParams().showFullMap(true)
  ToolbarModule.getParams().setToolbarVisible &&
    ToolbarModule.getParams().setToolbarVisible(true, type, {
      containerType: ToolbarType.list,
      isFullScreen: true,
      isTouchProgress: false,
      showMenuDialog: false,
      height,
      column:
        ToolbarModule.getParams().device.orientation === 'LANDSCAPE' ? 8 : 4,
      data,
      buttons: buttons,
    })
  ToolbarModule.getParams().scrollListToLocation &&
    ToolbarModule.getParams().scrollListToLocation()
}

/**
 * 由数据集创建专题图
 */
async function createThemeByDataset(item, ToolbarParams = {}) {
  let paramsTheme = {}
  let isSuccess = false
  // let errorInfo = ''
  switch (ToolbarParams.themeCreateType) {
    case constants.THEME_UNIQUE_STYLE:
      //单值风格
      paramsTheme = {
        DatasourceAlias: ToolbarParams.themeDatasourceAlias,
        DatasetName: ToolbarParams.themeDatasetName,
        UniqueExpression: item.expression,
        // ColorGradientType: 'CYANWHITE',
        ColorScheme: 'BB_Green', //有ColorScheme，则ColorGradientType无效（ColorGradientType的颜色方案会被覆盖）
      }
      await SThemeCartography.createThemeUniqueMap(paramsTheme).then(msg => {
        isSuccess = msg
      })
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_RANGE_STYLE:
      //分段风格
      paramsTheme = {
        DatasourceAlias: ToolbarParams.themeDatasourceAlias,
        DatasetName: ToolbarParams.themeDatasetName,
        RangeExpression: item.expression,
        RangeMode: RangeMode.EQUALINTERVAL,
        RangeParameter: '11.0',
        ColorScheme: 'FF_Blues',
      }
      await SThemeCartography.createThemeRangeMap(paramsTheme).then(msg => {
        isSuccess = msg
      })
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_DOT_DENSITY:
      //点密度专题图
      paramsTheme = {
        DatasourceAlias: ToolbarParams.themeDatasourceAlias,
        DatasetName: ToolbarParams.themeDatasetName,
        DotExpression: item.expression,
        Value: '20',
      }
      await SThemeCartography.createDotDensityThemeMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_GRADUATED_SYMBOL:
      //等级符号专题图
      paramsTheme = {
        DatasourceAlias: ToolbarParams.themeDatasourceAlias,
        DatasetName: ToolbarParams.themeDatasetName,
        GraSymbolExpression: item.expression,
        GraduatedMode: 'LOGARITHM',
        //SymbolSize: '30',
      }
      await SThemeCartography.createGraduatedSymbolThemeMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_UNIFY_LABEL:
      //统一标签
      paramsTheme = {
        DatasourceAlias: ToolbarParams.themeDatasourceAlias,
        DatasetName: ToolbarParams.themeDatasetName,
        LabelExpression: item.expression,
        LabelBackShape: 'NONE',
        FontName: '宋体',
        // FontSize: '15.0',
        ForeColor: '#000000',
      }
      await SThemeCartography.createUniformThemeLabelMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_UNIQUE_LABEL:
      //单值标签
      paramsTheme = {
        DatasourceAlias: ToolbarParams.themeDatasourceAlias,
        DatasetName: ToolbarParams.themeDatasetName,
        UniqueExpression: item.expression,
        //RangeMode: RangeMode.EQUALINTERVAL,
        //RangeParameter: '11.0',
        ColorScheme: 'DA_Ragular',
      }
      await SThemeCartography.createUniqueThemeLabelMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_RANGE_LABEL:
      //分段标签
      paramsTheme = {
        DatasourceAlias: ToolbarParams.themeDatasourceAlias,
        DatasetName: ToolbarParams.themeDatasetName,
        RangeExpression: item.expression,
        RangeMode: RangeMode.EQUALINTERVAL,
        RangeParameter: '5.0',
        ColorScheme: 'CD_Cyans',
      }
      await SThemeCartography.createRangeThemeLabelMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
  }
  if (isSuccess) {
    Toast.show(getLanguage(ToolbarParams.language).Prompt.CREATE_SUCCESSFULLY)
    //设置当前图层
    ToolbarParams.getLayers(-1, layers => {
      ToolbarParams.setCurrentLayer(layers.length > 0 && layers[0])
    })
    ToolbarParams.setToolbarVisible(false)
  } else {
    Toast.show(getLanguage(global.language).Prompt.FIELD_ILLEGAL)
  }
}

/**
 * 由图层创建专题图
 */
async function createThemeByLayer(item, ToolbarParams = {}) {
  let paramsTheme = {}
  let isSuccess = false
  // let errorInfo = ''
  switch (ToolbarParams.themeCreateType) {
    case constants.THEME_UNIQUE_STYLE:
      //单值风格
      paramsTheme = {
        DatasourceAlias: item.datasourceName,
        DatasetName: item.datasetName,
        UniqueExpression: item.expression,
        ColorScheme: 'BB_Green',
      }
      await SThemeCartography.createThemeUniqueMap(paramsTheme).then(msg => {
        isSuccess = msg
      })
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_RANGE_STYLE:
      //分段风格
      paramsTheme = {
        DatasourceAlias: item.datasourceName,
        DatasetName: item.datasetName,
        RangeExpression: item.expression,
        RangeMode: RangeMode.EQUALINTERVAL,
        RangeParameter: '11.0',
        ColorScheme: 'CD_Cyans',
      }
      await SThemeCartography.createThemeRangeMap(paramsTheme).then(msg => {
        isSuccess = msg
      })
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_DOT_DENSITY:
      //点密度专题图
      paramsTheme = {
        DatasourceAlias: item.datasourceName,
        DatasetName: item.datasetName,
        DotExpression: item.expression,
        Value: '20',
      }
      await SThemeCartography.createDotDensityThemeMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_GRADUATED_SYMBOL:
      //等级符号专题图
      paramsTheme = {
        DatasourceAlias: item.datasourceName,
        DatasetName: item.datasetName,
        GraSymbolExpression: item.expression,
        GraduatedMode: 'LOGARITHM',
        //SymbolSize: '30',
      }
      await SThemeCartography.createGraduatedSymbolThemeMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_UNIFY_LABEL:
      //统一标签
      paramsTheme = {
        DatasourceAlias: item.datasourceName,
        DatasetName: item.datasetName,
        LabelExpression: item.expression,
        LabelBackShape: 'NONE',
        FontName: '宋体',
        // FontSize: '15.0',
        ForeColor: '#000000',
      }
      await SThemeCartography.createUniformThemeLabelMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_UNIQUE_LABEL:
      //单值标签
      paramsTheme = {
        DatasourceAlias: item.datasourceName,
        DatasetName: item.datasetName,
        UniqueExpression: item.expression,
        //RangeMode: RangeMode.EQUALINTERVAL,
        //RangeParameter: '11.0',
        ColorScheme: 'DA_Ragular',
      }
      await SThemeCartography.createUniqueThemeLabelMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
    case constants.THEME_RANGE_LABEL:
      //分段标签
      paramsTheme = {
        DatasourceAlias: item.datasourceName,
        DatasetName: item.datasetName,
        RangeExpression: item.expression,
        RangeMode: RangeMode.EQUALINTERVAL,
        RangeParameter: '5.0',
        ColorScheme: 'CD_Cyans',
      }
      await SThemeCartography.createRangeThemeLabelMap(paramsTheme).then(
        msg => {
          isSuccess = msg
        },
      )
      // .catch(err => {
      //   errorInfo = err.message
      // })
      break
  }
  if (isSuccess) {
    Toast.show(getLanguage(ToolbarParams.language).Prompt.CREATE_SUCCESSFULLY)
    //设置当前图层
    ToolbarParams.getLayers(-1, layers => {
      ToolbarParams.setCurrentLayer(layers.length > 0 && layers[0])
    })
    ToolbarParams.setToolbarVisible(false)
  } else {
    Toast.show(getLanguage(global.language).Prompt.FIELD_ILLEGAL)
  }
}

/**
 * 统计专题图颜色方案
 */
function getAggregationColorScheme() {
  let list = [
    {
      key: 'ZA_Insights',
      colorSchemeName: 'ZA_Insights',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.ZA_Insights,
    },
    {
      key: 'ZB_Sunrise',
      colorSchemeName: 'ZB_Sunrise',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.ZB_Sunrise,
    },
    {
      key: 'ZC_Garden',
      colorSchemeName: 'ZC_Garden',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.ZC_Garden,
    },
    {
      key: 'ZD_Classic',
      colorSchemeName: 'ZD_Classic',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.ZD_Classic,
    },
    {
      key: 'ZE_Warm',
      colorSchemeName: 'ZE_Warm',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.ZE_Warm,
    },
    {
      key: 'ZF_Dreamlike',
      colorSchemeName: 'ZF_Dreamlike',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.ZF_Dreamlike,
    },
    {
      key: 'BA_Rainbow',
      colorSchemeName: 'BA_Rainbow',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.BA_Rainbow,
    },
    {
      key: 'BB_LightRainbow',
      colorSchemeName: 'BB_LightRainbow',
      colorScheme: getPublicAssets().theme.aggregationColorScheme
        .BB_LightRainbow,
    },
    {
      key: 'BC_Lemon',
      colorSchemeName: 'BC_Lemon',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.BC_Lemon,
    },
    {
      key: 'BD_Scarlet',
      colorSchemeName: 'BD_Scarlet',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.BD_Scarlet,
    },
    {
      key: 'BE_Sea',
      colorSchemeName: 'BE_Sea',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.BE_Sea,
    },
    {
      key: 'BF_Orange',
      colorSchemeName: 'BF_Orange',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.BF_Orange,
    },
    {
      key: 'BG_Green',
      colorSchemeName: 'BG_Green',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.BG_Green,
    },
    {
      key: 'BH_Purple',
      colorSchemeName: 'BH_Purple',
      colorScheme: getPublicAssets().theme.aggregationColorScheme.BH_Purple,
    },
  ]
  return list
}

//通过数据集->创建热力图
async function createHeatMap(params) {
  let paramsTheme = {}
  let isSuccess = false
  let errorInfo = ''
  paramsTheme = {
    DatasourceAlias: params.themeDatasourceAlias,
    DatasetName: params.themeDatasetName,
    KernelRadius: '40',
    FuzzyDegree: '0.8',
    Intensity: '0.1',
    ColorType: 'ZA_Insights',
  }
  await SThemeCartography.createHeatMap(paramsTheme)
    .then(msg => {
      isSuccess = msg.Result
      errorInfo = msg.Error && msg.Error
    })
    .catch(err => {
      errorInfo = err.message
    })
  if (isSuccess) {
    // Toast.show('创建专题图成功')
    //设置当前图层
    ToolbarModule.getParams().getLayers(-1, layers => {
      ToolbarModule.getParams().setCurrentLayer(layers.length > 0 && layers[0])
    })
    ToolbarModule.getParams().setToolbarVisible(false)
  } else {
    if ('TypeError' === errorInfo) {
      Toast.show(
        global.language === 'CN'
          ? '只有点数据集可以创建'
          : 'Only point dataset can be created',
      )
    }
  }
}

function isThemeFieldTypeAvailable(fieldType, themeType) {
  if (themeType && themeType === constants.THEME_UNIFY_LABEL) {
    return true
  } else {
    return (
      fieldType === 'DOUBLE' ||
      fieldType === 'INT16' ||
      fieldType === 'INT32' ||
      fieldType === 'INT64' ||
      fieldType === 'LONGBINARY' ||
      fieldType === 'SINGLE'
    )
  }
}

//单值
const uniqueMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      ThemeAction.getUniqueColorScheme(
        ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
      )
    },
  },
]

//分段
const rangeMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    action: () => {
      ThemeAction.getRangeMode(
        ConstToolType.MAP_THEME_PARAM_RANGE_MODE,
        getLanguage(param).Map_Main_Menu.THEME_METHOD,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    selectKey: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    btnTitle: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    action: () => {
      ThemeAction.getRangeParameter(
        ConstToolType.MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT,
        // ConstToolType.MAP_THEME_PARAM_RANGE_PARAM,
        getLanguage(param).Map_Main_Menu.RANGE_COUNT,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      ThemeAction.getRangeColorScheme(
        ConstToolType.MAP_THEME_PARAM_RANGE_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
      )
    },
  },
]

//统一标签
const labelMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_BACK_SHAPE,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_BACK_SHAPE,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_BACK_SHAPE,
    action: () => {
      ThemeAction.getLabelBackShape(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE,
        getLanguage(param).Map_Main_Menu.THEME_BACK_SHAPE,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
    btnTitle: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
    action: () => {
      ThemeAction.getColorTable(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR,
        getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    action: () => {
      ThemeAction.getLabelFont(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME,
        getLanguage(param).Map_Main_Menu.STYLE_FONT,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    btnTitle: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    action: () => {
      ThemeAction.getLabelFontSize(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE,
        getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    btnTitle: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    action: () => {
      ThemeAction.getLabelFontRotation(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION,
        getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    btnTitle: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      ThemeAction.getColorTable(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR,
        getLanguage(param).Map_Main_Menu.STYLE_COLOR,
      )
    },
  },
]

//单值标签
const uniqueLabelMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_UNIQUE_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_UNIQUE_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_UNIQUE_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_UNIQUE_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      ThemeAction.getUniqueColorScheme(
        ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    action: () => {
      ThemeAction.getLabelFont(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME,
        getLanguage(param).Map_Main_Menu.STYLE_FONT,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    action: () => {
      ThemeAction.getLabelFontSize(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE,
        getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    action: () => {
      ThemeAction.getLabelFontRotation(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION,
        getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
      )
    },
  },
]

//分段标签
const rangeLabelMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_RANGE_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_RANGE_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_RANGE_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_RANGE_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    action: () => {
      ThemeAction.getRangeMode(
        ConstToolType.MAP_THEME_PARAM_RANGELABEL_MODE,
        getLanguage(param).Map_Main_Menu.THEME_METHOD,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      ThemeAction.getRangeColorScheme(
        ConstToolType.MAP_THEME_PARAM_RANGELABEL_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    selectKey: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    btnTitle: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    action: () => {
      ThemeAction.getRangeParameter(
        ConstToolType.MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT,
        // ConstToolType.MAP_THEME_PARAM_RANGE_PARAM,
        getLanguage(param).Map_Main_Menu.RANGE_COUNT,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    action: () => {
      ThemeAction.getLabelFont(
        ConstToolType.MAP_THEME_PARAM_RANGELABEL_FONTNAME,
        getLanguage(param).Map_Main_Menu.STYLE_FONT,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    action: () => {
      ThemeAction.getLabelFontSize(
        ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE,
        getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    action: () => {
      ThemeAction.getLabelFontRotation(
        ConstToolType.MAP_THEME_PARAM_RANGELABEL_ROTATION,
        getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
      )
    },
  },
]

//统计专题图
const graphMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getGraphThemeExpressions(
        ConstToolType.MAP_THEME_PARAM_GRAPH_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_GRANDUATE_BY,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_GRANDUATE_BY,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_GRANDUATE_BY,
    action: () => {
      ThemeAction.getGraphThemeGradutedMode(
        ConstToolType.MAP_THEME_PARAM_GRAPH_GRADUATEDMODE,
        getLanguage(param).Map_Main_Menu.THEME_GRANDUATE_BY,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      ThemeAction.getGraphThemeColorScheme(
        ConstToolType.MAP_THEME_PARAM_GRAPH_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE,
    action: () => {
      ThemeAction.getGraphMaxValue(
        ConstToolType.MAP_THEME_PARAM_GRAPH_MAXVALUE,
        getLanguage(param).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE,
        getLanguage(param).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE,
      )
    },
  },
]

//修改点密度专题图：设置点密度图的表达式，单点代表的值，点风格（大小和颜色）。
const dotDensityMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //'',
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.DOT_VALUE,
    selectKey: getLanguage(param).Map_Main_Menu.DOT_VALUE,
    btnTitle: getLanguage(param).Map_Main_Menu.DOT_VALUE,
    action: () => {
      ThemeAction.getDotDensityValueAndDotsize(
        ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_VALUE,
        getLanguage(param).Map_Main_Menu.DOT_VALUE,
        getLanguage(param).Map_Main_Menu.DOT_VALUE,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    //getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      ToolbarModule.getParams().setToolbarVisible(
        true,
        ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS,
        {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
          column: 4,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: getThemeFourMenu(),
          selectName: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
          selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
          themeType: constants.THEME_DOT_DENSITY,
        },
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    //getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    btnTitle: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    action: () => {
      ThemeAction.getDotDensityValueAndDotsize(
        ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_SIZE,
        getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
        getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: '点颜色',
    // getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    btnTitle: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      ThemeAction.getColorTable(
        ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_COLOR,
        '点颜色',
        '点颜色',
      )
    },
  },
]

//修改等级符号专题图：设置表达式，分级方式，基准值，正值基准值风格（大小和颜色）。
const graduatedSymbolMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      ThemeAction.getThemeExpress(
        ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION,
        getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.GRADUATE_BY,
    //'分级方式',
    selectKey: getLanguage(param).Map_Main_Menu.GRADUATE_BY,
    //'分级方式',
    btnTitle: getLanguage(param).Map_Main_Menu.GRADUATE_BY,
    //'分级方式',
    action: () => {
      ThemeAction.getGraduatedSymbolGradutedMode(
        ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE,
        '分级方式',
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.DATUM_VALUE,
    //'基准值',
    selectKey: getLanguage(param).Map_Main_Menu.DATUM_VALUE,
    //'基准值',
    btnTitle: getLanguage(param).Map_Main_Menu.DATUM_VALUE,
    //'基准值',
    action: () => {
      ThemeAction.getGraduatedSymbolBaseValueAndSymbolSize(
        ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_VALUE,
        getLanguage(param).Map_Main_Menu.DATUM_VALUE,
        getLanguage(param).Map_Main_Menu.DATUM_VALUE,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      ToolbarModule.getParams().setToolbarVisible(
        true,
        ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOLS,
        {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
          column: 4,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: getThemeFourMenu(),
          selectName: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
          selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
          themeType: constants.THEME_GRADUATED_SYMBOL,
        },
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    btnTitle: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    action: () => {
      ThemeAction.getGraduatedSymbolBaseValueAndSymbolSize(
        ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE,
        getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
        getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR,
    //'符号颜色',
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR,
    //'符号颜色',
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_COLOR,
    //'符号颜色',
    action: () => {
      ThemeAction.getColorTable(
        ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR,
        '符号颜色',
        '符号颜色',
      )
    },
  },
]

//栅格单值专题图
const gridUniqueMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      ThemeAction.getUniqueColorScheme(
        ConstToolType.MAP_THEME_PARAM_GRID_UNIQUE_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
      )
    },
  },
  // {
  //   key: '缺省风格',
  //   selectKey: '缺省风格',
  //   btnTitle: '缺省风格',
  //   action: () => {
  //     GLOBAL.toolBox &&
  //     GLOBAL.toolBox.getColorTable(
  //       ConstToolType.MAP_THEME_PARAM_GRID_UNIQUE_DEFAULT_COLOR,
  //       '缺省风格',
  //       '缺省风格',
  //     )
  //   },
  // },
]

//栅格分段专题图（分段方法有缺陷，只有等距分段有用，先注释掉）
const gridRangeMenuInfo = param => [
  // {
  //   key: '分段方法',
  //   selectKey: '分段方法',
  //   btnTitle: '分段方法',
  //   action: () => {
  //     GLOBAL.toolBox &&
  //     GLOBAL.toolBox.getGridRangeMode(
  //       ConstToolType.MAP_THEME_PARAM_GRID_RANGE_RANGEMODE,
  //       '分段方法',
  //       '分段方法',
  //     )
  //   },
  // },
  {
    key: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    selectKey: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    btnTitle: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    action: () => {
      ThemeAction.getRangeParameter(
        ConstToolType.MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT,
        getLanguage(param).Map_Main_Menu.RANGE_COUNT,
        getLanguage(param).Map_Main_Menu.RANGE_COUNT,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      ThemeAction.getRangeColorScheme(
        ConstToolType.MAP_THEME_PARAM_GRID_RANGE_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
        getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
      )
    },
  },
]

//热力图
const heatmapMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_RADIUS,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_RADIUS,
    // btnTitle: '核半径',
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_RADIUS,
    action: () => {
      ThemeAction.getHeatmapParams(
        ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_RADIUS,
        '核半径',
        '核半径',
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_COLOR,
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_COLOR,
    action: () => {
      ThemeAction.getAggregationColorScheme(
        ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_HEATMAP_COLOR,
        getLanguage(param).Map_Main_Menu.THEME_HEATMAP_COLOR,
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_FUZZY_DEGREE,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_FUZZY_DEGREE,
    // btnTitle: '颜色渐变模糊度',
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_FUZZY_DEGREE,
    action: () => {
      ThemeAction.getHeatmapParams(
        ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_FUZZYDEGREE,
        '颜色渐变模糊度',
        '颜色渐变模糊度',
      )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_MAXCOLOR_WEIGHT,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_MAXCOLOR_WEIGHT,
    // btnTitle: '最大颜色权重',
    btnTitle: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_MAXCOLOR_WEIGHT,
    action: () => {
      ThemeAction.getHeatmapParams(
        ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_MAXCOLOR_WEIGHT,
        '最大颜色权重',
        '最大颜色权重',
      )
    },
  },
]

/** 统计专题图字段表达式列表（多选） **/
async function getGraphThemeExpressionsData() {
  const _params = ToolbarModule.getParams()
  const themeCreateType = ToolbarModule.getData().themeCreateType
  let expressionData = await SThemeCartography.getThemeExpressionByLayerName(
    _params.language,
    _params.currentLayer.name,
  )
  let dataset = expressionData.dataset
  let allExpressions = []
  let param = {
    LayerName: _params.currentLayer.name,
  }
  let expressions = await SThemeCartography.getGraphExpressions(param)
  let selectedExpressions = expressions.list //已选择的字段列表
  let listExpressionsArr = []

  for (let i = 0; i < expressionData.list.length; i++) {
    let item = expressionData.list[i]
    if (isThemeFieldTypeAvailable(item.fieldTypeStr, themeCreateType)) {
      if (selectedExpressions) {
        for (let index = 0; index < selectedExpressions.length; index++) {
          let temp = {}
          temp[selectedExpressions[index]] = false
          item.isSelected = item.expression === selectedExpressions[index]
          if (item.isSelected === true) {
            //add xiezhy
            listExpressionsArr.push(temp)
            break
          }
        }
      } else {
        item.isSelected = false
      }
      item.info = {
        infoType: 'fieldType',
        fieldType: item.fieldType,
      }

      allExpressions.push(item)
    }
  }

  let listExpressionsObj = {}
  listExpressionsObj[dataset.datasetName] = listExpressionsArr
  // return {
  //   data: [
  //     {
  //       title: dataset.datasetName,
  //       datasetType: dataset.datasetType,
  //       expressionType: true,
  //       data: allExpressions,
  //     },
  //   ],
  //   listExpressions: listExpressionsObj,
  // }
  return [
    {
      title: dataset.datasetName,
      datasetType: dataset.datasetType,
      expressionType: true,
      data: allExpressions,
      listExpressions: listExpressionsObj,
    },
  ]
}

export default {
  getRangeMode,
  getColorGradientType,
  getLabelFont,
  getLabelBackShape,
  getLabelFontName,
  getLabelFontRotation,
  getColorTable,
  getThemeFourMenu,
  getThemeThreeMenu,
  getThemeMapCreate,
  getThemeMapParam,
  getRangeColorScheme,
  getUniqueColorScheme,
  getThemeMapStartCreate,
  getThemeFiveMenu,
  getThemeGraphType,
  getGraphThemeGradutedMode,
  setThemeGraphGraduatedMode,
  getThemeGraphColorScheme,
  getUnifyStyleAdd,
  basename,
  getGraduatedSymbolGradutedMode,
  //创建专题图
  createThemeByDataset,
  createThemeByLayer,
  createThemeGridUniqueMap,
  createThemeGridRangeMap,
  getGridRangeMode,
  getAggregationColorScheme,
  createHeatMap,
  getGraphThemeExpressionsData,

  isThemeFieldTypeAvailable,

  uniqueMenuInfo,
  rangeMenuInfo,
  labelMenuInfo,
  uniqueLabelMenuInfo,
  rangeLabelMenuInfo,
  graphMenuInfo,
  dotDensityMenuInfo,
  graduatedSymbolMenuInfo,
  gridUniqueMenuInfo,
  gridRangeMenuInfo,
  heatmapMenuInfo,
}
