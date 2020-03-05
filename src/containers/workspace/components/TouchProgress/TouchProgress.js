import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  PanResponder,
  Image,
  Text,
  Platform,
  // StatusBar,
  // AsyncStorage,
} from 'react-native'
import { screen, scaleSize } from '../../../../utils'
import {
  SCartography,
  SThemeCartography,
  ThemeType,
  SMap,
} from 'imobile_for_reactnative'
import constants from '../../constants'
import { ConstToolType } from '../../../../constants'
import { getLanguage } from '../../../../language'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'
import TPData from './TPData'
const IMAGE_SIZE = scaleSize(25)
const MARGIN = scaleSize(30)

export default class TouchProgress extends Component {
  props: {
    language: string,
    currentLayer: Object,
    selectName: any, // 智能配图 selectName 为Array；其余为String
    value: '',
    mapLegend?: Object,
    setMapLegend?: () => {},
    showMenu: () => {},
  }

  constructor(props) {
    super(props)
    this.screenWidth = screen.getScreenWidth()
    this._previousLeft = MARGIN - IMAGE_SIZE / 2
    this._panBtnStyles = {
      style: {
        left: this._previousLeft,
      },
    }
    this._linewidth = 0
    this.INTERVAL = 100
    this._BackLine = {
      style: {
        width: this._linewidth,
      },
    }
    this.state = {
      tips: '',
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })
    this._initStatusBarVisible()
  }

  // shouldComponentUpdate(nextProps) {
  //   let shouldUpdate =
  //     JSON.stringify(nextProps) !==
  //     JSON.stringify(this.props)
  //
  //   return shouldUpdate
  // }

  componentDidUpdate() {
    if (this.screenWidth !== screen.getScreenWidth()) {
      this._initialization()
      this.screenWidth = screen.getScreenWidth()
    }
  }

  componentDidMount() {
    this._initialization(this.props.value)
  }

  debounce = fn => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    let that = this
    this.timer = setTimeout(() => {
      fn()
      clearTimeout(that.timer)
      that.timer = null
    }, this.INTERVAL)
  }

  _setMapLegend = data => {
    this.debounce(this.props.setMapLegend.bind(this, data))
  }

  _initStatusBarVisible = async () => {
    // let result = await AsyncStorage.getItem('StatusBarVisible')
    // let invisible = result === 'true'
    // let android_statusHeight = invisible ? 0 : StatusBar.currentHeight
    //安卓进度条ToolBar直接扣除了状态栏和软键盘高度
    this.statusBarHeight = Platform.OS === 'ios' ? 20 : 0 //获取状态栏高度
  }

  _updateNativeStyles = () => {
    this.panBtn && this.panBtn.setNativeProps(this._panBtnStyles)
  }

  _updateBackLine = () => {
    this.backLine && this.backLine.setNativeProps(this._BackLine)
  }

  _initialization = async value => {
    let layerType = this.props.currentLayer.type
    let themeType = this.props.currentLayer.themeType
    let isHeatmap = this.props.currentLayer.isHeatmap

    let progressWidth = screen.getScreenWidth() - MARGIN * 2
    let panBtnDevLeft = MARGIN - IMAGE_SIZE / 2 // 图片相对左边偏差

    let tips = ''
    if (tips === '' && this.props.selectName instanceof Array) {
      // 智能配图 selectName 为数组
      let mode = TPData.getMatchPictureMode(this.props.selectName)
      let _value =
        value !== undefined ? value : await SMap.getMapFixColorsModeValue(mode)
      let _value2 = _value + 100
      this._panBtnStyles.style.left =
        (_value2 * progressWidth) / 200 + panBtnDevLeft
      this._previousLeft = (_value2 * progressWidth) / 200
      this._BackLine.style.width = (_value2 * progressWidth) / 200
      tips = TPData.getMatchPictureTip(this.props.selectName, _value)
    }
    if (
      (tips === '' &&
        GLOBAL.Type === constants.MAP_THEME &&
        this.props.currentLayer.themeType > 0) ||
      this.props.currentLayer.isHeatmap
    ) {
      if (isHeatmap) {
        if (
          this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.THEME_HEATMAP_RADIUS
        ) {
          this.nuclearRadius =
            value !== undefined
              ? value
              : await SThemeCartography.getHeatMapRadius({
                LayerName: this.props.currentLayer.name,
              })
          this._panBtnStyles.style.left =
            (this.nuclearRadius * progressWidth) / 50 + panBtnDevLeft
          this._previousLeft = (this.nuclearRadius * progressWidth) / 50
          this._BackLine.style.width = (this.nuclearRadius * progressWidth) / 50
          tips =
            getLanguage(global.language).Map_Main_Menu.THEME_HEATMAP_RADIUS +
            '     ' +
            parseInt(this.nuclearRadius)
        } else if (
          this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu
            .THEME_HEATMAP_FUZZY_DEGREE
        ) {
          this.fuzzyDegree =
            value !== undefined
              ? value
              : await SThemeCartography.getHeatMapFuzzyDegree({
                LayerName: this.props.currentLayer.name,
              })
          this._panBtnStyles.style.left =
            (this.fuzzyDegree * progressWidth) / 100 + panBtnDevLeft
          this._previousLeft = (this.fuzzyDegree * progressWidth) / 100
          this._BackLine.style.width = (this.fuzzyDegree * progressWidth) / 100
          tips =
            getLanguage(global.language).Map_Main_Menu
              .THEME_HEATMAP_FUZZY_DEGREE +
            '     ' +
            parseInt(this.fuzzyDegree) +
            '%'
        } else if (
          this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu
            .THEME_HEATMAP_MAXCOLOR_WEIGHT
        ) {
          this.maxColorWeight =
            value !== undefined
              ? value
              : await SThemeCartography.getHeatMapMaxColorWeight({
                LayerName: this.props.currentLayer.name,
              })
          this._panBtnStyles.style.left =
            (this.maxColorWeight * progressWidth) / 100 + panBtnDevLeft
          this._previousLeft = (this.maxColorWeight * progressWidth) / 100
          this._BackLine.style.width =
            (this.maxColorWeight * progressWidth) / 100
          tips =
            getLanguage(global.language).Map_Main_Menu
              .THEME_HEATMAP_MAXCOLOR_WEIGHT +
            '     ' +
            parseInt(this.maxColorWeight) +
            '%'
        }
      } else {
        switch (themeType) {
          case ThemeType.UNIQUE: // 单值专题图
            break
          case ThemeType.RANGE: // 分段专题图
            {
              this.ragngeCount =
                value !== undefined
                  ? value
                  : await SThemeCartography.getRangeCount({
                    LayerName: this.props.currentLayer.name,
                  })
              this._panBtnStyles.style.left =
                (this.ragngeCount * progressWidth) / 32 + panBtnDevLeft
              this._previousLeft = (this.ragngeCount * progressWidth) / 32
              this._BackLine.style.width =
                (this.ragngeCount * progressWidth) / 32
              tips =
                getLanguage(global.language).Map_Main_Menu.RANGE_COUNT +
                '     ' +
                parseInt(this.ragngeCount)
            }
            break
          case ThemeType.GRIDRANGE: // 分段栅格专题图
            {
              this.ragngeCount =
                value !== undefined
                  ? value
                  : await SThemeCartography.getGridRangeCount({
                    LayerName: this.props.currentLayer.name,
                  })
              this._panBtnStyles.style.left =
                (this.ragngeCount * progressWidth) / 32 + panBtnDevLeft
              this._previousLeft = (this.ragngeCount * progressWidth) / 32
              this._BackLine.style.width =
                (this.ragngeCount * progressWidth) / 32
              tips =
                getLanguage(global.language).Map_Main_Menu.RANGE_COUNT +
                '    ' +
                parseInt(this.ragngeCount)
            }
            break
          // case ThemeType.GRIDRANGE: // 分段栅格专题图
          //   {
          //     this.ragngeCount =
          //       value !== undefined
          //         ? value
          //         : await SThemeCartography.getGridRangeCount({
          //           LayerName: this.props.currentLayer.name,
          //         })
          //     this._panBtnStyles.style.left =
          //       (this.ragngeCount * progressWidth) / 32 + panBtnDevLeft
          //     this._previousLeft = (this.ragngeCount * progressWidth) / 32
          //     this._BackLine.style.width = (this.ragngeCount * progressWidth) / 32
          //     tips = '分段个数    ' + parseInt(this.ragngeCount)
          //   }
          //   break
          case ThemeType.DOTDENSITY: //点密度专题图
            {
              if (
                this.props.selectName ===
                getLanguage(this.props.language).Map_Main_Menu.DOT_VALUE
              ) {
                this.dotValue =
                  value !== undefined
                    ? value
                    : await SThemeCartography.getDotDensityValue({
                      LayerName: this.props.currentLayer.name,
                    })
                this._panBtnStyles.style.left =
                  (this.dotValue * progressWidth) / 100 + panBtnDevLeft
                this._previousLeft = (this.dotValue * progressWidth) / 100
                this._BackLine.style.width =
                  (this.dotValue * progressWidth) / 100
                tips =
                  getLanguage(global.language).Map_Main_Menu.DOT_VALUE +
                  '     ' +
                  parseInt(this.dotValue)
              } else if (
                this.props.selectName ===
                getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
              ) {
                this.dotSize =
                  value !== undefined
                    ? value
                    : await SThemeCartography.getDotDensityDotSize({
                      LayerName: this.props.currentLayer.name,
                    })
                this._panBtnStyles.style.left =
                  (this.dotSize * progressWidth) / 100 + panBtnDevLeft
                this._previousLeft = (this.dotSize * progressWidth) / 100
                this._BackLine.style.width =
                  (this.dotSize * progressWidth) / 100
                tips =
                  getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
                  '     ' +
                  parseInt(this.dotSize) +
                  'mm'
              }
            }
            break
          case ThemeType.GRADUATEDSYMBOL: //等级符号专题图专题图
            {
              if (
                this.props.selectName ===
                getLanguage(this.props.language).Map_Main_Menu.DATUM_VALUE
              ) {
                this.baseValue =
                  value !== undefined
                    ? value
                    : await SThemeCartography.getGraduatedSymbolValue({
                      LayerName: this.props.currentLayer.name,
                    })
                this._panBtnStyles.style.left =
                  (this.baseValue * progressWidth) / 10000 + panBtnDevLeft
                this._previousLeft = (this.baseValue * progressWidth) / 10000
                this._BackLine.style.width =
                  (this.baseValue * progressWidth) / 10000
                tips =
                  getLanguage(global.language).Map_Main_Menu.DATUM_VALUE +
                  '     ' +
                  parseInt(this.baseValue)
              } else if (
                this.props.selectName ===
                getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
              ) {
                this.graSymbolSize =
                  value !== undefined
                    ? value
                    : await SThemeCartography.getGraduatedSymbolSize({
                      LayerName: this.props.currentLayer.name,
                    })
                this._panBtnStyles.style.left =
                  (this.graSymbolSize * progressWidth) / 100 + panBtnDevLeft
                this._previousLeft = (this.graSymbolSize * progressWidth) / 100
                this._BackLine.style.width =
                  (this.graSymbolSize * progressWidth) / 100
                tips =
                  getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
                  '     ' +
                  parseInt(this.graSymbolSize) +
                  'mm'
              }
            }
            break
          case ThemeType.LABELUNIQUE:
          case ThemeType.LABEL: // 标签专题图
            {
              //避免切换地图后 图例设置走这个case
              if (
                this.props.selectName ===
                  getLanguage(this.props.language).Map_Main_Menu
                    .STYLE_FONT_SIZE ||
                this.props.selectName === 'fontsize'
              ) {
                this.fontsize =
                  value !== undefined
                    ? value
                    : await SThemeCartography.getLabelFontSize({
                      LayerName: this.props.currentLayer.name,
                    })
                this._panBtnStyles.style.left =
                  (this.fontsize * progressWidth) / 20 + panBtnDevLeft
                this._previousLeft = (this.fontsize * progressWidth) / 20
                this._BackLine.style.width =
                  (this.fontsize * progressWidth) / 20
                tips =
                  getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE +
                  '     ' +
                  parseInt(this.fontsize)
              }
            }
            break
          case ThemeType.LABELRANGE: // 分段标签专题图
            {
              //避免切换地图后 图例设置走这个case
              if (
                this.props.selectName ===
                  getLanguage(this.props.language).Map_Main_Menu
                    .STYLE_FONT_SIZE ||
                this.props.selectName === 'fontsize'
              ) {
                this.fontsize =
                  value !== undefined
                    ? value
                    : await SThemeCartography.getLabelFontSize({
                      LayerName: this.props.currentLayer.name,
                      type: 'range',
                    })
                this._panBtnStyles.style.left =
                  (this.fontsize * progressWidth) / 20 + panBtnDevLeft
                this._previousLeft = (this.fontsize * progressWidth) / 20
                this._BackLine.style.width =
                  (this.fontsize * progressWidth) / 20
                tips =
                  getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE +
                  '     ' +
                  parseInt(this.fontsize)
              } else if (
                this.props.selectName ===
                getLanguage(this.props.language).Map_Main_Menu.RANGE_COUNT
              ) {
                this.ragngeCount =
                  value !== undefined
                    ? value
                    : await SThemeCartography.getRangeCount({
                      LayerName: this.props.currentLayer.name,
                    })
                this._panBtnStyles.style.left =
                  (this.ragngeCount * progressWidth) / 32 + panBtnDevLeft
                this._previousLeft = (this.ragngeCount * progressWidth) / 32
                this._BackLine.style.width =
                  (this.ragngeCount * progressWidth) / 32
                tips =
                  getLanguage(global.language).Map_Main_Menu.RANGE_COUNT +
                  '     ' +
                  parseInt(this.ragngeCount)
              }
            }
            break
          case ThemeType.GRAPH:
            {
              if (
                this.props.selectName ===
                getLanguage(this.props.language).Map_Main_Menu
                  .THEME_MAX_VISIBLE_SIZE
              ) {
                let newValue =
                  value !== undefined
                    ? value
                    : await SThemeCartography.getGraphMaxValue({
                      LayerName: this.props.currentLayer.name,
                    })

                if (newValue <= 1) {
                  newValue = 1
                } else if (newValue > 20) {
                  newValue = 20
                }
                this._panBtnStyles.style.left =
                  (newValue * progressWidth) / 20 + panBtnDevLeft
                this._previousLeft = (newValue * progressWidth) / 20
                this._BackLine.style.width = (newValue * progressWidth) / 20
                tips =
                  getLanguage(global.language).Map_Main_Menu
                    .THEME_MAX_VISIBLE_SIZE +
                  '     ' +
                  parseInt(newValue) +
                  'X'
              }
            }
            break
        }
      }
    }
    if (tips === '') {
      switch (layerType) {
        case 1: {
          if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
          ) {
            let pointSize =
              value !== undefined
                ? value
                : await SCartography.getMarkerSize(this.props.currentLayer.name)
            this._panBtnStyles.style.left =
              (pointSize * progressWidth) / 100 + panBtnDevLeft
            this._previousLeft = (pointSize * progressWidth) / 100
            this._BackLine.style.width = (pointSize * progressWidth) / 100
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
              '     ' +
              parseInt(pointSize) +
              'mm'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            let pointAlpha =
              value !== undefined
                ? value
                : await SCartography.getMarkerAlpha(
                  this.props.currentLayer.name,
                )
            this._panBtnStyles.style.left =
              (pointAlpha * progressWidth) / 100 + panBtnDevLeft
            this._previousLeft = (pointAlpha * progressWidth) / 100
            this._BackLine.style.width = (pointAlpha * progressWidth) / 100
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(pointAlpha) +
              '%'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION
          ) {
            let pointAngle =
              value !== undefined
                ? value
                : await SCartography.getMarkerAngle(
                  this.props.currentLayer.name,
                )
            this._panBtnStyles.style.left =
              (pointAngle * progressWidth) / 360 + panBtnDevLeft
            this._previousLeft = (pointAngle * progressWidth) / 360
            this._BackLine.style.width = (pointAngle * progressWidth) / 360
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
              '     ' +
              parseInt(pointAngle) +
              '°'
          }
          break
        }
        case 3: {
          let lineWidth =
            value !== undefined
              ? value
              : await SCartography.getLineWidth(this.props.currentLayer.name)
          this._panBtnStyles.style.left =
            (lineWidth * progressWidth) / 20 + panBtnDevLeft
          this._previousLeft = (lineWidth * progressWidth) / 20
          this._BackLine.style.width = (lineWidth * progressWidth) / 20
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH +
            '     ' +
            parseInt(lineWidth) +
            'mm'
          break
        }
        case 5: {
          if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH
          ) {
            let lineWidth = await SCartography.getLineWidth(
              this.props.currentLayer.name,
            )
            // console.warn('xzy---- '+lineWidth +' '+progressWidth)
            if (value !== undefined) {
              lineWidth = value
            }
            // debugger
            this._panBtnStyles.style.left =
              (lineWidth * progressWidth) / 100 + panBtnDevLeft
            this._previousLeft = (lineWidth * progressWidth) / 100
            this._BackLine.style.width = (lineWidth * progressWidth) / 100
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH +
              '     ' +
              parseInt(lineWidth) +
              'mm'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            let fillOpaque =
              value !== undefined
                ? value
                : await SCartography.getFillOpaqueRate(
                  this.props.currentLayer.name,
                )
            this._panBtnStyles.style.left =
              (fillOpaque * progressWidth) / 100 + panBtnDevLeft
            this._previousLeft = (fillOpaque * progressWidth) / 100
            this._BackLine.style.width = (fillOpaque * progressWidth) / 100
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(fillOpaque) +
              '%'
          }
          break
        }
        case 83: {
          if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            let gridOpaque =
              value !== undefined
                ? value
                : await SCartography.getGridOpaqueRate(
                  this.props.currentLayer.name,
                )
            this._panBtnStyles.style.left =
              (gridOpaque * progressWidth) / 100 + panBtnDevLeft
            this._previousLeft = (gridOpaque * progressWidth) / 100
            this._BackLine.style.width = (gridOpaque * progressWidth) / 100
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(gridOpaque)
          } else if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.STYLE_BRIGHTNESS
          ) {
            let gridBright =
              value !== undefined
                ? value
                : (await SCartography.getGridBrightness(
                  this.props.currentLayer.name,
                )) + 100
            this._panBtnStyles.style.left =
              (gridBright * progressWidth) / 200 + panBtnDevLeft
            this._previousLeft = (gridBright * progressWidth) / 200
            this._BackLine.style.width = (gridBright * progressWidth) / 200
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
              '     ' +
              parseInt(gridBright - 100) +
              '%'
          } else if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.CONTRAST
          ) {
            let gridContrast =
              value !== undefined
                ? value
                : (await SCartography.getGridContrast(
                  this.props.currentLayer.name,
                )) + 100
            this._panBtnStyles.style.left =
              (gridContrast * progressWidth) / 200 + panBtnDevLeft
            this._previousLeft = (gridContrast * progressWidth) / 200
            this._BackLine.style.width = (gridContrast * progressWidth) / 200
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
              '     ' +
              parseInt(gridContrast - 100) +
              '%'
          }
          break
        }
      }
      if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN
      ) {
        let columnnumber = this.props.mapLegend[GLOBAL.Type].column
        this._panBtnStyles.style.left =
          (columnnumber * 10 * progressWidth) / 40 + panBtnDevLeft
        this._previousLeft = (columnnumber * 10 * progressWidth) / 40
        this._BackLine.style.width = (columnnumber * 10 * progressWidth) / 40
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN +
          '     ' +
          parseInt(columnnumber)
      } else if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH
      ) {
        let width = this.props.mapLegend[GLOBAL.Type].widthPercent
        this._panBtnStyles.style.left =
          (width * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (width * progressWidth) / 100
        this._BackLine.style.width = (width * progressWidth) / 100
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH +
          '     ' +
          parseInt(width)
      } else if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT
      ) {
        let height = this.props.mapLegend[GLOBAL.Type].heightPercent
        this._panBtnStyles.style.left =
          (height * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (height * progressWidth) / 100
        this._BackLine.style.width = (height * progressWidth) / 100
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT +
          '     ' +
          parseInt(height)
      } else if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_ICON
      ) {
        let imagePercent = this.props.mapLegend[GLOBAL.Type].imagePercent
        this._panBtnStyles.style.left =
          (imagePercent * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (imagePercent * progressWidth) / 100
        this._BackLine.style.width = (imagePercent * progressWidth) / 100
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_ICON +
          '     ' +
          parseInt(imagePercent)
      } else if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_FONT
      ) {
        let fontPercent = this.props.mapLegend[GLOBAL.Type].fontPercent
        this._panBtnStyles.style.left =
          (fontPercent * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (fontPercent * progressWidth) / 100
        this._BackLine.style.width = (fontPercent * progressWidth) / 100
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_FONT +
          '     ' +
          parseInt(fontPercent)
      }
    }

    if (
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_FONT ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET
    ) {
      if (
        this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.STYLE_LINE_WIDTH ||
        this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.STYLE_BORDER_WIDTH
      ) {
        let lineWidth = await SMap.getTaggingLineWidth()
        this._panBtnStyles.style.left =
          (lineWidth * progressWidth) / 20 + panBtnDevLeft
        this._previousLeft = (lineWidth * progressWidth) / 20
        this._BackLine.style.width = (lineWidth * progressWidth) / 20
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH +
          '     ' +
          parseInt(lineWidth) +
          'mm'
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
      ) {
        let pointSize = await SMap.getTaggingMarkerSize()
        this._panBtnStyles.style.left =
          (pointSize * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (pointSize * progressWidth) / 100
        this._BackLine.style.width = (pointSize * progressWidth) / 100
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
          '     ' +
          parseInt(pointSize) +
          'mm'
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.STYLE_ROTATION
      ) {
        let pointAngle = await SMap.getTaggingAngle()
        this._panBtnStyles.style.left =
          (pointAngle * progressWidth) / 360 + panBtnDevLeft
        this._previousLeft = (pointAngle * progressWidth) / 360
        this._BackLine.style.width = (pointAngle * progressWidth) / 360
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
          '     ' +
          parseInt(pointAngle) +
          '°'
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.STYLE_TRANSPARENCY
      ) {
        let pointAlpha = await SMap.getTaggingAlpha()
        this._panBtnStyles.style.left =
          (pointAlpha * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (pointAlpha * progressWidth) / 100
        this._BackLine.style.width = (pointAlpha * progressWidth) / 100
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
          '     ' +
          parseInt(pointAlpha) +
          '%'
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.STYLE_FONT_SIZE
      ) {
        let value = await SMap.getTaggingTextSize()
        if (value <= 1) {
          value = 1
        } else if (value > 20) {
          value = 20
        }
        this._panBtnStyles.style.left =
          (value * progressWidth) / 20 + panBtnDevLeft
        this._previousLeft = (value * progressWidth) / 20
        this._BackLine.style.width = (value * progressWidth) / 20
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE +
          '     ' +
          parseInt(value)
      } else if (this.props.selectName === 'TEXT_ROTATION') {
        let angle = await SMap.getTaggingTextAngle()
        this._panBtnStyles.style.left =
          (angle * progressWidth) / 360 + panBtnDevLeft
        this._previousLeft = (angle * progressWidth) / 360
        this._BackLine.style.width = (angle * progressWidth) / 360
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
          '     ' +
          parseInt(angle) +
          '°'
      }
    }

    if (tips !== this.state.tips) {
      this.setState({
        tips,
      })
    }
    this._updateNativeStyles()
    this._updateBackLine()
  }

  _handleStartShouldSetPanResponder = () => {
    // evt, gestureState
    return true
  }

  _handleMoveShouldSetPanResponder = () => {
    // evt, gestureState
    return true
  }

  _handlePanResponderMove = (evt, gestureState) => {
    if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
      if (Math.abs(gestureState.dy) > 20) {
        this.showMenu()
      }
    } else {
      let progressWidth = screen.getScreenWidth() - MARGIN * 2
      let x = this._previousLeft + gestureState.dx
      this._panBtnStyles.style.left = x + MARGIN - IMAGE_SIZE / 2
      if (this._panBtnStyles.style.left <= -IMAGE_SIZE / 2)
        this._panBtnStyles.style.left = MARGIN - IMAGE_SIZE / 2
      if (
        this._panBtnStyles.style.left >=
        progressWidth + MARGIN - IMAGE_SIZE / 2
      )
        this._panBtnStyles.style.left = progressWidth + MARGIN - IMAGE_SIZE / 2

      this._BackLine.style.width = x
      if (this._BackLine.style.width <= 0) this._BackLine.style.width = 0
      if (this._BackLine.style.width >= progressWidth)
        this._BackLine.style.width = progressWidth
      this._updateNativeStyles()
      this._updateBackLine()

      let _value = x / progressWidth
      let value = this.dealData(_value > 1 ? 1 : _value < 0 ? 0 : _value)
      value !== undefined && this.setTips(value)
    }
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    let progressWidth = screen.getScreenWidth() - MARGIN * 2
    let x = this._previousLeft + gestureState.dx
    if (x <= 0) x = 0
    if (x >= progressWidth + MARGIN - IMAGE_SIZE / 2)
      x = progressWidth + MARGIN - IMAGE_SIZE / 2
    this._previousLeft = x

    let _value = x / progressWidth
    let value = this.dealData(_value > 1 ? 1 : _value < 0 ? 0 : _value)
    value !== undefined && this.setData(value)
  }

  /**
   * 上下滑动唤出菜单
   * @param value
   * @returns {*}
   */
  showMenu = async () => {
    if (this.props.showMenu) {
      await this.props.showMenu()
    } else return
  }

  /**
   * 把滑动距离转成对应数据
   * @param value
   * @returns {*}
   */
  dealData = value => {
    let layerType = this.props.currentLayer.type

    let newValue

    if (this.props.selectName instanceof Array) {
      // 智能配图 selectName 为数组
      if (
        this.props.selectName[this.props.selectName.length - 1] ===
          getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS ||
        this.props.selectName[this.props.selectName.length - 1] ===
          getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST ||
        this.props.selectName[this.props.selectName.length - 1] ===
          getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION
      ) {
        newValue = value * 200
      }
    } else if (
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_FONT ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET
    ) {
      switch (this.props.selectName) {
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_LINE_WIDTH:
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_BORDER_WIDTH:
          newValue = value * 20
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE:
          newValue = value * 100
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_ROTATION:
        case 'TEXT_ROTATION':
          newValue = value * 360
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_TRANSPARENCY:
          newValue = value * 100
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_FONT_SIZE:
          newValue = value * 20
          if (newValue <= 1) {
            newValue = 1
          } else if (newValue > 20) {
            newValue = 20
          }
          break
      }
    } else if (
      this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN ||
      this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH ||
      this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT ||
      this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_ICON ||
      this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_FONT
    ) {
      newValue = value * 100
    } else if (
      (GLOBAL.Type === constants.MAP_THEME &&
        this.props.currentLayer.themeType > 0) ||
      this.props.currentLayer.isHeatmap
    ) {
      if (
        this.props.selectName === 'range_parameter' ||
        this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.RANGE_COUNT
      ) {
        newValue = value * 30 + 2
        if (newValue <= 2) {
          newValue = 2
        } else if (newValue > 32) {
          newValue = 32
        }
      } else if (
        this.props.selectName === 'fontsize' ||
        this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.STYLE_FONT_SIZE
      ) {
        newValue = value * 20
        if (newValue <= 1) {
          newValue = 1
        } else if (newValue > 20) {
          newValue = 20
        }
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.DOT_VALUE
      ) {
        newValue = value * 100
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
      ) {
        newValue = value * 100
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE
      ) {
        newValue = value * 20
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.THEME_HEATMAP_RADIUS
      ) {
        newValue = value * 50
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu
          .THEME_HEATMAP_FUZZY_DEGREE
      ) {
        newValue = value * 100
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu
          .THEME_HEATMAP_MAXCOLOR_WEIGHT
      ) {
        newValue = value * 100
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.DATUM_VALUE
      ) {
        newValue = value * 10000
      }
    } else if (layerType !== undefined) {
      switch (layerType) {
        case 1:
          if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
          ) {
            newValue = value * 100
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            newValue = value * 100
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION
          ) {
            newValue = value * 360
          }
          break
        case 3:
          newValue = value * 20
          break
        case 5:
          newValue = value * 100
          break
        case 83:
          if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            newValue = value * 100
          } else if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.CONTRAST
          ) {
            newValue = value * 200
          } else if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.STYLE_BRIGHTNESS
          ) {
            newValue = value * 200
          }
          break
      }
    }

    return newValue
  }

  /**
   * 设置数据
   * @param value
   */
  setData = async value => {
    let layerType = this.props.currentLayer.type
    let themeType = this.props.currentLayer.themeType
    let tips = ''

    if (
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_FONT ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET
    ) {
      switch (this.props.selectName) {
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_LINE_WIDTH:
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_BORDER_WIDTH:
          await SMap.setTaggingLineWidth(value)
          if (value <= 1) {
            value = 1
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH +
            '     ' +
            parseInt(value) +
            'mm'
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE:
          await SMap.setTaggingMarkerSize(value)
          if (value < 1) {
            value = 1
          } else if (value > 100) {
            value = 100
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
            '     ' +
            parseInt(value) +
            'mm'
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_ROTATION:
          await SMap.setTaggingAngle(value)
          if (value < 0) {
            value = 0
          } else if (value > 360) {
            value = 360
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
            '     ' +
            parseInt(value) +
            '°'
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_TRANSPARENCY:
          await SMap.setTaggingAlpha(value)
          if (value < 0) {
            value = 0
          } else if (value >= 100) {
            value = 100
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
            '     ' +
            parseInt(value) +
            '%'
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_FONT_SIZE:
          await SMap.setTaggingTextSize(value)
          if (value <= 1) {
            value = 1
          } else if (value > 20) {
            value = 20
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE +
            '     ' +
            parseInt(value)
          break
        case 'TEXT_ROTATION':
          await SMap.setTaggingTextAngle(value)
          if (value < 0) {
            value = 0
          } else if (value > 360) {
            value = 360
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
            '     ' +
            parseInt(value) +
            '°'
          break
      }
    } else if (
      this.props.selectName instanceof Array &&
      (this.props.selectName[this.props.selectName.length - 1] ===
        getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS ||
        this.props.selectName[this.props.selectName.length - 1] ===
          getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST ||
        this.props.selectName[this.props.selectName.length - 1] ===
          getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION)
    ) {
      // 智能配图 selectName 为数组
      if (value < 0) {
        value = 0
      } else if (value > 200) {
        value = 200
      }
      value -= 100
      tips =
        this.props.selectName[this.props.selectName.length - 1] +
        '     ' +
        parseInt(value) +
        '%'
      let mode = TPData.getMatchPictureMode(this.props.selectName)
      if (mode !== undefined) {
        await SMap.updateMapFixColorsMode(mode, value)
      }
    } else if (
      this.props.selectName ===
      getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN
    ) {
      let legendSettings = this.props.mapLegend
      let columns
      if (value <= 25) {
        columns = 1
      } else if (value <= 50) {
        columns = 2
      } else if (value <= 75) {
        columns = 3
      } else {
        columns = 4
      }
      legendSettings[GLOBAL.Type].column = columns
      this._setMapLegend(legendSettings)
      tips =
        getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN +
        '     ' +
        parseInt(columns)
    } else if (
      this.props.selectName ===
      getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH
    ) {
      let legendSettings = this.props.mapLegend
      if (value > 100) {
        value = 100
      } else if (value <= 20) {
        value = 20
      }
      legendSettings[GLOBAL.Type].widthPercent = value
      this._setMapLegend(legendSettings)
      tips =
        getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH +
        '     ' +
        parseInt(value)
    } else if (
      this.props.selectName ===
      getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT
    ) {
      let legendSettings = this.props.mapLegend
      if (value > 100) {
        value = 100
      } else if (value <= 20) {
        value = 20
      }
      legendSettings[GLOBAL.Type].heightPercent = value
      this._setMapLegend(legendSettings)
      tips =
        getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT +
        '     ' +
        parseInt(value)
    } else if (
      this.props.selectName ===
      getLanguage(global.language).Map_Main_Menu.LEGEND_ICON
    ) {
      let legendSettings = this.props.mapLegend
      if (value > 100) {
        value = 100
      } else if (value <= 10) {
        value = 10
      }
      legendSettings[GLOBAL.Type].imagePercent = value
      this._setMapLegend(legendSettings)
      tips =
        getLanguage(global.language).Map_Main_Menu.LEGEND_ICON +
        '     ' +
        parseInt(value)
    } else if (
      this.props.selectName ===
      getLanguage(global.language).Map_Main_Menu.LEGEND_FONT
    ) {
      let legendSettings = this.props.mapLegend
      if (value > 100) {
        value = 100
      } else if (value <= 10) {
        value = 10
      }
      legendSettings[GLOBAL.Type].fontPercent = value
      this._setMapLegend(legendSettings)
      tips =
        getLanguage(global.language).Map_Main_Menu.LEGEND_FONT +
        '     ' +
        parseInt(value)
    } else if (
      (GLOBAL.Type === constants.MAP_THEME &&
        this.props.currentLayer.themeType > 0) ||
      this.props.currentLayer.isHeatmap
    ) {
      if (
        this.props.selectName === 'range_parameter' ||
        this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.RANGE_COUNT
      ) {
        tips =
          getLanguage(global.language).Map_Main_Menu.RANGE_COUNT +
          '     ' +
          parseInt(value)
        let Params = {
          LayerName: this.props.currentLayer.name,
          RangeParameter: parseInt(value),
        }
        Object.assign(Params, ToolbarModule.getData().themeParams)
        switch (themeType) {
          case ThemeType.LABELRANGE:
            await SThemeCartography.modifyThemeLabelRangeMap(Params)
            break
          case ThemeType.RANGE:
            await SThemeCartography.modifyThemeRangeMap(Params)
            break
          case ThemeType.GRIDRANGE:
            await SThemeCartography.modifyThemeGridRangeMap(Params)
            break
        }
      } else if (
        this.props.selectName === 'fontsize' ||
        this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.STYLE_FONT_SIZE
      ) {
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE +
          '     ' +
          parseInt(value)
        let _params = {
          LayerName: this.props.currentLayer.name,
          FontSize: parseInt(value),
        }
        // 分段标签
        if (themeType === ThemeType.LABELRANGE) {
          _params.type = 'range'
        }
        await SThemeCartography.setLabelFontSize(_params)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.DOT_VALUE
      ) {
        tips =
          getLanguage(global.language).Map_Main_Menu.DOT_VALUE +
          '     ' +
          parseInt(value)
        let _params = {
          LayerName: this.props.currentLayer.name,
          Value: value,
        }
        await SThemeCartography.modifyDotDensityThemeMap(_params)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
      ) {
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
          '     ' +
          parseInt(value) +
          'mm'
        let _params = {
          LayerName: this.props.currentLayer.name,
          SymbolSize: value,
        }
        switch (themeType) {
          case ThemeType.DOTDENSITY:
            await SThemeCartography.modifyDotDensityThemeMap(_params)
            break
          case ThemeType.GRADUATEDSYMBOL:
            await SThemeCartography.modifyGraduatedSymbolThemeMap(_params)
            break
        }
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.DATUM_VALUE
      ) {
        if (value < 1) {
          value = 1
        } else if (value > 10000) {
          value = 10000
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.DATUM_VALUE +
          '     ' +
          parseInt(value)
        let _params = {
          LayerName: this.props.currentLayer.name,
          BaseValue: value,
        }
        await SThemeCartography.modifyGraduatedSymbolThemeMap(_params)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE
      ) {
        let newValue = value
        if (newValue < 1) {
          newValue = 1
        } else if (newValue > 20) {
          newValue = 20
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE +
          '     ' +
          parseInt(newValue) +
          'X'
        let _params = {
          LayerName: this.props.currentLayer.name,
          MaxValue: newValue,
        }
        await SThemeCartography.setGraphMaxValue(_params)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.THEME_HEATMAP_RADIUS
      ) {
        if (value > 50) {
          value = 50
        } else if (value < 1) {
          value = 1
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.THEME_HEATMAP_RADIUS +
          '     ' +
          parseInt(value)
        let _params = {
          LayerName: this.props.currentLayer.name,
          Radius: value,
        }
        await SThemeCartography.setHeatMapRadius(_params)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu
          .THEME_HEATMAP_FUZZY_DEGREE
      ) {
        tips =
          getLanguage(global.language).Map_Main_Menu
            .THEME_HEATMAP_FUZZY_DEGREE +
          '     ' +
          parseInt(value) +
          '%'
        let _params = {
          LayerName: this.props.currentLayer.name,
          FuzzyDegree: value,
        }
        await SThemeCartography.setHeatMapFuzzyDegree(_params)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu
          .THEME_HEATMAP_MAXCOLOR_WEIGHT
      ) {
        tips =
          getLanguage(global.language).Map_Main_Menu
            .THEME_HEATMAP_MAXCOLOR_WEIGHT +
          '     ' +
          parseInt(value) +
          '%'
        let _params = {
          LayerName: this.props.currentLayer.name,
          MaxColorWeight: value,
        }
        await SThemeCartography.setHeatMapMaxColorWeight(_params)
      }
    } else {
      switch (layerType) {
        case 1: {
          if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
          ) {
            if (value <= 1) {
              value = 1
            } else if (value >= 100) {
              value = 100
            }
            await SCartography.setMarkerSize(
              value,
              this.props.currentLayer.name,
            )
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
              '     ' +
              parseInt(value) +
              'mm'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            if (value >= 100) {
              value = 100
            }
            await SCartography.setMarkerAlpha(
              value,
              this.props.currentLayer.name,
            )
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(value) +
              '%'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION
          ) {
            if (value >= 360) {
              value = 360
            }
            await SCartography.setMarkerAngle(
              value,
              this.props.currentLayer.name,
            )
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
              '     ' +
              parseInt(value) +
              '°'
          }
          break
        }
        case 3: {
          if (value <= 1) {
            value = 1
          }
          await SCartography.setLineWidth(value, this.props.currentLayer.name)
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH +
            '     ' +
            parseInt(value) +
            'mm'
          break
        }
        case 5: {
          if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH
          ) {
            if (value <= 1) {
              value = 1
            }
            await SCartography.setLineWidth(value, this.props.currentLayer.name)
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH +
              '     ' +
              parseInt(value) +
              'mm'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            await SCartography.setFillOpaqueRate(
              value,
              this.props.currentLayer.name,
            )
            if (value >= 100) {
              value = 100
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(value) +
              '%'
          }

          break
        }
        case 83: {
          if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            await SCartography.setGridOpaqueRate(
              value,
              this.props.currentLayer.name,
            )
            if (value >= 100) {
              value = 100
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(value) +
              '%'
          } else if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.STYLE_BRIGHTNESS
          ) {
            if (value <= 100) {
              let gridBrigh = -(100 - value)
              await SCartography.setGridBrightness(
                gridBrigh,
                this.props.currentLayer.name,
              )
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
                '     ' +
                parseInt(gridBrigh) +
                '%'
            } else if (value > 100) {
              let gridBrigh = value - 100
              if (gridBrigh >= 100) {
                gridBrigh = 100
              }
              await SCartography.setGridBrightness(
                gridBrigh,
                this.props.currentLayer.name,
              )
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
                '     ' +
                parseInt(gridBrigh) +
                '%'
            }
          } else if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.CONTRAST
          ) {
            if (value <= 100) {
              let gridContrast = -(100 - value)
              await SCartography.setGridContrast(
                gridContrast,
                this.props.currentLayer.name,
              )
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
                '     ' +
                parseInt(gridContrast) +
                '%'
            } else if (value > 100) {
              value -= 100
              if (value >= 100) {
                value = 100
              }
              await SCartography.setGridContrast(
                value,
                this.props.currentLayer.name,
              )
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
                '     ' +
                parseInt(value) +
                '%'
            }
          }
          break
        }
      }
    }

    tips !== this.state.tips &&
      this.setState({
        tips,
      })
  }

  /**
   * 设置提示
   * @param value
   */
  setTips = value => {
    let layerType = this.props.currentLayer.type
    let tips = ''
    if (tips === '' && this.props.selectName instanceof Array) {
      // 智能配图 selectName 为数组
      if (
        this.props.selectName[this.props.selectName.length - 1] ===
          getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST ||
        this.props.selectName[this.props.selectName.length - 1] ===
          getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS ||
        this.props.selectName[this.props.selectName.length - 1] ===
          getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS
      ) {
        if (value < 0) {
          value = 0
        } else if (value > 200) {
          value = 200
        }
        value -= 100
        tips = TPData.getMatchPictureTip(this.props.selectName, value)
      }
    } else if (
      (GLOBAL.Type === constants.MAP_THEME &&
        this.props.currentLayer.themeType > 0) ||
      this.props.currentLayer.isHeatmap
    ) {
      if (
        this.props.selectName === 'range_parameter' ||
        this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.RANGE_COUNT
      ) {
        if (value <= 2) {
          value = 2
        } else if (value > 32) {
          value = 32
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.RANGE_COUNT +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName === 'fontsize' ||
        this.props.selectName ===
          getLanguage(this.props.language).Map_Main_Menu.STYLE_FONT_SIZE
      ) {
        if (value <= 1) {
          value = 1
        } else if (value > 20) {
          value = 20
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.DOT_VALUE
      ) {
        if (value < 1) {
          value = 1
        } else if (value > 100) {
          value = 100
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.DOT_VALUE +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
      ) {
        if (value < 1) {
          value = 1
        } else if (value > 100) {
          value = 100
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
          '     ' +
          parseInt(value) +
          'mm'
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.DATUM_VALUE
      ) {
        if (value < 1) {
          value = 1
        } else if (value > 10000) {
          value = 10000
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.DATUM_VALUE +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE
      ) {
        if (value < 1) {
          value = 1
        } else if (value > 20) {
          value = 20
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE +
          '     ' +
          parseInt(value) +
          'X'
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu.THEME_HEATMAP_RADIUS
      ) {
        if (value < 1) {
          value = 1
        } else if (value > 50) {
          value = 50
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.THEME_HEATMAP_RADIUS +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu
          .THEME_HEATMAP_FUZZY_DEGREE
      ) {
        if (value < 1) {
          value = 1
        } else if (value > 100) {
          value = 100
        }
        tips =
          getLanguage(global.language).Map_Main_Menu
            .THEME_HEATMAP_FUZZY_DEGREE +
          '     ' +
          parseInt(value) +
          '%'
      } else if (
        this.props.selectName ===
        getLanguage(this.props.language).Map_Main_Menu
          .THEME_HEATMAP_MAXCOLOR_WEIGHT
      ) {
        if (value < 1) {
          value = 1
        } else if (value > 100) {
          value = 100
        }
        tips =
          getLanguage(global.language).Map_Main_Menu
            .THEME_HEATMAP_MAXCOLOR_WEIGHT +
          '     ' +
          parseInt(value) +
          '%'
      }
    }

    if (tips === '') {
      switch (layerType) {
        case 1: {
          if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE
          ) {
            if (value < 1) {
              value = 1
            } else if (value > 100) {
              value = 100
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
              '     ' +
              parseInt(value) +
              'mm'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            if (value < 0) {
              value = 0
            } else if (value > 100) {
              value = 100
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(value) +
              '%'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION
          ) {
            if (value < 0) {
              value = 0
            } else if (value > 360) {
              value = 360
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
              '     ' +
              parseInt(value) +
              '°'
          }
          break
        }
        case 3: {
          if (value <= 1) {
            value = 1
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH +
            '     ' +
            parseInt(value) +
            'mm'
          break
        }
        case 5: {
          if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH
          ) {
            if (value <= 1) {
              value = 1
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH +
              '     ' +
              parseInt(value) +
              'mm'
          } else if (
            this.props.selectName ===
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            if (value < 0) {
              value = 0
            } else if (value >= 100) {
              value = 100
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(value) +
              '%'
          }
          break
        }
        case 83: {
          if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.STYLE_TRANSPARENCY
          ) {
            if (value < 0) {
              value = 0
            } else if (value >= 100) {
              value = 100
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
              '     ' +
              parseInt(value) +
              '%'
          } else if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.CONTRAST
          ) {
            if (value < 0) {
              value = 0
            } else if (value <= 100) {
              value = -(100 - value)
            } else if (value >= 100) {
              value -= 100
            } else if (value >= 200) {
              value = 100
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
              '     ' +
              parseInt(value) +
              '%'
          } else if (
            this.props.selectName ===
            getLanguage(this.props.language).Map_Main_Menu.STYLE_BRIGHTNESS
          ) {
            if (value < 0) {
              value = 0
            } else if (value <= 100) {
              value = -(100 - value)
            } else if (value >= 100) {
              value -= 100
            } else if (value >= 200) {
              value = 100
            }
            tips =
              getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
              '     ' +
              parseInt(value) +
              '%'
          }
          break
        }
      }
      if (tips === '' && this.props.selectName instanceof Array) {
        if (
          this.props.selectName[this.props.selectName.length - 1] ===
            getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST ||
          this.props.selectName[this.props.selectName.length - 1] ===
            getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS ||
          this.props.selectName[this.props.selectName.length - 1] ===
            getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS
        ) {
          if (value < 0) {
            value = 0
          } else if (value > 200) {
            value = 200
          }
          value -= 100
          tips = TPData.getMatchPictureTip(this.props.selectName, value)
        }
      }
      if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN
      ) {
        let columns = this.props.mapLegend[GLOBAL.Type].columns
        if (value <= 25) {
          columns = 1
        } else if (value <= 50) {
          columns = 2
        } else if (value <= 75) {
          columns = 3
        } else {
          columns = 4
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN +
          '     ' +
          parseInt(columns)
      } else if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH
      ) {
        if (value > 100) {
          value = 100
        } else if (value <= 20) {
          value = 20
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT
      ) {
        if (value > 100) {
          value = 100
        } else if (value <= 20) {
          value = 20
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_ICON
      ) {
        if (value > 100) {
          value = 100
        } else if (value <= 10) {
          value = 10
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_ICON +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName ===
        getLanguage(global.language).Map_Main_Menu.LEGEND_FONT
      ) {
        if (value > 100) {
          value = 100
        } else if (value <= 10) {
          value = 10
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_FONT +
          '     ' +
          parseInt(value)
      }
    }

    if (
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET ||
      GLOBAL.MapToolType ===
        ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_FONT ||
      GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET
    ) {
      switch (this.props.selectName) {
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_LINE_WIDTH:
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_BORDER_WIDTH:
          if (value <= 1) {
            value = 1
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH +
            '     ' +
            parseInt(value) +
            'mm'
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_SYMBOL_SIZE:
          if (value < 1) {
            value = 1
          } else if (value > 100) {
            value = 100
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
            '     ' +
            parseInt(value) +
            'mm'
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_ROTATION:
          if (value < 0) {
            value = 0
          } else if (value > 360) {
            value = 360
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
            '     ' +
            parseInt(value) +
            '°'
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_TRANSPARENCY:
          if (value < 0) {
            value = 0
          } else if (value >= 100) {
            value = 100
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY +
            '     ' +
            parseInt(value) +
            '%'
          break
        case getLanguage(this.props.language).Map_Main_Menu.STYLE_FONT_SIZE:
          if (value <= 1) {
            value = 1
          } else if (value > 20) {
            value = 20
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE +
            '     ' +
            parseInt(value)
          break
        case 'TEXT_ROTATION':
          if (value < 0) {
            value = 0
          } else if (value > 360) {
            value = 360
          }
          tips =
            getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION +
            '     ' +
            parseInt(value) +
            '°'
          break
      }
    }

    tips !== this.state.tips &&
      this.setState({
        tips,
      })
  }

  render() {
    let container = {
      marginTop: this.statusBarHeight,
      backgroundColor: '#rgba(110, 110, 110, 1)',
      flexDirection: 'column',
      height: scaleSize(40),
      justifyContent: 'center',
      alignItems: 'center',
      shadowOffset: { width: 0, height: 0 },
      shadowColor: 'black',
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 20,
      // left: 0,
      // top: 0,
    }
    return (
      <View
        style={[styles.box, { width: '100%' }]}
        {...this._panResponder.panHandlers}
      >
        <View style={[container, { width: '100%' }]}>
          <View
            style={[
              styles.line,
              { width: screen.getScreenWidth() - MARGIN * 2 },
            ]}
          >
            <View
              style={[styles.backline]}
              ref={ref => (this.backLine = ref)}
            />
          </View>
          <View ref={ref => (this.panBtn = ref)} style={[styles.pointer]}>
            <Image
              style={[styles.image]}
              source={require('../../../../assets/function/icon_progress.png')}
            />
          </View>
        </View>
        {this.state.tips !== '' && (
          <View style={styles.tips}>
            <Text style={[styles.tipsText]}>{this.state.tips}</Text>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#rgba(0, 0, 0, 0)',
    flex: 1,
    alignItems: 'center',
  },
  container: {
    // marginTop: Platform.OS === 'ios' ? 20 : 0,
    // backgroundColor: '#rgba(110, 110, 110, 1)',
    marginTop: 20,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    flexDirection: 'column',
    height: scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    // left: 0,
    // top: 0,
  },
  pointer: {
    position: 'absolute',
    // top: 0,
    justifyContent: 'center',
  },
  line: {
    // top: '55%',
    justifyContent: 'center',
    // position: 'absolute',
    height: scaleSize(7),
    // width: '95%',
    backgroundColor: '#rgba(96,122,137,1)',
    // marginHorizontal: scaleSize(30),
  },
  backline: {
    backgroundColor: '#rgba(0,157,249,1)',
    height: '100%',
    width: 0,
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  tips: {
    marginTop: scaleSize(10),
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(20),
    paddingTop: scaleSize(5),
    paddingBottom: scaleSize(5),
    backgroundColor: 'rgba(110,110,110,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsText: {
    fontSize: scaleSize(22),
    // fontFamily 字体
    fontWeight: 'bold',
    color: 'white',
  },
})
