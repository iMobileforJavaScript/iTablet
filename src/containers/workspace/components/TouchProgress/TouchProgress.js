import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  PanResponder,
  Image,
  Text,
  Platform,
  StatusBar,
  AsyncStorage,
} from 'react-native'
import { screen, scaleSize } from '../../../../utils'
import {
  SCartography,
  SThemeCartography,
  ThemeType,
} from 'imobile_for_reactnative'
import constants from '../../constants'
import { getLanguage } from '../../../../language/index'
const IMAGE_SIZE = scaleSize(25)
const MARGIN = scaleSize(30)

export default class TouchProgress extends Component {
  props: {
    language: string,
    currentLayer: Object,
    selectName: '',
    value: '',
    showMenu: () => {},
  }

  componentDidUpdate(prevProps) {
    if (this.screenWidth !== screen.getScreenWidth()) {
      this._initialization()
      this.screenWidth = screen.getScreenWidth()
    }
    if (
      JSON.stringify(prevProps.currentLayer) !==
      JSON.stringify(this.props.currentLayer)
    ) {
      this.setState({
        currentLayer: this.props.currentLayer,
      })
    }
    if (
      JSON.stringify(prevProps.selectName) !==
      JSON.stringify(this.props.selectName)
    ) {
      this.setState({
        selectName: this.props.selectName,
      })
    }
  }

