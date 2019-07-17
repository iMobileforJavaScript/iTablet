import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { MTBtn } from '../../../../components'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'

export default class ModalBtns extends Component {
  props: {
    actionOfOnline: () => {},
    cancel: () => {},
    actionOfWechat: () => {},
    actionOfFriend: () => {},
    alwaysShow: Boolean,
    showCancel: Boolean,
    style: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
    this.showCancel =
      this.props.showCancel !== undefined ? this.props.showCancel : true
  }

  setVisible = value => {
    if (value === this.state.show) return
    this.setState({ show: value })
  }

  render() {
    if (this.props.alwaysShow || this.state.show) {
      return (
        <View style={[styles.bottomBtns, { width: '100%' }, this.props.style]}>
          {this.props.actionOfOnline && (
            <MTBtn
              key={'online'}
              title={'Online'}
              style={styles.button}
              image={require('../../../../assets/mapTools/icon_share_online_black.png')}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfOnline && this.props.actionOfOnline()
              }}
            />
          )}
          {this.props.actionOfWechat && (
            <MTBtn
              key={'wechat'}
              title={getLanguage(global.language).Prompt.WECHAT}
              style={styles.button}
              image={require('../../../../assets/Mine/icon_mine_wechat.png')}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfWechat && this.props.actionOfWechat()
              }}
            />
          )}
          {this.props.actionOfFriend && (
            <MTBtn
              key={'friend'}
              title={getLanguage(global.language).Navigator_Label.FRIENDS}
              style={styles.button}
              image={require('../../../../assets/Mine/icon_mine_friend.png')}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfFriend && this.props.actionOfFriend()
              }}
            />
          )}
          {!this.props.actionOfOnline && <View style={styles.button} />}
          {!this.props.actionOfWechat && <View style={styles.button} />}
          {!this.props.actionOfFriend && <View style={styles.button} />}
          {this.showCancel && (
            <MTBtn
              key={'cancel'}
              title={getLanguage(global.language).Prompt.CANCEL}
              style={styles.button}
              image={require('../../../../assets/mapTools/icon_cancel_1.png')}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.setVisible(false)
                this.props.cancel && this.props.cancel()
              }}
            />
          )}
          {!this.showCancel && <View style={styles.button} />}
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
