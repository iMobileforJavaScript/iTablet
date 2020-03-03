/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
import { ToolbarModule } from '../ToolBar/modules'
import { TouchType } from '../../../../constants'
import { getLanguage } from '../../../../language'

const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
const HEADER_PADDINGTOP = Platform.OS === 'ios' ? 20 : 0

export default class PreviewHeader extends React.Component {
  props: {
    navigation: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    this.top = new Animated.Value(-HEADER_HEIGHT)
    this.params = {}
    this.visible = false
  }

  setVisible = (iShow, params = this.params) => {
    if (iShow === this.visible) {
      return
    }
    this.params = params
    this.visible = iShow
    GLOBAL.TouchType = iShow ? TouchType.NULL : TouchType.NORMAL
    Animated.timing(this.top, {
      toValue: iShow ? 0 : -HEADER_HEIGHT,
      time: 300,
    }).start()
  }

  _back = () => {
    this.props.navigation.navigate('CustomModePage')
    this.setVisible(false, {})
    GLOBAL.PreviewColorPicker && GLOBAL.PreviewColorPicker.setVisible(false)
  }

  _confirm = () => {
    //confirm
    this.setVisible(false, {})
    GLOBAL.PreviewColorPicker && GLOBAL.PreviewColorPicker.setVisible(false)
    GLOBAL.ToolBar && GLOBAL.ToolBar.existFullMap()
    GLOBAL.TouchType = TouchType.NORMAL
    ToolbarModule.setData({})
  }
  render() {
    const backImg = require('../../../../assets/public/Frenchgrey/icon-back-white.png')
    return (
      <Animated.View style={[styles.container, { top: this.top }]}>
        <TouchableOpacity onPress={this._back}>
          <Image source={backImg} resizeMode={'contain'} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {getLanguage(this.props.language).Map_Main_Menu.CUSTOM_THEME_MAP}
          </Text>
        </View>
        <TouchableOpacity style={styles.confirm} onPress={this._confirm}>
          <Text style={styles.confirmTxt}>
            {getLanguage(this.props.language).Map_Settings.CONFIRM}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: HEADER_HEIGHT,
    paddingTop: HEADER_PADDINGTOP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.contentColorBlack,
  },
  back: {
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: '#rgba(255, 255, 255, 0)',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: color.white,
    fontSize: setSpText(36),
  },
  confirm: {
    width: scaleSize(50),
    height: scaleSize(50),
    marginHorizontal: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTxt: {
    fontSize: setSpText(20),
    color: color.white,
  },
})
