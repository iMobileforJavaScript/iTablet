import { SThemeCartography, SMap, ThemeType } from 'imobile_for_reactnative'
import { ConstToolType, ToolbarType, Const } from '../../../../../../constants'
import ThemeMenuData from './data'
import ThemeData from './ThemeData'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import constants from '../../../../constants'
import Utils from '../../utils'
import NavigationService from '../../../../../NavigationService'

/**
 * 统一处理方法
 * @param params
 * {
 *  heights: [],   // 0 横屏高度 1 竖屏高度
 *  state: object // Toolbar state属性
 *    {
 *     type: string,  // Toolbar类型
 *     buttons: [],   // 底部按钮
 *     name: string,  // 被选中项的名字
 *     key: string,   // 被选中项的key
 *     ...other,
 *    }
 * }
 * @returns {Promise.<void>}
 */
async function dealData(params = {}, loading = true) {
  let _params = ToolbarModule.getParams()
  loading &&
    _params.setContainerLoading &&
    _params.setContainerLoading(
      true,
      getLanguage(_params.language).Prompt.READING_DATA,
    )
  let data = (params.getData && (await params.getData())) || []
  let height
  if (params.heights && params.heights.length === 1) {
    height = params.heights[0]
  } else {
    height =
      _params.device.orientation === 'LANDSCAPE'
        ? params.heights[0]
        : params.heights[1]
  }

  params.heights && delete params.heights
  _params.setToolbarVisible(true, params.state.type, {
    data,
    ...params.state,
    height,
    cb: () => {
      loading &&
        _params.setContainerLoading &&
        _params.setContainerLoading(false)
      // this.updateOverlayView()
      ToolbarModule.addData({
        // data,
        type: params.state.type,
      })
    },
  })
}

//专题图字段表达式列表
async function getThemeExpress(type, key = '', name = '') {
  const _params = ToolbarModule.getParams()
  const themeCreateType = ToolbarModule.getData().themeCreateType
  let expressionData = await SThemeCartography.getThemeExpressionByLayerName(
    _params.language,
    _params.currentLayer.name,
  )
  let selectedExpression
  let param = {
    LayerName: _params.currentLayer.name,
  }
  if (type === ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION) {
    selectedExpression = await SThemeCartography.getUniqueExpression(param)
  } else if (type === ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION) {
    selectedExpression = await SThemeCartography.getRangeExpression(param)
  } else if (type === ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION) {
    selectedExpression = await SThemeCartography.getUniformLabelExpression(
      param,
    )
  } else if (type === ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION) {
    selectedExpression = await SThemeCartography.getUniqueLabelExpression(param)
  } else if (type === ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION) {
    selectedExpression = await SThemeCartography.getRangeLabelExpression(param)
  } else if (type === ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION) {
    selectedExpression = await SThemeCartography.getDotDensityExpression(param)
  } else if (
    type === ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION
  ) {
    selectedExpression = await SThemeCartography.getGraduatedSymbolExpress(
      param,
    )
  }
  let dataset = expressionData.dataset
  let allExpressions = []
  // if (selectedExpression) {
  for (let i = 0; i < expressionData.list.length; i++) {
    let item = expressionData.list[i]
    if (
      type === ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION ||
      // type === ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION ||
      // type === ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION ||
      ThemeMenuData.isThemeFieldTypeAvailable(
        item.fieldTypeStr,
        themeCreateType,
      )
    ) {
      item.info = {
        infoType: 'fieldType',
        fieldType: item.fieldType,
      }
      item.isSelected = item.expression === selectedExpression
      allExpressions.push(item)
    }
  }
  expressionData.list = allExpressions //add xiezhy 过滤结果就应该保存
  ToolbarModule.addData({
    defaultExpression: selectedExpression,
  })
  let data = [
    {
      title: dataset.datasetName,
      datasetType: dataset.datasetType,
      expressionType: true,
      data: allExpressions,
    },
  ]

  _params.setToolbarVisible(true, type, {
    containerType: ToolbarType.list,
    isFullScreen: false,
    data,
    height:
      _params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[3]
        : ConstToolType.THEME_HEIGHT[5],
    buttons: [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.MENU,
      ToolbarBtnType.MENU_FLEX,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ],
    selectName: name || key,
    selectKey: key,
  })
}

//统计专题图字段表达式列表（多选）
async function getGraphThemeExpressions(type, key = '', name = '') {
  let getData = async function() {
    return ThemeMenuData.getGraphThemeExpressionsData()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[3], ConstToolType.THEME_HEIGHT[5]],
    getData: getData,
    state: {
      type,
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.selectableList,
      buttons: ThemeMenuData.getThemeFiveMenu(type),
      selectName: name || key,
      selectKey: key,
    },
  })
}

//统计专题图统计值计算方法
async function getGraphThemeGradutedMode(type, key = '', name = '') {
  let getData = function() {
    return ThemeMenuData.getGraphThemeGradutedMode()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[0]],
    getData: getData,
    state: {
      type,
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.table,
      listSelectable: false, //单选框
      column: 3,
      buttons: ThemeMenuData.getThemeFiveMenu(type),
      selectName: name || key,
      selectKey: key,
    },
  })
}

