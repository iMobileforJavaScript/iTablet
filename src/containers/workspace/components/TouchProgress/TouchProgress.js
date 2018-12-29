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

const positionWidth = screen.deviceWidth //设备的宽度

export default class TouchProgress extends Component {
  render() {
    return (
      <View style={styles.box} {...this._panResponder.panHandlers}>
        <View style={styles.container}>
          <View style={styles.line}>
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
          <Text style={[styles.tips]}>{this.state.tips}</Text>
        )}
      </View>
    )
  }

  props: {
    currentLayer: Object,
    selectName: '',
  }

  componentDidUpdate(prevProps) {
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
    this._previousLeft = 0
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
    switch (layerType) {
      case 1:
        if (this.props.selectName === '大小') {
          this._panBtnStyles.style.left =
            (pointSize * (positionWidth - scaleSize(60))) / 100
          this._previousLeft =
            (pointSize * (positionWidth - scaleSize(60))) / 100
          this._BackLine.style.width =
            (pointSize * (positionWidth - scaleSize(60))) / 100
        } else if (this.props.selectName === '透明度') {
          this._panBtnStyles.style.left =
            (pointAlpha * (positionWidth - scaleSize(60))) / 100
          this._previousLeft =
            (pointAlpha * (positionWidth - scaleSize(60))) / 100
          this._BackLine.style.width =
            (pointAlpha * (positionWidth - scaleSize(60))) / 100
        } else if (this.props.selectName === '旋转角度') {
          this._panBtnStyles.style.left =
            (pointAngle * (positionWidth - scaleSize(60))) / 360
          this._previousLeft =
            (pointAngle * (positionWidth - scaleSize(60))) / 360
          this._BackLine.style.width =
            (pointAngle * (positionWidth - scaleSize(60))) / 360
        }
        break
      case 3:
        this._panBtnStyles.style.left =
          (lineWidth * (positionWidth - scaleSize(60))) / 20
        this._previousLeft = (lineWidth * (positionWidth - scaleSize(60))) / 20
        this._BackLine.style.width =
          (lineWidth * (positionWidth - scaleSize(60))) / 20
        break
      case 5:
        this._panBtnStyles.style.left =
          (fillOpaque * (positionWidth - scaleSize(60))) / 100
        this._previousLeft =
          (fillOpaque * (positionWidth - scaleSize(60))) / 100
        this._BackLine.style.width =
          (fillOpaque * (positionWidth - scaleSize(60))) / 100
        break
      case 83:
        if (this.props.selectName === '透明度') {
          this._panBtnStyles.style.left =
            (gridOpaque * (positionWidth - scaleSize(60))) / 100
          this._previousLeft =
            (gridOpaque * (positionWidth - scaleSize(60))) / 100
          this._BackLine.style.width =
            (gridOpaque * (positionWidth - scaleSize(60))) / 100
        } else if (this.props.selectName === '对比度') {
          this._panBtnStyles.style.left =
            (gridBright * (positionWidth - scaleSize(60))) / 200
          this._previousLeft =
            (gridBright * (positionWidth - scaleSize(60))) / 200
          this._BackLine.style.width =
            (gridBright * (positionWidth - scaleSize(60))) / 200
        } else if (this.props.selectName === '亮度') {
          this._panBtnStyles.style.left =
            (gridContrast * (positionWidth - scaleSize(60))) / 200
          this._previousLeft =
            (gridContrast * (positionWidth - scaleSize(60))) / 200
          this._BackLine.style.width =
            (gridContrast * (positionWidth - scaleSize(60))) / 200
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
              (ragngeCount * (positionWidth - scaleSize(60))) / 32
            this._previousLeft =
              (ragngeCount * (positionWidth - scaleSize(60))) / 32
            this._BackLine.style.width =
              (ragngeCount * (positionWidth - scaleSize(60))) / 32
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
              (fontsize * (positionWidth - scaleSize(60))) / 20
            this._previousLeft =
              (fontsize * (positionWidth - scaleSize(60))) / 20
            this._BackLine.style.width =
              (fontsize * (positionWidth - scaleSize(60))) / 20
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
    let x = this._previousLeft + gestureState.dx
    this._panBtnStyles.style.left = x
    if (this._panBtnStyles.style.left <= 0) this._panBtnStyles.style.left = 0
    if (this._panBtnStyles.style.left >= positionWidth - scaleSize(45))
      this._panBtnStyles.style.left = positionWidth - scaleSize(45)

    this._BackLine.style.width = x
    if (this._BackLine.style.width <= 0) this._BackLine.style.width = 0
    if (this._BackLine.style.width >= positionWidth - scaleSize(45))
      this._BackLine.style.width = positionWidth - scaleSize(45)
    this._updateNativeStyles()
    this._updateBackLine()
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    let x = this._previousLeft + gestureState.dx
    if (x <= 0) x = 0
    if (x >= positionWidth - scaleSize(45)) x = positionWidth - scaleSize(45)
    this._previousLeft = x

    let layerType = this.props.currentLayer.type
    let lineWidth = (x / (positionWidth - scaleSize(60))) * 20
    let pointSize = (x / (positionWidth - scaleSize(60))) * 100
    let pointAlpha = (x / (positionWidth - scaleSize(60))) * 100
    let pointAngle = (x / (positionWidth - scaleSize(60))) * 360
    let fillOpaqueRate = (x / (positionWidth - scaleSize(60))) * 100
    let gridStyle = (x / (positionWidth - scaleSize(60))) * 200
    let range_parameter = (x / (positionWidth - scaleSize(60))) * 32
    let fontsize = (x / (positionWidth - scaleSize(60))) * 20
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
    width: '100%',
    left: 0,
    top: 0,
  },
  pointer: {
    position: 'absolute',
    // top: 0,
    justifyContent: 'center',
  },
  line: {
    // top: '55%',
    justifyContent: 'center',
    position: 'absolute',
    height: scaleSize(7),
    width: '95%',
    backgroundColor: '#rgba(96,122,137,1)',
    marginLeft: scaleSize(20),
  },
  backline: {
    backgroundColor: '#rgba(0,157,249,1)',
    height: '100%',
    width: 0,
  },
  image: {
    height: scaleSize(50),
    width: scaleSize(50),
  },
  tips: {
    marginTop: scaleSize(10),
    fontSize: scaleSize(22),
    // fontFamily 字体
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(20),
    paddingTop: scaleSize(5),
    paddingBottom: scaleSize(5),
    backgroundColor: 'rgba(110,110,110,0.85)',
  },
})
