/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../utils'
import color from '../../../styles/color'
// const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
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
  inputContainer: {
    height: scaleSize(80),
    // position: 'absolute',
    width: '100%',
    // top: scaleSize(88),
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inputItem: {
    height: scaleSize(80),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scaleSize(10),
    backgroundColor: color.white,
  },
  colorView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  colorBlock: {
    height: scaleSize(40),
    width: scaleSize(80),
    borderWidth: scaleSize(2),
    borderColor: color.separateColorGray,
  },
  headerRight: {
    color: color.white,
  },
})
