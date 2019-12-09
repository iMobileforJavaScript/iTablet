import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { MTBtn, PopView } from '../../../../components'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
import { SimpleDialog } from '../../Friend'

export default class ModalBtns extends Component {
  props: {
    actionOfLocal: () => {},
    actionOfOnline: () => {},
    actionOfIPortal: () => {},
    cancel: () => {},
    actionOfWechat: () => {},
    actionOfFriend: () => {},
    showCancel: Boolean,
    style: Object,
  }
  constructor(props) {
    super(props)
    this.showCancel =
      this.props.showCancel !== undefined ? this.props.showCancel : true
  }

  setVisible = visible => {
    this.PopView && this.PopView.setVisible(visible)
  }

  render() {
    return (
      <PopView ref={ref => (this.PopView = ref)}>
        <View style={[styles.bottomBtns, { width: '100%' }, this.props.style]}>
          {this.props.actionOfLocal && (
            <MTBtn
              key={'lcoal'}
              title={getLanguage(global.language).Profile.LOCAL}
              style={styles.button}
              image={getThemeAssets().share.local}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfLocal && this.props.actionOfLocal()
              }}
            />
          )}
          {this.props.actionOfOnline && (
            <MTBtn
              key={'online'}
              title={'Online'}
              style={styles.button}
              image={getThemeAssets().share.online}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfOnline && this.props.actionOfOnline()
              }}
            />
          )}
          {this.props.actionOfIPortal && (
            <MTBtn
              key={'iportal'}
              title={'iPortal'}
              style={styles.button}
              image={getThemeAssets().share.iportal}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfIPortal && this.props.actionOfIPortal()
              }}
            />
          )}
          {this.props.actionOfWechat && (
            <MTBtn
              key={'wechat'}
              title={getLanguage(global.language).Prompt.WECHAT}
              style={styles.button}
              image={getThemeAssets().share.wechat}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.SimpleDialog.setConfirm(() => {
                  this.props.actionOfWechat && this.props.actionOfWechat()
                })
                this.SimpleDialog.setText(
                  getLanguage(global.language).Prompt.OPEN_THRID_PARTY,
                )
                this.SimpleDialog.setVisible(true)
              }}
            />
          )}
          {this.props.actionOfFriend && (
            <MTBtn
              key={'friend'}
              title={getLanguage(global.language).Navigator_Label.FRIENDS}
              style={styles.button}
              image={getThemeAssets().share.friend}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfFriend && this.props.actionOfFriend()
              }}
            />
          )}
          {!this.props.actionOfOnline && !this.props.actionOfIPortal && (
            <View style={styles.button} />
          )}
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
          <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
        </View>
      </PopView>
    )
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
