/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { Platform, StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
export default StyleSheet.create({
  titleImage: {
    width: scaleSize(40),
    height: scaleSize(40),
    tintColor: color.imageColorBlack,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: scaleSize(20),
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: scaleSize(30),
    height: scaleSize(30),
    tintColor: color.imageColorBlack,
  },
  inputView: {
    width: scaleSize(122),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputItem: {
    textAlign: 'center',
    width: scaleSize(110),
    height: scaleSize(30),
    backgroundColor: color.white,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  plus: {
    width: scaleSize(30),
    height: scaleSize(30),
    borderLeftWidth: 1,
    borderColor: color.gray,
    backgroundColor: color.white,
  },
  minus: {
    width: scaleSize(30),
    height: scaleSize(30),
    borderRightWidth: 1,
    borderColor: color.gray,
    backgroundColor: color.white,
  },
  rightText: {
    textAlign: 'right',
    height: scaleSize(30),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
