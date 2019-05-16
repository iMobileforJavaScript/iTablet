/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../utils'
import color from '../../../styles/color'
// import { color } from '../../styles'
export default StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    backgroundColor: '#F0F0F0',
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightText: {
    flex: 1,
    color: '#777',
    fontSize: setSpText(22),
    textAlign: 'right',
  },
  itemName: {
    color: '#303030',
    fontSize: setSpText(26),
  },
  switch: {
    transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }],
  },
  itemArrow: {
    width: scaleSize(30),
    height: scaleSize(30),
    tintColor: color.imageColorBlack,
  },
  inputItem: {
    height: scaleSize(80),
    position: 'absolute',
    width: '100%',
    top: scaleSize(10),
    paddingHorizontal: 0,
    backgroundColor: color.white,
  },
  headerRight: {
    color: color.white,
  },
})