//等级符号专题图分级方式
async function getGraduatedSymbolGradutedMode(type, key = '', name = '') {
  let getData = async function() {
    return await ThemeMenuData.getGraduatedSymbolGradutedMode()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[0]],
    getData: getData,
    state: {
      type,
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.table,
      column: 3,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

//统计专题图颜色方案列表
async function getGraphThemeColorScheme(type, key = '', name = '') {
  let getData = async function() {
    return [
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .THEME_COLOR_SCHEME,
        //'颜色方案',
        data: await ThemeMenuData.getThemeGraphColorScheme(),
      },
    ]
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[3], ConstToolType.THEME_HEIGHT[5]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.list,
      listSelectable: false, //单选框
      type: type,
      buttons: ThemeMenuData.getThemeFiveMenu(type),
      selectName: name || key,
      selectKey: key,
    },
  })
}

//修改统计专题图类型
// async function changeGraphType() {
//   let getData = function() {
//     return ThemeMenuData.getThemeGraphType()
//   }
//
//   dealData({
//     heights: [ConstToolType.THEME_HEIGHT[8]],
//     getData: getData,
//     state: {
//       isFullScreen: false,
//       isTouchProgress: false,
//       showMenuDialog: false,
//       containerType: ToolbarType.horizontalTable,
//       column: 4,
//       type: ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE,
//       buttons: ThemeMenuData.getThemeFiveMenu(),
//     },
//   }, false)
// }

