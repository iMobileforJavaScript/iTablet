/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import color from '../../../../styles/color'

export default StyleSheet.create({
  box: {
    position: 'absolute',
    width: '100%',
  },
  overlayer: {
    flex: 1,
    backgroundColor: color.modalBgColor,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleSize(200),
    padding: scaleSize(20),
    backgroundColor: '#FBFBFB',
  },
  closeBox: {
    position: 'absolute',
    right: scaleSize(-20),
    top: 0,
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
  },
  closeBtn: {
    width: scaleSize(30),
    height: scaleSize(30),
  },
  title: {
    fontSize: setSpText(24),
  },
  info: {
    paddingTop: scaleSize(20),
    fontSize: setSpText(20),
  },
  search: {
    marginTop: scaleSize(20),
    height: scaleSize(60),
    flex: 1,
    borderRadius: 5,
    backgroundColor: color.blue1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTxt: {
    fontSize: setSpText(20),
    color: color.white,
  },
  searchIconWrap: {
    flex: 1,
    height: scaleSize(100),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    flex: 1,
    height: scaleSize(80),
  },
  iconTxt: {
    fontSize: setSpText(16),
  },
  itemView: {
    flex: 1,
    height: scaleSize(70),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSeparator: {
    backgroundColor: color.separateColorGray,
    flex: 1,
    height: 1,
  },
  pointImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    // backgroundColor:"pink",
    marginLeft: scaleSize(20),
  },
  itemText: {
    flex: 1,
    fontSize: scaleSize(24),
    marginLeft: scaleSize(15),
  },
})
