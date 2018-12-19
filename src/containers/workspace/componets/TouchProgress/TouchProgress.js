import React, { Component } from 'react'
import { StyleSheet, View, PanResponder, Image } from 'react-native'
import { screen, scaleSize } from '../../../../utils'
import { SCartography, SThemeCartography } from 'imobile_for_reactnative'
import constants from '../../constants'

const positionWidth = screen.deviceWidth //设备的宽度

export default class TouchProgress extends Component {
  render() {
    return (
      <View style={styles.box} {...this._panResponder.panHandlers}>
        <View style={styles.container}>
          <View style={styles.line} />
          <View ref={ref => (this.panBtn = ref)} style={[styles.pointer]}>
            <Image
              style={[styles.image]}
              source={require('../../../../assets/function/icon_progress.png')}
            />
          </View>
        </View>
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

  constructor(props) {
    super(props)
    this._previousLeft = 0
    this._panBtnStyles = {
      style: {
        left: this._previousLeft,
      },
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
    this._updateNativeStyles()
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
    if (GLOBAL.Type === constants.MAP_THEME) {
      let _params = {
        LayerName: this.props.currentLayer.name,
        FontSize: pointSize / 5,
      }
      SThemeCartography.setUniformLabelFontSize(_params)
    }
    switch (layerType) {
      case 1:
        if (this.props.selectName === '大小') {
          if (pointSize <= 1) {
            pointSize = 1
          }
          SCartography.setMarkerSize(pointSize, this.props.currentLayer.name)
        } else if (this.props.selectName === '透明度') {
          SCartography.setMarkerAlpha(pointAlpha, this.props.currentLayer.name)
        } else if (this.props.selectName === '旋转角度') {
          SCartography.setMarkerAngle(pointAngle, this.props.currentLayer.name)
        }
        break
      case 3:
        if (lineWidth <= 1) {
          lineWidth = 1
        }
        SCartography.setLineWidth(lineWidth, this.props.currentLayer.name)
        break
      case 5:
        SCartography.setFillOpaqueRate(
          fillOpaqueRate,
          this.props.currentLayer.name,
        )
        break
      case 83:
        if (this.props.selectName === '透明度') {
          SCartography.setGridOpaqueRate(
            fillOpaqueRate,
            this.props.currentLayer.name,
          )
        } else if (this.props.selectName === '对比度') {
          if (gridStyle <= 100) {
            let gridBrigh = -(100 - gridStyle)
            SCartography.setGridBrightness(
              gridBrigh,
              this.props.currentLayer.name,
            )
          } else if (gridStyle > 100) {
            let gridBrigh = gridStyle - 100
            SCartography.setGridBrightness(
              gridBrigh,
              this.props.currentLayer.name,
            )
          }
        } else if (this.props.selectName === '亮度') {
          if (gridStyle <= 100) {
            let gridContrast = -(100 - gridStyle)
            SCartography.setGridContrast(
              gridContrast,
              this.props.currentLayer.name,
            )
          } else if (gridStyle > 100) {
            let gridContrast = gridStyle - 100
            SCartography.setGridContrast(
              gridContrast,
              this.props.currentLayer.name,
            )
          }
        }
        break
    }
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#rgba(0, 0, 0, 0)',
    flex: 1,
  },
  container: {
    backgroundColor: '#rgba(0, 0, 0, 0)',
    flexDirection: 'column',
    height: scaleSize(40),
    justifyContent: 'center',
    width: '100%',
    left: 0,
    top: 0,
  },
  pointer: {
    position: 'absolute',
    top: 0,
  },
  line: {
    top: '55%',
    position: 'absolute',
    height: scaleSize(10),
    width: '95%',
    backgroundColor: 'black',
    marginLeft: scaleSize(20),
  },
  image: {
    height: scaleSize(50),
    width: scaleSize(50),
  },
})
