import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet, Modal, Text, Platform } from 'react-native'
import { scaleSize } from '../../utils'
export const NORMAL = 'NORMAL'

const INFO = '加载中'

export default class Loading extends Component {

  props: {
    initLoading: boolean,
    type: string,
    initLoading: boolean,
    indicatorSize: string,
    indicatorColor: string,
    bgColor: string,
    indicatorStyle: any,
    displayMode: string,
    info: string,
  }

  static defaultProps = {
    initLoading: true,
    bgColor: 'transparent',
    indicatorSize: Platform.OS === 'ios' ? 'small' : 'large',
    indicatorColor: 'white',
    displayMode: 'NORMAL',
    indicatorMode: 'BLACK_WITH_TITLE',  // BLACK_WITH_TITLE   NORMAL
    info: INFO,
  }

  constructor(props) {
    super(props)
    this.state = {
      animating: props.initLoading,
      info: props.info,
      extra: {
        bgColor: props.bgColor,
      },
    }
  }

  setLoading = (loading, info, extra = {}) => {
    if (loading !== this.state.animating || this.state.info !== info || JSON.stringify(this.state.extra) !== JSON.stringify(extra)) {
      if (!extra.bgColor) {
        extra.bgColor = 'transparent'
      }
      this.setState({
        animating: loading,
        info: info || INFO,
        extra,
      })
    }
  }

  renderModalIndicator = () => {
    return (
      <Modal
        visible={this.state.animating}
        transparent={true}
        onRequestClose={() => {}}
      >
        {this.renderIndicator()}
      </Modal>
    )
  }

  renderIndicator = () => {
    let indicatorStyle = styles.indicatorBlack
    return (
      <View style={indicatorStyle}>
        <ActivityIndicator
          animating={this.state.animating}
          size={this.props.indicatorSize}
          color={this.props.indicatorColor}
        />
        {this.props.info && <Text style={styles.title}>{this.state.info}</Text>}
      </View>
    )
  }

  render() {
    if (!this.state.animating) return null

    return (
      <View style={[styles.container, this.state.extra.bgColor && {backgroundColor: this.state.extra.bgColor}]}>
        {
          this.props.displayMode === 'NORMAL'
            ? this.renderIndicator()
            : this.renderModalIndicator()
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 100001,
  },
  indicatorBlack: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    width: scaleSize(140),
    height: scaleSize(140),
    borderRadius: scaleSize(8),
  },
  title: {
    height: scaleSize(30),
    fontSize: scaleSize(20),
    color: 'white',
    textAlign: 'center',
  },
})

Loading.IndicatorColor = {
  BLACK: '#888888',
  WHITE: 'white',
}

Loading.IndicatorSize = {
  LARGE: 'large',
  SMALL: 'small',
}

Loading.DisplayMode = {
  NORMAL: 'NORMAL',
  MODAL: 'MODAL',
}

Loading.IndicatorMode = {
  NORMAL: 'NORMAL',
  BLACK_WITH_TITLE: 'BLACK_WITH_TITLE',
}