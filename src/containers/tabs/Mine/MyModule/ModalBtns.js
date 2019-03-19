import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { MTBtn } from '../../../../components'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
export default class ModalBtns extends Component {
  props: {
    actionOfOnline: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  setVisible = value => {
    if (value === this.state.show) return
    this.setState({ show: value })
  }

  render() {
    if (this.state.show) {
      return (
        <View style={[styles.bottomBtns, { width: '100%' }]}>
          <MTBtn
            key={'online'}
            title={'Online'}
            style={styles.button}
            image={require('../../../../assets/mapToolbar/list_type_map_black.png')}
            imageStyle={styles.headerBtn}
            onPress={() => {
              this.props.actionOfOnline && this.props.actionOfOnline()
            }}
          />
          <MTBtn
            key={'wechat'}
            title={'微信'}
            style={styles.button}
            image={require('../../../../assets/mapToolbar/list_type_map_black.png')}
            imageStyle={styles.headerBtn}
            onPress={() => {}}
          />
          <View style={styles.button} />
          <MTBtn
            key={'cancel'}
            title={'取消'}
            style={styles.button}
            image={require('../../../../assets/mapToolbar/list_type_map_black.png')}
            imageStyle={styles.headerBtn}
            onPress={() => {
              this.setVisible(false)
            }}
          />
        </View>
      )
    } else {
      return <View />
    }
  }
}
const styles = StyleSheet.create({
  bottomBtns: {
    borderTopWidth: 1,
    borderColor: color.contentColorGray,
    flexDirection: 'row',
    height: scaleSize(100),
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
    // backgroundColor:"red",
    position: 'absolute',
    bottom: 0,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
})
