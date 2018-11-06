import React from 'react'
import { scaleSize } from '../../../../utils'
import { color, zIndexLevel } from '../../../../styles'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

export default class ToolBar extends React.Component {
  props: {
    children: any,
  }

  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
    }
  }

  showLayers = isShow => {
    this.setState({
      isShow: isShow,
    })
  }

  _onPressButton = () => {
    this.setState({
      isShow: false,
    })
  }

  render() {
    if (this.state.isShow) {
      return (
        <View style={styles.containers}>
          {this.props.children}
          <View style={styles.buttonz}>
            <TouchableOpacity
              onPress={this._onPressButton}
              style={styles.button1}
            >
              <Image
                resizeMode={'stretch'}
                source={require('../../../../assets/mapToolbar/icon_map.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._onPressButton}
              style={styles.button2}
            >
              <Image
                resizeMode={'stretch'}
                source={require('../../../../assets/mapToolbar/icon_layer.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  containers: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleSize(600),
    backgroundColor: color.theme,
    zIndex: zIndexLevel.TWO,
  },
  buttonz: {
    flexDirection: 'row',
    height: scaleSize(60),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
  },
  button1: {
    height: scaleSize(60),
  },
  button2: {
    height: scaleSize(60),
  },
})
