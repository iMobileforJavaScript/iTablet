import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  PanResponder,
  Image,
  Text,
  Platform,
} from 'react-native'
import { screen, scaleSize } from '../../../../utils'
import {
  SCartography,
  SThemeCartography,
  ThemeType,
} from 'imobile_for_reactnative'
import constants from '../../constants'

const IMAGE_SIZE = scaleSize(25)
const MARGIN = scaleSize(30)

export default class TouchProgress extends Component {
  render() {
    return (
      <View
        style={[styles.box, { width: '100%' }]}
        {...this._panResponder.panHandlers}
      >
        <View style={[styles.container, { width: '100%' }]}>
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

  props: {
    currentLayer: Object,
    selectName: '',
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
    this._initialization()
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
  }

  _updateNativeStyles = () => {
    this.panBtn && this.panBtn.setNativeProps(this._panBtnStyles)
  }

  _updateBackLine = () => {
    this.backLine && this.backLine.setNativeProps(this._BackLine)
  }

  _initialization = async () => {
    let layerType = this.props.currentLayer.type
    let themeType = this.props.currentLayer.themeType
    let pointSize = await SCartography.getMarkerSize(
      this.props.currentLayer.name,
    )
    let pointAlpha = await SCartography.getMarkerAlpha(
      this.props.currentLayer.name,
    )
    let pointAngle = await SCartography.getMarkerAngle(
      this.props.currentLayer.name,
    )
    let lineWidth = await SCartography.getLineWidth(
      this.props.currentLayer.name,
    )
    let fillOpaque = await SCartography.getFillOpaqueRate(
      this.props.currentLayer.name,
    )
    let gridOpaque = await SCartography.getGridOpaqueRate(
      this.props.currentLayer.name,
    )
    let gridBright =
      (await SCartography.getGridBrightness(this.props.currentLayer.name)) + 100
    let gridContrast =
      (await SCartography.getGridContrast(this.props.currentLayer.name)) + 100

    let progressWidth = screen.getScreenWidth() - MARGIN * 2
    let panBtnDevLeft = MARGIN - IMAGE_SIZE / 2 // 图片相对左边偏差

    switch (layerType) {
      case 1:
        if (this.props.selectName === '大小') {
          this._panBtnStyles.style.left =
            (pointSize * progressWidth) / 100 + panBtnDevLeft
          this._previousLeft = (pointSize * progressWidth) / 100
          this._BackLine.style.width = (pointSize * progressWidth) / 100
        } else if (this.props.selectName === '透明度') {
          this._panBtnStyles.style.left =
            (pointAlpha * progressWidth) / 100 + panBtnDevLeft
          this._previousLeft = (pointAlpha * progressWidth) / 100
          this._BackLine.style.width = (pointAlpha * progressWidth) / 100
        } else if (this.props.selectName === '旋转角度') {
          this._panBtnStyles.style.left =
            (pointAngle * progressWidth) / 360 + panBtnDevLeft
          this._previousLeft = (pointAngle * progressWidth) / 360
          this._BackLine.style.width = (pointAngle * progressWidth) / 360
        }
        break
      case 3:
        this._panBtnStyles.style.left =
          (lineWidth * progressWidth) / 20 + panBtnDevLeft
        this._previousLeft = (lineWidth * progressWidth) / 20
        this._BackLine.style.width = (lineWidth * progressWidth) / 20
        break
      case 5:
        this._panBtnStyles.style.left =
          (fillOpaque * progressWidth) / 100 + panBtnDevLeft
        this._previousLeft = (fillOpaque * progressWidth) / 100
        this._BackLine.style.width = (fillOpaque * progressWidth) / 100
        break
      case 83:
        if (this.props.selectName === '透明度') {
          this._panBtnStyles.style.left =
            (gridOpaque * progressWidth) / 100 + panBtnDevLeft
          this._previousLeft = (gridOpaque * progressWidth) / 100
          this._BackLine.style.width = (gridOpaque * progressWidth) / 100
        } else if (this.props.selectName === '对比度') {
          this._panBtnStyles.style.left =
            (gridBright * progressWidth) / 200 + panBtnDevLeft
          this._previousLeft = (gridBright * progressWidth) / 200
          this._BackLine.style.width = (gridBright * progressWidth) / 200
        } else if (this.props.selectName === '亮度') {
          this._panBtnStyles.style.left =
            (gridContrast * progressWidth) / 200 + panBtnDevLeft
          this._previousLeft = (gridContrast * progressWidth) / 200
          this._BackLine.style.width = (gridContrast * progressWidth) / 200
        }
        break
    }
    if (GLOBAL.Type === constants.MAP_THEME) {
      // if (this.props.selectName === 'range_parameter') {
      // } else if (this.props.selectName === 'fontsize') {
      switch (themeType) {
        case ThemeType.UNIQUE: // 单值专题图
          break
        case ThemeType.RANGE: // 分段专题图
          {
            let ragngeCount = await SThemeCartography.getRangeCount({
              LayerName: this.props.currentLayer.name,
            })
            this._panBtnStyles.style.left =
              (ragngeCount * progressWidth) / 32 + panBtnDevLeft
            this._previousLeft = (ragngeCount * progressWidth) / 32
            this._BackLine.style.width = (ragngeCount * progressWidth) / 32
            this.setState({
              tips: '分段个数    ' + parseInt(ragngeCount),
            })
          }
          break
        case ThemeType.LABEL: // 标签专题图
          {
            let fontsize = await SThemeCartography.getUniformLabelFontSize({
              LayerName: this.props.currentLayer.name,
            })
            this._panBtnStyles.style.left =
              (fontsize * progressWidth) / 20 + panBtnDevLeft
            this._previousLeft = (fontsize * progressWidth) / 20
            this._BackLine.style.width = (fontsize * progressWidth) / 20
            this.setState({
              tips: '字号    ' + parseInt(fontsize),
            })
          }
          break
      }
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
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    let progressWidth = screen.getScreenWidth() - MARGIN * 2
    let x = this._previousLeft + gestureState.dx
    if (x <= 0) x = 0
    if (x >= progressWidth + MARGIN - IMAGE_SIZE / 2)
      x = progressWidth + MARGIN - IMAGE_SIZE / 2
    this._previousLeft = x

    let layerType = this.props.currentLayer.type
    let lineWidth = (x / progressWidth) * 20
    let pointSize = (x / progressWidth) * 100
    let pointAlpha = (x / progressWidth) * 100
    let pointAngle = (x / progressWidth) * 360
    let fillOpaqueRate = (x / progressWidth) * 100
    let gridStyle = (x / progressWidth) * 200
    let range_parameter = (x / progressWidth) * 32
    let fontsize = (x / progressWidth) * 20
    switch (layerType) {
      case 1:
        if (this.props.selectName === '大小') {
          if (pointSize <= 1) {
            pointSize = 1
          }
          SCartography.setMarkerSize(pointSize, this.props.currentLayer.name)
          if (pointSize >= 100) {
            pointSize = 100
          }
          this.setState({
            tips: '大小    ' + parseInt(pointSize) + 'mm',
          })
        } else if (this.props.selectName === '透明度') {
          if (pointAlpha >= 100) {
            pointAlpha = 100
          }
          SCartography.setMarkerAlpha(pointAlpha, this.props.currentLayer.name)
          this.setState({
            tips: '透明度    ' + parseInt(pointAlpha) + '%',
          })
        } else if (this.props.selectName === '旋转角度') {
          if (pointAngle >= 360) {
            pointAngle = 360
          }
          SCartography.setMarkerAngle(pointAngle, this.props.currentLayer.name)
          this.setState({
            tips: '旋转角度    ' + parseInt(pointAngle) + '°',
          })
        }
        break
      case 3:
        if (lineWidth <= 1) {
          lineWidth = 1
        }
        SCartography.setLineWidth(lineWidth, this.props.currentLayer.name)
        this.setState({
          tips: '线宽    ' + parseInt(lineWidth) + 'mm',
        })
        break
      case 5:
        SCartography.setFillOpaqueRate(
          fillOpaqueRate,
          this.props.currentLayer.name,
        )
        if (fillOpaqueRate >= 100) {
          fillOpaqueRate = 100
        }
        this.setState({
          tips: '透明度    ' + parseInt(fillOpaqueRate) + '%',
        })
        break
      case 83:
        if (this.props.selectName === '透明度') {
          SCartography.setGridOpaqueRate(
            fillOpaqueRate,
            this.props.currentLayer.name,
          )
          if (fillOpaqueRate >= 100) {
            fillOpaqueRate = 100
          }
          this.setState({
            tips: '透明度    ' + parseInt(fillOpaqueRate) + '%',
          })
        } else if (this.props.selectName === '对比度') {
          if (gridStyle <= 100) {
            let gridBrigh = -(100 - gridStyle)
            SCartography.setGridBrightness(
              gridBrigh,
              this.props.currentLayer.name,
            )
            this.setState({
              tips: '对比度    ' + parseInt(gridBrigh) + '%',
            })
          } else if (gridStyle > 100) {
            let gridBrigh = gridStyle - 100
            SCartography.setGridBrightness(
              gridBrigh,
              this.props.currentLayer.name,
            )
            if (gridBrigh >= 100) {
              gridBrigh = 100
            }
            this.setState({
              tips: '对比度    ' + parseInt(gridBrigh) + '%',
            })
          }
        } else if (this.props.selectName === '亮度') {
          if (gridStyle <= 100) {
            let gridContrast = -(100 - gridStyle)
            SCartography.setGridContrast(
              gridContrast,
              this.props.currentLayer.name,
            )
            this.setState({
              tips: '亮度    ' + parseInt(gridContrast) + '%',
            })
          } else if (gridStyle > 100) {
            let gridContrast = gridStyle - 100
            SCartography.setGridContrast(
              gridContrast,
              this.props.currentLayer.name,
            )
            if (gridContrast >= 100) {
              gridContrast = 100
            }
            this.setState({
              tips: '亮度    ' + parseInt(gridContrast) + '%',
            })
          }
        }
        break
    }
    if (GLOBAL.Type === constants.MAP_THEME) {
      if (this.props.selectName === 'range_parameter') {
        this.setState({
          tips: '分段个数    ' + parseInt(range_parameter),
        })
        let Params = {
          LayerName: this.props.currentLayer.name,
          RangeParameter: range_parameter,
        }
        SThemeCartography.modifyThemeRangeMap(Params)
      } else if (this.props.selectName === 'fontsize') {
        this.setState({
          tips: '字号    ' + parseInt(fontsize),
        })
        let _params = {
          LayerName: this.props.currentLayer.name,
          FontSize: fontsize,
        }
        SThemeCartography.setUniformLabelFontSize(_params)
      }
    }
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#rgba(0, 0, 0, 0)',
    flex: 1,
    alignItems: 'center',
  },
  container: {
    marginTop: Platform.OS === 'ios' ? scaleSize(20) : 0,
    backgroundColor: '#rgba(110, 110, 110,1)',
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