  componentDidMount() {
    this._initialization(this.props.value)
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

  _initStatusBarVisible = async () => {
    let result = await AsyncStorage.getItem('StatusBarVisible')
    let invisible = result === 'true'
    let android_statusHeight = invisible ? 0 : StatusBar.currentHeight
    this.statusBarHeight = Platform.OS === 'ios' ? 20 : android_statusHeight //获取状态栏高度
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

    let progressWidth = screen.getScreenWidth() - MARGIN * 2
    let panBtnDevLeft = MARGIN - IMAGE_SIZE / 2 // 图片相对左边偏差

    let tips = ''
    if (GLOBAL.Type === constants.MAP_THEME) {
      // if (this.props.selectName === 'range_parameter') {
      // } else if (this.props.selectName === 'fontsize') {
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
            this._BackLine.style.width = (this.ragngeCount * progressWidth) / 32
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
            this._BackLine.style.width = (this.ragngeCount * progressWidth) / 32
            tips = '分段个数    ' + parseInt(this.ragngeCount)
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
            if (this.props.selectName === '单点代表值') {
              this.dotValue =
                value !== undefined
                  ? value
                  : await SThemeCartography.getDotDensityValue({
                    LayerName: this.props.currentLayer.name,
                  })
              this._panBtnStyles.style.left =
                (this.dotValue * progressWidth) / 100 + panBtnDevLeft
              this._previousLeft = (this.dotValue * progressWidth) / 100
              this._BackLine.style.width = (this.dotValue * progressWidth) / 100
              tips =
                getLanguage(global.language).Map_Main_Menu.DOT_VALUE +
                '     ' +
                parseInt(this.dotValue)
            } else if (this.props.selectName === '符号大小') {
              this.dotSize =
                value !== undefined
                  ? value
                  : await SThemeCartography.getDotDensityDotSize({
                    LayerName: this.props.currentLayer.name,
                  })
              this._panBtnStyles.style.left =
                (this.dotSize * progressWidth) / 100 + panBtnDevLeft
              this._previousLeft = (this.dotSize * progressWidth) / 100
              this._BackLine.style.width = (this.dotSize * progressWidth) / 100
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
            if (this.props.selectName === '基准值') {
              this.baseValue =
                value !== undefined
                  ? value
                  : await SThemeCartography.getGraduatedSymbolValue({
                    LayerName: this.props.currentLayer.name,
                  })
              this._panBtnStyles.style.left =
                (this.baseValue * progressWidth) / 1000 + panBtnDevLeft
              this._previousLeft = (this.baseValue * progressWidth) / 1000
              this._BackLine.style.width =
                (this.baseValue * progressWidth) / 1000
              tips =
                getLanguage(global.language).Map_Main_Menu.DATUM_VALUE +
                '     ' +
                parseInt(this.baseValue)
            } else if (this.props.selectName === '符号大小') {
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
        case ThemeType.LABEL: // 标签专题图
          {
            this.fontsize =
              value !== undefined
                ? value
                : await SThemeCartography.getUniformLabelFontSize({
                  LayerName: this.props.currentLayer.name,
                })
            this._panBtnStyles.style.left =
              (this.fontsize * progressWidth) / 20 + panBtnDevLeft
            this._previousLeft = (this.fontsize * progressWidth) / 20
            this._BackLine.style.width = (this.fontsize * progressWidth) / 20
            tips =
              getLanguage(global.language).Map_Main_Menu.THEME_FONT_SIZE +
              '     ' +
              parseInt(this.fontsize)
          }
          break
        case ThemeType.GRAPH:
          {
            if (this.props.selectName === '最大显示值') {
              this.maxValue =
                value !== undefined
                  ? value
                  : await SThemeCartography.getGraphMaxValue({
                    LayerName: this.props.currentLayer.name,
                  })
              this._panBtnStyles.style.left =
                (this.maxValue * progressWidth) / 20 + panBtnDevLeft
              this._previousLeft = (this.maxValue * progressWidth) / 20
              this._BackLine.style.width = (this.maxValue * progressWidth) / 20
              tips =
                getLanguage(global.language).Map_Main_Menu
                  .THEME_MAX_VISIBLE_SIZE +
                '     ' +
                parseInt(this.maxValue) +
                'X'
            }
          }
          break
      }
    }

    if (tips === '') {
      switch (layerType) {
        case 1: {
          if (this.props.selectName === '大小') {
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
          } else if (this.props.selectName === '透明度') {
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
          } else if (this.props.selectName === '旋转角度') {
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
          break
        }
        case 83: {
          if (this.props.selectName === '透明度') {
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
          } else if (this.props.selectName === '对比度') {
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
              getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
              '     ' +
              parseInt(gridBright) +
              '%'
          } else if (this.props.selectName === '亮度') {
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
              getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
              '     ' +
              parseInt(gridContrast) +
              '%'
          }
          break
        }
      }
      if (this.props.selectName === '列数') {
        let columnnumber = value !== undefined ? value : 2
        this._panBtnStyles.style.left =
          (columnnumber * 10 * progressWidth) / 40 + panBtnDevLeft
        this._previousLeft = (columnnumber * 10 * progressWidth) / 40
        this._BackLine.style.width = (columnnumber * 10 * progressWidth) / 40
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN +
          '     ' +
          parseInt(columnnumber)
      } else if (this.props.selectName === '宽度') {
        let width = value !== undefined ? value : 50
        this._panBtnStyles.style.left =
          (width * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (width * progressWidth) / 100
        this._BackLine.style.width = (width * progressWidth) / 100
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH +
          '     ' +
          parseInt(width)
      } else if (this.props.selectName === '高度') {
        let height = value !== undefined ? value : 50
        this._panBtnStyles.style.left =
          (height * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (height * progressWidth) / 100
        this._BackLine.style.width = (height * progressWidth) / 100
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT +
          '     ' +
          parseInt(height)
      }
    }

    this.setState({
      tips,
    })
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

      let value = this.dealData(x / progressWidth)
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

    let value = this.dealData(x / progressWidth)
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

    if (GLOBAL.Type === constants.MAP_THEME) {
      if (
        this.props.selectName === 'range_parameter' ||
        this.props.selectName === '分段个数'
      ) {
        newValue = value * 32
      } else if (
        this.props.selectName === 'fontsize' ||
        this.props.selectName === '字号'
      ) {
        newValue = value * 20
      } else if (this.props.selectName === '单点代表值') {
        newValue = value * 100
      } else if (this.props.selectName === '符号大小') {
        newValue = value * 100
      } else if (this.props.selectName === '基准值') {
        newValue = value * 1000
      } else if (this.props.selectName === '最大显示值') {
        newValue = value * 20
      }
    }

    if (newValue === undefined) {
      switch (layerType) {
        case 1:
          if (this.props.selectName === '大小') {
            newValue = value * 100
          } else if (this.props.selectName === '透明度') {
            newValue = value * 100
          } else if (this.props.selectName === '旋转角度') {
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
          if (this.props.selectName === '透明度') {
            newValue = value * 100
          } else if (this.props.selectName === '对比度') {
            newValue = value * 200
          } else if (this.props.selectName === '亮度') {
            newValue = value * 200
          }
          break
      }
    }

    if (newValue === undefined) {
      if (this.props.selectName === '列数') {
        newValue = value * 40
      } else if (this.props.selectName === '宽度') {
        newValue = value * 100
      } else if (this.props.selectName === '高度') {
        newValue = value * 100
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
    if (GLOBAL.Type === constants.MAP_THEME) {
      if (
        this.props.selectName === 'range_parameter' ||
        this.props.selectName === '分段个数'
      ) {
        tips =
          getLanguage(global.language).Map_Main_Menu.RANGE_COUNT +
          '     ' +
          parseInt(value)
        let Params = {
          LayerName: this.props.currentLayer.name,
          RangeParameter: value,
        }
        switch (themeType) {
          case ThemeType.RANGE:
            await SThemeCartography.modifyThemeRangeMap(Params)
            break
          case ThemeType.GRIDRANGE:
            await SThemeCartography.modifyThemeGridRangeMap(Params)
            break
        }
      } else if (
        this.props.selectName === 'fontsize' ||
        this.props.selectName === '字号'
      ) {
        tips =
          getLanguage(global.language).Map_Main_Menu.THEME_FONT_SIZE +
          '     ' +
          parseInt(value)
        let _params = {
          LayerName: this.props.currentLayer.name,
          FontSize: value,
        }
        await SThemeCartography.setUniformLabelFontSize(_params)
      } else if (this.props.selectName === '单点代表值') {
        tips =
          getLanguage(global.language).Map_Main_Menu.DOT_VALUE +
          '     ' +
          parseInt(value)
        let _params = {
          LayerName: this.props.currentLayer.name,
          Value: value,
        }
        await SThemeCartography.modifyDotDensityThemeMap(_params)
      } else if (this.props.selectName === '符号大小') {
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
      } else if (this.props.selectName === '基准值') {
        tips =
          getLanguage(global.language).Map_Main_Menu.DATUM_VALUE +
          '     ' +
          parseInt(value)
        let _params = {
          LayerName: this.props.currentLayer.name,
          BaseValue: value,
        }
        await SThemeCartography.modifyGraduatedSymbolThemeMap(_params)
      } else if (this.props.selectName === '最大显示值') {
        tips =
          getLanguage(global.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE +
          '     ' +
          parseInt(value) +
          'X'
        let _params = {
          LayerName: this.props.currentLayer.name,
          MaxValue: value,
        }
        await SThemeCartography.setGraphMaxValue(_params)
      }
    }

    if (tips === '') {
      switch (layerType) {
        case 1: {
          if (this.props.selectName === '大小') {
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
          } else if (this.props.selectName === '透明度') {
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
          } else if (this.props.selectName === '旋转角度') {
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
          break
        }
        case 83: {
          if (this.props.selectName === '透明度') {
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
          } else if (this.props.selectName === '对比度') {
            if (value <= 100) {
              let gridBrigh = -(100 - value)
              await SCartography.setGridBrightness(
                gridBrigh,
                this.props.currentLayer.name,
              )
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
                '     ' +
                parseInt(gridBrigh) +
                '%'
            } else if (value > 100) {
              let gridBrigh = value - 100
              await SCartography.setGridBrightness(
                gridBrigh,
                this.props.currentLayer.name,
              )
              if (gridBrigh >= 100) {
                gridBrigh = 100
              }
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
                '     ' +
                parseInt(gridBrigh) +
                '%'
            }
          } else if (this.props.selectName === '亮度') {
            if (value <= 100) {
              let gridContrast = -(100 - value)
              await SCartography.setGridContrast(
                gridContrast,
                this.props.currentLayer.name,
              )
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
                '     ' +
                parseInt(gridContrast) +
                '%'
            } else if (value > 100) {
              if (value >= 100) {
                value = 100
              }
              await SCartography.setGridContrast(
                value,
                this.props.currentLayer.name,
              )
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
                '     ' +
                parseInt(value) +
                '%'
            }
          }
          break
        }
      }
      if (this.props.selectName === '列数') {
        if (value > 40) {
          value = 40
        }
        let newvalue = Math.ceil(value / 10)
        GLOBAL.legend.setState({ columns: newvalue })
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN +
          '     ' +
          parseInt(newvalue)
      } else if (this.props.selectName === '宽度') {
        if (value > 100) {
          value = 100
        } else if (value <= 10) {
          value = 10
        }
        GLOBAL.legend.setState({ width: value })
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH +
          '     ' +
          parseInt(value)
      } else if (this.props.selectName === '高度') {
        if (value > 100) {
          value = 100
        } else if (value <= 10) {
          value = 10
        }
        GLOBAL.legend.setState({ height: value })
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT +
          '     ' +
          parseInt(value)
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
    if (GLOBAL.Type === constants.MAP_THEME) {
      if (
        this.props.selectName === 'range_parameter' ||
        this.props.selectName === '分段个数'
      ) {
        if (value <= 0) {
          value = 1
        } else if (value > 100) {
          value = 100
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.RANGE_COUNT +
          '     ' +
          parseInt(value)
      } else if (
        this.props.selectName === 'fontsize' ||
        this.props.selectName === '字号'
      ) {
        if (value <= 0) {
          value = 1
        } else if (value > 20) {
          value = 20
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.THEME_FONT_SIZE +
          '     ' +
          parseInt(value)
      } else if (this.props.selectName === '单点代表值') {
        if (value <= 0) {
          value = 1
        } else if (value > 100) {
          value = 100
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.DOT_VALUE +
          '     ' +
          parseInt(value)
      } else if (this.props.selectName === '符号大小') {
        if (value <= 0) {
          value = 1
        } else if (value > 100) {
          value = 100
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE +
          '     ' +
          parseInt(value) +
          'mm'
      } else if (this.props.selectName === '基准值') {
        if (value <= 0) {
          value = 1
        } else if (value > 1000) {
          value = 1000
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.DATUM_VALUE +
          '     ' +
          parseInt(value)
      } else if (this.props.selectName === '最大显示值') {
        if (value <= 0) {
          value = 1
        } else if (value > 20) {
          value = 20
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE +
          '     ' +
          parseInt(value) +
          'X'
      }
    }

    if (tips === '') {
      switch (layerType) {
        case 1: {
          if (this.props.selectName === '大小') {
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
          } else if (this.props.selectName === '透明度') {
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
          } else if (this.props.selectName === '旋转角度') {
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
        }
        case 83: {
          if (this.props.selectName === '透明度') {
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
          } else if (this.props.selectName === '对比度') {
            if (value < 0) {
              value = 0
            } else if (value <= 100) {
              let gridBrigh = -(100 - value)
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
                '     ' +
                parseInt(gridBrigh) +
                '%'
            } else if (value > 100) {
              let gridBrigh = value - 100
              if (gridBrigh >= 100) {
                gridBrigh = 100
              }
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
                '     ' +
                parseInt(gridBrigh) +
                '%'
            }
          } else if (this.props.selectName === '亮度') {
            if (value < 0) {
              value = 0
            } else if (value <= 100) {
              let gridContrast = -(100 - value)
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
                '     ' +
                parseInt(gridContrast) +
                '%'
            } else if (value > 100) {
              if (value >= 100) {
                value = 100
              }
              tips =
                getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
                '     ' +
                parseInt(value) +
                '%'
            }
          }
          break
        }
      }
      if (this.props.selectName === '列数') {
        if (value > 40) {
          value = 40
        }
        let newvalue = Math.ceil(value / 10)
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN +
          '     ' +
          parseInt(newvalue)
      } else if (this.props.selectName === '宽度') {
        if (value > 100) {
          value = 100
        } else if (value <= 10) {
          value = 10
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH +
          '     ' +
          parseInt(value)
      } else if (this.props.selectName === '高度') {
        if (value > 100) {
          value = 100
        } else if (value <= 10) {
          value = 10
        }
        tips =
          getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT +
          '     ' +
          parseInt(value)
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
