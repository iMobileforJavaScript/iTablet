/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import color from '../../../../styles/color'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    left: 0,
    right: 0,
    height: scaleSize(240),
    padding: scaleSize(20),
    backgroundColor: color.background,
  },
  closeBox: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: scaleSize(40),
    height: scaleSize(40),
  },
  closeBtn: {
    fontSize: setSpText(28),
  },
  title: {
    fontSize: setSpText(32),
  },
  info: {
    fontSize: setSpText(28),
  },
})