//单值专题图颜色方案列表
async function getUniqueColorScheme(type, key = '', name = '') {
  let getData = async function() {
    return [
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .THEME_COLOR_SCHEME,
        //'颜色方案',
        data: await ThemeMenuData.getUniqueColorScheme(),
      },
    ]
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[3], ConstToolType.THEME_HEIGHT[5]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.list,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

//分段专题图颜色方案列表
async function getRangeColorScheme(type, key = '', name = '') {
  let getData = async function() {
    return [
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .THEME_COLOR_SCHEME,
        //'颜色方案',
        data: await ThemeMenuData.getRangeColorScheme(),
      },
    ]
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[3], ConstToolType.THEME_HEIGHT[5]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.list,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

//热力图颜色方案列表
async function getAggregationColorScheme(type, key = '', name = '') {
  let getData = async function() {
    return [
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .THEME_HEATMAP_COLOR,
        //'颜色方案',
        data: await ThemeMenuData.getAggregationColorScheme(),
      },
    ]
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[3], ConstToolType.THEME_HEIGHT[5]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.list,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

async function getColorGradientType(type, key = '', name = '') {
  let getData = async function() {
    return [
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .THEME_COLOR_SCHEME,
        //'颜色方案',
        data: await ThemeMenuData.getColorGradientType(),
      },
    ]
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[3], ConstToolType.THEME_HEIGHT[5]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.list,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

async function getRangeMode(type, key = '', name = '') {
  let column =
    ToolbarModule.getParams().device.orientation === 'PORTRAIT' ? 4 : 8
  let getData = async function() {
    return await ThemeMenuData.getRangeMode(type)
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[0], ConstToolType.THEME_HEIGHT[2]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.table,
      column,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

async function getGridRangeMode(type, key = '', name = '') {
  let getData = async function() {
    return await ThemeMenuData.getGridRangeMode()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[0], ConstToolType.THEME_HEIGHT[2]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.table,
      column: 3,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

async function getRangeParameter(type, key = '', name = '') {
  dealData({
    heights: [0],
    // getData: getData,
    state: {
      isFullScreen: true,
      isTouchProgress: true,
      showMenuDialog: false,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
      data: [],
    },
  })
}

//专题图中统计符号显示的最大值(倍数)
async function getGraphMaxValue(type, key = '', name = '') {
  dealData({
    heights: [0],
    state: {
      isFullScreen: true,
      selectName: name || key,
      isTouchProgress: true,
      showMenuDialog: false,
      type: type,
      buttons: ThemeMenuData.getThemeFiveMenu(type),
      selectKey: key,
      data: [],
    },
  })
}

//点密度基础值，点大小
async function getDotDensityValueAndDotsize(type, key = '', name = '') {
  dealData({
    heights: [0],
    state: {
      isFullScreen: true,
      selectName: name || key, //'单点代表值' ，'符号大小'
      isTouchProgress: true,
      showMenuDialog: false,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectKey: key,
      data: [],
    },
  })
}

//热力图参数
async function getHeatmapParams(type, key = '', name = '') {
  dealData({
    heights: [0],
    state: {
      isFullScreen: true,
      selectName: name || key, //'核半径' ，'颜色渐变模糊度', '最大颜色权重'
      isTouchProgress: true,
      showMenuDialog: false,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectKey: key,
      data: [],
    },
  })
}

//等级符号基准值,点符号大小
async function getGraduatedSymbolBaseValueAndSymbolSize(
  type,
  key = '',
  name = '',
) {
  dealData({
    heights: [0],
    state: {
      isFullScreen: true,
      selectName: name || key, //基准值，符号大小
      isTouchProgress: true,
      showMenuDialog: false,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectKey: key,
      data: [],
    },
  })
}

async function getLabelBackShape(type, key = '', name = '') {
  let column =
    ToolbarModule.getParams().device.orientation === 'PORTRAIT' ? 4 : 8
  let getData = async function() {
    return await ThemeMenuData.getLabelBackShape()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[0], ConstToolType.THEME_HEIGHT[2]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.table,
      column,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

//各种专题图的颜色值选择
async function getColorTable(type, key = '', name = '') {
  let column =
    ToolbarModule.getParams().device.orientation === 'PORTRAIT' ? 8 : 12
  let getData = async function() {
    return await ThemeMenuData.getColorTable()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[7], ConstToolType.THEME_HEIGHT[3]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.colorTable,
      column,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

async function getLabelFontName(type, key = '', name = '') {
  let getData = async function() {
    return await ThemeMenuData.getLabelFontName()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[2], ConstToolType.THEME_HEIGHT[3]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.table,
      column: 4,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

async function getLabelFontRotation(type, key = '', name = '') {
  let getData = async function() {
    return await ThemeMenuData.getLabelFontRotation()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[0]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.table,
      column: 4,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

async function getLabelFont(type, key = '', name = '') {
  let getData = async function() {
    return await ThemeMenuData.getLabelFont()
  }

  dealData({
    heights: [ConstToolType.THEME_HEIGHT[0], ConstToolType.THEME_HEIGHT[2]],
    getData: getData,
    state: {
      isFullScreen: false,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.table,
      column: 4,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || key,
      selectKey: key,
    },
  })
}

async function getLabelFontSize(type, key = '', name = '') {
  dealData({
    heights: [0],
    state: {
      isFullScreen: true,
      isTouchProgress: true,
      showMenuDialog: false,
      type: type,
      buttons: ThemeMenuData.getThemeFourMenu(),
      selectName: name || 'fontsize',
      selectKey: key,
      data: [],
    },
  })
}

//统计专题图多选字段列表，修改所需字段，实时更新地图
async function listSelectableAction({ selectList }) {
  const _params = ToolbarModule.getParams()
  let list = []

  for (let key in selectList) {
    // let arr = selectList[key]
    // for (let i = 0, l = arr.length; i < l; i++) {
    //   for (let expression in arr[i]) {
    //     if (arr[i][expression] === false) list.push(expression)
    //   }
    // }
    list = list.concat(selectList[key])
  }

  ToolbarModule.addData({ selectList })
  let Params = {
    LayerName: _params.currentLayer.name,
    GraphExpressions: list,
  }
  await SThemeCartography.setThemeGraphExpressions(Params)
}

/**
 * containerType为list时，listAction为列表行点击事件
 * @param type
 * @param params {item, section, index}
 * @returns {Promise.<void>}
 */
async function listAction(type, params = {}) {
  const _params = ToolbarModule.getParams()
  const themeCreateType = ToolbarModule.getData().themeCreateType
  let item = params.item || {}
  if (type === ConstToolType.MAP_ADD) {
    // 数据源和地图列表点击事件
    // 添加数据集
    _params.setContainerLoading &&
      _params.setContainerLoading(
        true,
        getLanguage(_params.language).Prompt.READING_DATA,
      )
    const _data = await ThemeData.getDatasets(
      ConstToolType.MAP_THEME_ADD_DATASET,
      item,
    )
    let alias = _data.data[0].title
    const height =
      _params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[3]
        : ConstToolType.THEME_HEIGHT[5]
    let data = {
      type: type,
      getData: ThemeData.getData,
      lastData: ToolbarModule.getData().data,
      actions: actions,
      height,
      themeDatasourceAlias: alias,
    }
    let selectList = ToolbarModule.getData().selectList
    if (
      selectList &&
      Object.keys(selectList).length > 0 &&
      _data.data.length > 0 &&
      selectList[_data.data[0].title]
    ) {
      for (let _item of _data.data[0].data) {
        _item.isSelected =
          selectList[_data.data[0].title].indexOf(_item.datasetName) >= 0
      }
      Object.assign(data, { selectList: ToolbarModule.getData().selectList })
    }

    _params.showFullMap && _params.showFullMap(true)
    _params.setToolbarVisible(true, ConstToolType.MAP_THEME_ADD_DATASET, {
      containerType: ToolbarType.selectableList,
      isFullScreen: true,
      isTouchProgress: false,
      showMenuDialog: false,
      height,
      data: _data.data,
      buttons: _data.buttons,
      // cb: () => {
      //   ToolbarModule.addData({ themeDatasourceAlias: alias })
      // },
    })
    ToolbarModule.addData(data)

    _params.setContainerLoading && _params.setContainerLoading(false)
  } else if (type === ConstToolType.MAP_THEME_ADD_DATASET) {
    // 数据集列表点击事件
    let data = ToolbarModule.getData()
    if (data && data.selectList) {
      data = Object.assign(data.selectList, params.selectList)
    } else {
      data = Object.assign(data, { selectList: params.selectList })
    }
    ToolbarModule.addData(data)
  } else if (type === ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION) {
    //单值专题图表达式
    let Params = {
      UniqueExpression: item.expression,
      LayerName: _params.currentLayer.name,
    }
    // await SThemeCartography.setUniqueExpression(Params)
    params.refreshList && (await params.refreshList(item.expression))
    await SThemeCartography.modifyThemeUniqueMap(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR) {
    if (item.key === 'USER_DEFINE') {
      _params.setToolbarVisible(false, {
        isTouchProgress: false,
        showMenuDialog: false,
        selectKey: '',
      })
      _params.setToolbarVisible(false)
      NavigationService.navigate('CustomModePage', { type })
    } else {
      //单值专题图颜色表
      ToolbarModule.addData({ themeColor: item.key })
      let Params = {
        ColorScheme: item.key,
        LayerName: _params.currentLayer.name,
      }
      await SThemeCartography.setUniqueColorScheme(Params)
    }
  } else if (type === ConstToolType.MAP_THEME_PARAM_GRID_UNIQUE_COLOR) {
    //栅格单值专题图颜色表
    ToolbarModule.addData({ themeColor: item.key })
    let Params = {
      GridUniqueColorScheme: item.key,
      LayerName: _params.currentLayer.name,
    }
    await SThemeCartography.modifyThemeGridUniqueMap(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION) {
    //分段专题图表达式
    let Params = {
      RangeExpression: item.expression,
      LayerName: _params.currentLayer.name,
    }
    params.refreshList && (await params.refreshList(item.expression))
    await SThemeCartography.setRangeExpression(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION) {
    //点密度专题图表达式
    let Params = {
      DotExpression: item.expression,
      LayerName: _params.currentLayer.name,
    }
    params.refreshList && (await params.refreshList(item.expression))
    await SThemeCartography.modifyDotDensityThemeMap(Params)
  } else if (
    type === ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION
  ) {
    //等级符号专题图表达式
    let Params = {
      GraSymbolExpression: item.expression,
      LayerName: _params.currentLayer.name,
    }
    params.refreshList && (await params.refreshList(item.expression))
    await SThemeCartography.modifyGraduatedSymbolThemeMap(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_RANGE_COLOR) {
    //分段专题图颜色表
    ToolbarModule.addData({ themeColor: item.key })
    let Params = {
      ColorScheme: item.key,
      LayerName: _params.currentLayer.name,
    }
    await SThemeCartography.setRangeColorScheme(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_GRID_RANGE_COLOR) {
    //栅格分段专题图颜色表
    ToolbarModule.addData({ themeColor: item.key })
    let Params = {
      GridRangeColorScheme: item.key,
      LayerName: _params.currentLayer.name,
    }
    await SThemeCartography.modifyThemeGridRangeMap(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_GRAPH_COLOR) {
    //统计专题图颜色表
    ToolbarModule.addData({ themeColor: item.key })
    let Params = {
      GraphColorType: item.key,
      LayerName: _params.currentLayer.name,
    }
    await SThemeCartography.setThemeGraphColorScheme(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_COLOR) {
    //热力图颜色表
    ToolbarModule.addData({ themeColor: item.key })
    let Params = {
      HeatmapColorScheme: item.key,
      LayerName: _params.currentLayer.name,
    }
    await SThemeCartography.setHeatMapColorScheme(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION) {
    //统一标签表达式
    let Params = {
      LabelExpression: item.expression,
      LayerName: _params.currentLayer.name,
    }
    params.refreshList && (await params.refreshList(item.expression))
    await SThemeCartography.setUniformLabelExpression(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION) {
    //单值标签表达式
    let Params = {
      UniqueExpression: item.expression,
      LayerName: _params.currentLayer.name,
    }
    params.refreshList && (await params.refreshList(item.expression))
    await SThemeCartography.setUniqueLabelExpression(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR) {
    //单值标签专题图颜色表
    if (item.key === 'USER_DEFINE') {
      _params.setToolbarVisible(false, {
        isTouchProgress: false,
        showMenuDialog: false,
        selectKey: '',
      })
      _params.setToolbarVisible(false)
      NavigationService.navigate('CustomModePage', { type })
    } else {
      ToolbarModule.addData({ themeColor: item.key })
      let Params = {
        ColorScheme: item.key,
        LayerName: _params.currentLayer.name,
      }
      await SThemeCartography.setUniqueLabelColorScheme(Params)
    }
  } else if (type === ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION) {
    //分段标签表达式
    let Params = {
      RangeExpression: item.expression,
      LayerName: _params.currentLayer.name,
    }
    params.refreshList && (await params.refreshList(item.expression))
    await SThemeCartography.setRangeLabelExpression(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_RANGELABEL_COLOR) {
    //单值标签专题图颜色表
    ToolbarModule.addData({ themeColor: item.key })
    let Params = {
      ColorScheme: item.key,
      LayerName: _params.currentLayer.name,
    }
    await SThemeCartography.setRangeLabelColorScheme(Params)
  } else if (type === ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS) {
    //数据集选择列表(跳转到专题图字段选择列表)
    try {
      //栅格专题图直接由数据集创建，无需选择字段
      if (themeCreateType === constants.THEME_GRID_UNIQUE) {
        let params = {
          themeDatasourceAlias: item.datasourceName,
          themeDatasetName: item.datasetName,
        }
        ThemeMenuData.createThemeGridUniqueMap(params)
        return
      } else if (themeCreateType === constants.THEME_GRID_RANGE) {
        let params = {
          themeDatasourceAlias: item.datasourceName,
          themeDatasetName: item.datasetName,
        }
        ThemeMenuData.createThemeGridRangeMap(params)
        return
      } else if (themeCreateType === constants.THEME_HEATMAP) {
        //创建热力图
        let params = {
          themeDatasourceAlias: item.datasourceName,
          themeDatasetName: item.datasetName,
        }
        ThemeMenuData.createHeatMap(params)
        return
      }
      //其他专题图需要选择字段
      _params.setContainerLoading &&
        _params.setContainerLoading(
          true,
          getLanguage(_params.language).Prompt.READING_DATA,
        )
      let datasetData = await SThemeCartography.getThemeExpressionByDatasetName(
        _params.language,
        item.datasourceName,
        item.datasetName,
      )
      let dataset = datasetData.dataset
      let _list = []
      datasetData.list.forEach(item => {
        if (
          ThemeMenuData.isThemeFieldTypeAvailable(
            item.fieldTypeStr,
            themeCreateType,
          )
        ) {
          item.info = {
            infoType: 'fieldType',
            fieldType: item.fieldType,
          }
          _list.push(item)
        }
      })
      datasetData.list = _list
      let datalist = [
        {
          title: dataset.datasetName,
          datasetType: dataset.datasetType,
          expressionType: true,
          data: datasetData.list,
        },
      ]
      this.lastDatasetsList = _params.data //保存上次的数据集数据
      //统计专题图字段表达式可以多选
      let listSelectable = false
      switch (themeCreateType) {
        case constants.THEME_UNIQUE_STYLE:
        case constants.THEME_RANGE_STYLE:
        case constants.THEME_UNIFY_LABEL:
        case constants.THEME_UNIQUE_LABEL:
        case constants.THEME_RANGE_LABEL:
        case constants.THEME_DOT_DENSITY:
        case constants.THEME_GRADUATED_SYMBOL:
          listSelectable = false
          break
        case constants.THEME_GRAPH_AREA:
        case constants.THEME_GRAPH_STEP:
        case constants.THEME_GRAPH_LINE:
        case constants.THEME_GRAPH_POINT:
        case constants.THEME_GRAPH_BAR:
        case constants.THEME_GRAPH_BAR3D:
        case constants.THEME_GRAPH_PIE:
        case constants.THEME_GRAPH_PIE3D:
        case constants.THEME_GRAPH_ROSE:
        case constants.THEME_GRAPH_ROSE3D:
        case constants.THEME_GRAPH_STACK_BAR:
        case constants.THEME_GRAPH_STACK_BAR3D:
        case constants.THEME_GRAPH_RING:
          //统计专题图
          listSelectable = true
          break
      }
      _params.setToolbarVisible(
        true,
        ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION,
        {
          isFullScreen: true,
          isTouchProgress: false,
          showMenuDialog: false,
          // listSelectable: listSelectable, //单选框
          containerType: listSelectable
            ? ToolbarType.selectableList
            : ToolbarType.list,
          data: datalist,
          height:
            _params.device.orientation === 'PORTRAIT'
              ? ConstToolType.THEME_HEIGHT[5]
              : ConstToolType.THEME_HEIGHT[3],
          buttons: listSelectable
            ? [
              //ToolbarBtnType.THEME_CANCEL,
              ToolbarBtnType.TOOLBAR_BACK,
              ToolbarBtnType.TOOLBAR_COMMIT,
            ]
            : [ToolbarBtnType.TOOLBAR_BACK],
          cb: () => {
            ToolbarModule.addData({
              themeDatasourceAlias: item.datasourceName,
              themeDatasetName: item.datasetName,
              themeCreateType,
            })

            _params.setContainerLoading && _params.setContainerLoading(false)
            // this.updateOverlayView()
          },
        },
      )
    } catch (e) {
      _params.setContainerLoading && _params.setContainerLoading(false)
    }
  } else if (type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION) {
    if (params.selectList) {
      // 多选字段
      ToolbarModule.addData({ selectList: params.selectList })
      return
    }
    //点击字段名创建专题图(数据集创建)
    const themeDatasourceAlias = ToolbarModule.getData().themeDatasourceAlias
    const themeDatasetName = ToolbarModule.getData().themeDatasetName
    await ThemeMenuData.createThemeByDataset(item, {
      setToolbarVisible: _params.setToolbarVisible,
      ..._params,
      themeDatasourceAlias: themeDatasourceAlias,
      themeDatasetName: themeDatasetName,
      themeCreateType: themeCreateType,
    })
  } else if (
    type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME
  ) {
    if (params.selectList) {
      // 多选字段
      ToolbarModule.addData({ selectList: params.selectList })
      return
    }
    //点击字段名创建专题图(图层创建)
    await ThemeMenuData.createThemeByLayer(item, {
      setToolbarVisible: _params.setToolbarVisible,
      ..._params,
      themeCreateType: themeCreateType,
    })
  } else if (type === ConstToolType.MAP_THEME_PARAM_GRAPH_EXPRESSION) {
    params.selectList && listSelectableAction({ selectList: params.selectList })
  }
}

async function commit(type) {
  const _params = ToolbarModule.getParams()
  const _data = ToolbarModule.getData() || {}
  const themeCreateType = _data.themeCreateType
  const selectList = _data.selectList
  if (!_params) return
  if (selectList && Object.keys(selectList).length === 0) {
    Toast.show(getLanguage(_params.language).Prompt.PLEASE_ADD_DATASET)
    return
  }
  if (type === ConstToolType.MAP_THEME_ADD_DATASET) {
    for (let key of Object.keys(selectList)) {
      let resultArr = await SMap.addLayers(selectList[key], key)
      // 找出有默认样式的数据集，并给对应图层设置
      for (let i = 0; i < resultArr.length; i++) {
        let description =
          resultArr[i].description &&
          resultArr[i].description !== 'NULL' &&
          JSON.parse(resultArr[i].description)
        if (description && description.geoStyle) {
          await SMap.setLayerStyle(
            resultArr[i].layerName,
            JSON.stringify(description.geoStyle),
          )
        }
      }
      if (resultArr && resultArr.length > 0) {
        _params.getLayers(-1, layers => {
          if (layers.length > 0) {
            _params.setCurrentLayer(layers[0])
            SMap.setLayerEditable(layers[0].path, true)
          }
        })

        _params.setToolbarVisible(false)
        GLOBAL.dialog.setDialogVisible(true)
        Toast.show(getLanguage(_params.language).Prompt.ADD_SUCCESS)
      } else {
        Toast.show(getLanguage(_params.language).Prompt.ADD_FAILED)
      }
    }
  } else if (type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION) {
    let expressions = selectList[Object.keys(selectList)[0]] || []
    //数据集->创建统计专题图
    let params = {
      DatasourceAlias: _data.themeDatasourceAlias,
      DatasetName: _data.themeDatasetName,
      GraphExpressions: expressions,
      ThemeGraphType: themeCreateType,
    }
    let result = await SThemeCartography.createThemeGraphMap(params)
    result &&
      _params.getLayers(-1, layers => {
        _params.setCurrentLayer(layers.length > 0 && layers[0])
      })
    if (result) {
      _params.setToolbarVisible(false)
      GLOBAL.dialog.setDialogVisible(true)
      Toast.show(getLanguage(_params.language).Prompt.CREATE_SUCCESSFULLY)
    } else {
      Toast.show(getLanguage(_params.language).Prompt.CREATE_THEME_FAILED)
    }
  } else if (
    type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME
  ) {
    let result = false
    let expressions = selectList[Object.keys(selectList)[0]] || []
    //图层->创建统计专题图
    let params = {
      LayerName: _data.currentLayer.name || '', //图层名称
      GraphExpressions: expressions,
      ThemeGraphType: themeCreateType,
    }
    result = await SThemeCartography.createThemeGraphMapByLayer(params)
    result &&
      _params.getLayers(-1, layers => {
        _params.setCurrentLayer(layers.length > 0 && layers[0])
      })
    if (result) {
      _params.setToolbarVisible(false)
      GLOBAL.dialog.setDialogVisible(true)
      Toast.show(getLanguage(_params.language).Prompt.CREATE_SUCCESSFULLY)
    } else {
      Toast.show(getLanguage(_params.language).Prompt.CREATE_THEME_FAILED)
    }
  } else {
    ToolbarModule.setData()
    _params.setToolbarVisible(false)
  }
}

function tableAction(item = {}) {
  const _params = ToolbarModule.getParams()
  const _data = ToolbarModule.getData()

  let themeParams = {}

  switch (item.key) {
    case 'psDistance':
      item.action({
        callback: (result, listener) => {
          Toast.show(result + '米')
          this.MeasureListener = listener
        },
      })
      break
    case 'spaceSuerface':
      item.action({
        callback: (result, listener) => {
          Toast.show(result + '平方米')
          this.MeasureListener = listener
        },
      })
      break
    default: {
      let type = item.key
      let menuToolRef =
        _params.getMenuAlertDialogRef && _params.getMenuAlertDialogRef()
      if (menuToolRef && type !== '') {
        //创建的专题图类型
        //   thiss
        menuToolRef.setMenuType(type)
      }

      switch (_data.type) {
        case ConstToolType.MAP_THEME_PARAM_RANGE_MODE:
          //分段专题图：分段方法
          themeParams = {
            LayerName: _params.currentLayer.name,
            RangeMode: item.key,
          }
          break
        case ConstToolType.MAP_THEME_PARAM_GRID_RANGE_RANGEMODE:
          //分段栅格专题图：分段方法
          themeParams = {
            LayerName: _params.currentLayer.name,
            RangeMode: item.key,
          }
          break
        case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE:
          themeParams = {
            LayerName: _params.currentLayer.name,
            LabelBackShape: item.key,
          }
          break
        case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME:
          themeParams = {
            LayerName: _params.currentLayer.name,
            FontName: item.key,
          }
          break
        case ConstToolType.MAP_THEME_PARAM_RANGELABEL_FONTNAME:
          themeParams = {
            LayerName: _params.currentLayer.name,
            FontName: item.key,
            type: 'range',
          }
          break
        case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION:
          themeParams = {
            LayerName: _params.currentLayer.name,
            Rotaion: item.key,
          }
          break
        case ConstToolType.MAP_THEME_PARAM_RANGELABEL_ROTATION:
          themeParams = {
            LayerName: _params.currentLayer.name,
            Rotaion: item.key,
            type: 'range',
          }
          break
        case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR:
          //统一标签前景色
          themeParams = {
            LayerName: _params.currentLayer.name,
            Color: item.key,
            ColorType: 'UNIFORMLABEL_FORE_COLOR',
          }
          break
        case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR:
          //统一标签背景色
          themeParams = {
            LayerName: _params.currentLayer.name,
            Color: item.key,
            ColorType: 'UNIFORMLABEL_BACKSHAPE_COLOR',
          }
          break
        case ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE:
          //统计专题图类型
          themeParams = {
            LayerName: _params.currentLayer.name,
            ThemeGraphType: item.key,
          }
          break
        case ConstToolType.MAP_THEME_PARAM_GRAPH_GRADUATEDMODE:
          //统计专题图统计值计算方法
          themeParams = {
            LayerName: _params.currentLayer.name,
            GraduatedMode: item.key,
          }
          break
        case ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE:
          //等级符号专题图分级方式
          themeParams = {
            LayerName: _params.currentLayer.name,
            GraduatedMode: item.key,
          }
          break
        case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_COLOR:
          //点密度专题图：点颜色
          themeParams = {
            LayerName: _params.currentLayer.name,
            LineColor: item.key,
            ColorType: 'DOT_DENSITY_COLOR',
          }
          break
        case ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR:
          //等级符号专题图：点颜色
          themeParams = {
            LayerName: _params.currentLayer.name,
            LineColor: item.key,
            ColorType: 'GRADUATED_SYMBOL_COLOR',
          }
          break
        default:
          themeParams = {
            LayerName: _params.currentLayer.name,
            LabelBackShape: item.key,
          }
          break
      }

      ToolbarModule.addData({
        themeCreateType: item.key,
        themeParams,
      })
      item.action && item.action(item)
    }
  }
}

/**
 * 返回从添加数据集列表->数据源和地图列表
 */
function toolbarBack() {
  const _params = ToolbarModule.getParams()
  if (!_params) return
  const _data = ToolbarModule.getData()
  let lastData = _data.lastData || {}
  let selectList = _data.selectList
  // _params.setToolbarVisible(true, ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS, {
  _params.setToolbarVisible(true, _data.type, {
    containerType: ToolbarType.list,
    isFullScreen: true,
    isTouchProgress: false,
    showMenuDialog: false,
    data: lastData.data,
    buttons: lastData.buttons,
    height: _data.height,
  })
  ToolbarModule.addData({
    // type: ConstToolType.MAP_THEME,
    type: _data.type,
    getData: ThemeData.getData,
    actions: actions,
    selectList,
  })
}

async function layerListAction(data) {
  const _params = ToolbarModule.getParams()
  let curThemeType
  if (data.isHeatmap) {
    curThemeType = constants.THEME_HEATMAP
  } else {
    switch (data.themeType) {
      case ThemeType.UNIQUE:
        curThemeType = constants.THEME_UNIQUE_STYLE
        break
      case ThemeType.RANGE:
        curThemeType = constants.THEME_RANGE_STYLE
        break
      case ThemeType.LABEL:
        curThemeType = constants.THEME_UNIFY_LABEL
        break
      case ThemeType.LABELUNIQUE:
        curThemeType = constants.THEME_UNIQUE_LABEL
        break
      case ThemeType.LABELRANGE:
        curThemeType = constants.THEME_RANGE_LABEL
        break
      case ThemeType.DOTDENSITY:
        curThemeType = constants.THEME_DOT_DENSITY
        break
      case ThemeType.GRADUATEDSYMBOL:
        curThemeType = constants.THEME_GRADUATED_SYMBOL
        break
      case ThemeType.GRAPH:
        curThemeType = constants.THEME_GRAPH_STYLE
        break
      case ThemeType.GRIDRANGE:
        curThemeType = constants.THEME_GRID_RANGE
        break
      case ThemeType.GRIDUNIQUE:
        curThemeType = constants.THEME_GRID_UNIQUE
        break
      default:
        Toast.show(
          getLanguage(_params.language).Prompt
            .CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION,
        )
        break
    }
  }
  if (curThemeType) {
    const _type =
      curThemeType === constants.THEME_GRAPH_STYLE
        ? ConstToolType.MAP_THEME_PARAM_GRAPH
        : ConstToolType.MAP_THEME_PARAM
    _params.showFullMap(true)
    let orientation = _params.device.orientation
    let xml = await SMap.mapToXml()
    ToolbarModule.setData({
      type: _type,
      getData: ThemeData.getData,
      actions: actions,
      currentThemeData: data,
      themeCreateType: curThemeType,
      mapXml: xml,
    })
    _params.setToolbarVisible(true, _type, {
      containerType: ToolbarType.list,
      isFullScreen: true,
      height:
        orientation === 'PORTRAIT'
          ? ConstToolType.THEME_HEIGHT[3]
          : ConstToolType.TOOLBAR_HEIGHT_2[3],
      column: orientation === 'PORTRAIT' ? 8 : 4,
      themeType: curThemeType,
      isTouchProgress: false,
      showMenuDialog: true,
    })
    _params.navigation.navigate('MapView')
    Toast.show(
      getLanguage(_params.language).Prompt.THE_CURRENT_LAYER + '  ' + data.name,
    )
  }
}

function menu(type, selectKey, params = {}) {
  const _params = ToolbarModule.getParams()
  let isFullScreen, showMenuDialog, isTouchProgress
  let isBoxShow = GLOBAL.ToolBar && GLOBAL.ToolBar.getBoxShow()
  let showBox = function() {
    if (type.indexOf('MAP_THEME_PARAM') >= 0 && isBoxShow) {
      params.showBox && params.showBox()
    }
  }.bind(this)

  let setData = function() {
    let buttons
    if (type.indexOf('MAP_THEME_PARAM_GRAPH') >= 0) {
      buttons = ThemeMenuData.getThemeFiveMenu()
    } else {
      buttons = ThemeMenuData.getThemeFourMenu()
    }
    params.setData &&
      params.setData({
        isFullScreen,
        showMenuDialog,
        isTouchProgress,
        buttons,
      })
  }.bind(this)

  if (Utils.isTouchProgress(_params.language)) {
    isFullScreen = true
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = GLOBAL.ToolBar.state.showMenuDialog
    setData()
  } else {
    isFullScreen = !GLOBAL.ToolBar.state.showMenuDialog
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = false
    if (!GLOBAL.ToolBar.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }
}

function showMenuBox(type, selectKey, params = {}) {
  if (type.indexOf('MAP_THEME_PARAM') === -1) return
  if (type === ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE) {
    switch (selectKey) {
      case '表达式':
        getGraphThemeExpressions(
          ConstToolType.MAP_THEME_PARAM_GRAPH_EXPRESSION,
          '表达式',
        )
        break
      case '计算方法':
        getGraphThemeGradutedMode(
          ConstToolType.MAP_THEME_PARAM_GRAPH_GRADUATEDMODE,
          '计算方法',
        )
        break
      case '颜色方案':
        getGraphThemeColorScheme(
          ConstToolType.MAP_THEME_PARAM_GRAPH_COLOR,
          '颜色方案',
        )
        break
    }
  } else {
    params.showBox &&
      params.showBox({
        isTouchProgress: !GLOBAL.ToolBar.state.isTouchProgress,
        showMenuDialog: false,
        isFullScreen: !GLOBAL.ToolBar.state.isTouchProgress,
      })
  }
}

//修改统计专题图类型
async function changeGraphType(type) {
  const _params = ToolbarModule.getParams()
  let isBoxShow = GLOBAL.ToolBar && !GLOBAL.ToolBar.getBoxShow()
  if (type !== ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE) {
    // 其他Box展开到修改专题图类型Box展开
    type = ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE
    isBoxShow = true
  }
  GLOBAL.ToolBar && !GLOBAL.ToolBar.setBoxShow(isBoxShow)
  let showBox = function() {
    _params.contentView.changeHeight(
      isBoxShow ? ConstToolType.THEME_HEIGHT[8] : 0,
    )
  }.bind(this)

  let setData = async function() {
    let data = await ThemeMenuData.getThemeGraphType()
    GLOBAL.ToolBar &&
      GLOBAL.ToolBar.setState({
        isFullScreen: false,
        isTouchProgress: false,
        showMenuDialog: false,
        containerType: 'horizontalTable',
        listSelectable: false, //单选框
        column: 4,
        data,
        type,
        buttons: ThemeMenuData.getThemeFiveMenu(),
      })
  }.bind(this)

  if (!GLOBAL.ToolBar.state.showMenuDialog) {
    // 先滑出box，再显示Menu
    showBox()
    setTimeout(setData, Const.ANIMATED_DURATION_2)
  } else {
    // 先隐藏Menu，再滑进box
    setData()
    showBox()
  }

  ToolbarModule.addData({ type })
}

async function close() {
  const _params = ToolbarModule.getParams()
  const mapXml = await ToolbarModule.getData().mapXml

  await SMap.mapFromXml(mapXml) // 不保存专题图修改，还原地图

  ToolbarModule.setData()
  _params.setToolbarVisible(false, {
    isTouchProgress: false,
    showMenuDialog: false,
    selectKey: '',
  })
}

const actions = {
  commit,
  listAction,
  tableAction,
  toolbarBack,
  layerListAction,
  menu,
  showMenuBox,
  close,
  listSelectableAction,

  getThemeExpress,
  getGraphThemeExpressions,
  getGraphThemeGradutedMode,
  getGraduatedSymbolGradutedMode,
  getGraphThemeColorScheme,
  changeGraphType,
  getUniqueColorScheme,
  getRangeColorScheme,
  getAggregationColorScheme,
  getColorGradientType,
  getRangeMode,
  getGridRangeMode,
  getRangeParameter,
  getGraphMaxValue,
  getDotDensityValueAndDotsize,
  getHeatmapParams,
  getGraduatedSymbolBaseValueAndSymbolSize,
  getLabelBackShape,
  getColorTable,
  getLabelFontName,
  getLabelFontRotation,
  getLabelFontSize,
  getLabelFont,
}
export default actions
